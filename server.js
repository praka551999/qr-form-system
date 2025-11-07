const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Default admin credentials (in production, use environment variables)
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD_HASH = bcrypt.hashSync(process.env.ADMIN_PASSWORD || 'admin123', 10);

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Database file (JSON file for simplicity)
const DB_FILE = path.join(__dirname, 'submissions.json');

// Initialize database file if it doesn't exist
if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify([]));
}

// Helper function to read submissions
function getSubmissions() {
    try {
        const data = fs.readFileSync(DB_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading submissions:', error);
        return [];
    }
}

// Helper function to save submissions
function saveSubmissions(submissions) {
    try {
        fs.writeFileSync(DB_FILE, JSON.stringify(submissions, null, 2));
        return true;
    } catch (error) {
        console.error('Error saving submissions:', error);
        return false;
    }
}

// Authentication middleware
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token.' });
        }
        req.user = user;
        next();
    });
}

// Routes

// 1. Submit form data (public endpoint)
app.post('/api/submit', (req, res) => {
    try {
        const formData = req.body;

        // Add metadata
        const submission = {
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
            data: formData
        };

        // Read existing submissions
        const submissions = getSubmissions();

        // Add new submission
        submissions.push(submission);

        // Save to file
        if (saveSubmissions(submissions)) {
            res.status(201).json({
                success: true,
                message: 'Form submitted successfully!',
                id: submission.id
            });
        } else {
            res.status(500).json({ error: 'Failed to save submission.' });
        }
    } catch (error) {
        console.error('Error processing submission:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// 2. Admin login
app.post('/api/login', (req, res) => {
    try {
        const { username, password } = req.body;

        // Validate credentials
        if (username === ADMIN_USERNAME && bcrypt.compareSync(password, ADMIN_PASSWORD_HASH)) {
            // Generate JWT token
            const token = jwt.sign(
                { username: username, role: 'admin' },
                JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.json({
                success: true,
                token: token,
                message: 'Login successful!'
            });
        } else {
            res.status(401).json({ error: 'Invalid username or password.' });
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// 3. Get all submissions (protected endpoint)
app.get('/api/submissions', authenticateToken, (req, res) => {
    try {
        const submissions = getSubmissions();
        res.json({
            success: true,
            count: submissions.length,
            submissions: submissions
        });
    } catch (error) {
        console.error('Error fetching submissions:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// 4. Delete a submission (protected endpoint)
app.delete('/api/submissions/:id', authenticateToken, (req, res) => {
    try {
        const { id } = req.params;
        let submissions = getSubmissions();

        const initialLength = submissions.length;
        submissions = submissions.filter(sub => sub.id !== id);

        if (submissions.length < initialLength) {
            if (saveSubmissions(submissions)) {
                res.json({
                    success: true,
                    message: 'Submission deleted successfully!'
                });
            } else {
                res.status(500).json({ error: 'Failed to delete submission.' });
            }
        } else {
            res.status(404).json({ error: 'Submission not found.' });
        }
    } catch (error) {
        console.error('Error deleting submission:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// 5. Generate QR code for form URL
app.get('/api/qrcode', async (req, res) => {
    try {
        const formUrl = req.query.url || `${BASE_URL}/form.html`;

        // Generate QR code as data URL
        const qrCodeDataUrl = await QRCode.toDataURL(formUrl, {
            width: 300,
            margin: 2,
            color: {
                dark: '#000000',
                light: '#FFFFFF'
            }
        });

        res.json({
            success: true,
            qrCode: qrCodeDataUrl,
            url: formUrl
        });
    } catch (error) {
        console.error('Error generating QR code:', error);
        res.status(500).json({ error: 'Failed to generate QR code.' });
    }
});

// 6. Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════════════════╗
║        QR Form System Server                          ║
╠═══════════════════════════════════════════════════════╣
║  Server running on: ${BASE_URL.padEnd(40)} ║
║                                                       ║
║  Endpoints:                                           ║
║  - Form: ${BASE_URL}/form.html${' '.repeat(Math.max(0, 30 - BASE_URL.length))} ║
║  - Admin Login: ${BASE_URL}/login.html${' '.repeat(Math.max(0, 25 - BASE_URL.length))} ║
║  - Admin Dashboard: ${BASE_URL}/admin.html${' '.repeat(Math.max(0, 25 - BASE_URL.length))} ║
║                                                       ║
║  Default Admin Credentials:                           ║
║  Username: ${ADMIN_USERNAME}                                      ║
║  Password: ${process.env.ADMIN_PASSWORD || 'admin123'}                                ║
╚═══════════════════════════════════════════════════════╝
    `);
});
