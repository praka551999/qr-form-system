# QR Form System

A complete QR code-based form submission system with an admin dashboard. Users can scan a QR code, fill out a form, and administrators can view all submissions from anywhere with simple authentication.

## Features

- **QR Code Form**: Scan QR code to access form from anywhere
- **Form Submission**: Beautiful, responsive form for data collection
- **Admin Authentication**: Secure login system for admin access
- **Admin Dashboard**: View, search, filter, and export all submissions
- **Data Export**: Export submissions to CSV format
- **Real-time Updates**: Refresh data anytime
- **QR Code Generator**: Generate QR codes for your form URL
- **Mobile Responsive**: Works perfectly on all devices

## Project Structure

```
QR Form/
├── server.js              # Main backend server
├── package.json           # Dependencies and scripts
├── .env.example          # Environment variables template
├── submissions.json      # Database file (auto-generated)
└── public/               # Frontend files
    ├── form.html         # Public form page
    ├── login.html        # Admin login page
    └── admin.html        # Admin dashboard
```

## Installation

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Step 1: Install Dependencies

```bash
npm install
```

This will install all required packages:
- express
- cors
- body-parser
- jsonwebtoken
- bcryptjs
- qrcode

### Step 2: Configure Environment Variables

1. Copy `.env.example` to `.env`:
```bash
copy .env.example .env
```

2. Edit `.env` and set your credentials:
```env
PORT=3000
BASE_URL=http://localhost:3000
JWT_SECRET=your-super-secret-key-change-this
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-secure-password
```

**Note:** When deploying, set `BASE_URL` to your public URL (e.g., `https://your-app.onrender.com`)

**Important**: Change the default password before deploying!

## Running the Application

### Development Mode

```bash
npm run dev
```

This starts the server with auto-restart on file changes (requires nodemon).

### Production Mode

```bash
npm start
```

## Accessing the Application

Once the server is running, access these URLs:

- **Form Page**: http://localhost:3000/form.html
- **Admin Login**: http://localhost:3000/login.html
- **Admin Dashboard**: http://localhost:3000/admin.html

### Default Admin Credentials

- **Username**: admin
- **Password**: admin123 (or what you set in .env)

**Security Note**: Change these credentials before deploying to production!

## How to Use

### For End Users (Form Filling)

1. Scan the QR code or visit the form URL
2. Fill out all required fields
3. Click "Submit Form"
4. You'll see a success message

### For Administrators

1. Visit the admin login page
2. Enter your username and password
3. Access the dashboard to:
   - View all submissions in a table
   - Search and filter submissions
   - View detailed information for each submission
   - Delete individual submissions
   - Export data to CSV
   - Generate QR codes for the form
   - Refresh data in real-time

## API Endpoints

### Public Endpoints

- `POST /api/submit` - Submit form data
- `GET /api/health` - Server health check

### Protected Endpoints (Require Authentication)

- `POST /api/login` - Admin login
- `GET /api/submissions` - Get all submissions
- `DELETE /api/submissions/:id` - Delete a submission
- `GET /api/qrcode` - Generate QR code

## Deployment

**Want to make your form accessible from mobile phones and other devices?**

See the detailed [DEPLOYMENT.md](./DEPLOYMENT.md) guide for step-by-step instructions on deploying your QR Form System.

### Quick Summary

**Recommended: Deploy to Render.com (Free)**
- Free hosting with automatic SSL
- Deploy directly from GitHub
- Simple configuration with `render.yaml` (included)
- Perfect for QR code forms that need to be publicly accessible

**Alternative: Quick Testing with ngrok**
- For temporary public URLs
- Great for testing before full deployment
- URLs change each time you restart

For complete instructions, troubleshooting, and all deployment options, **read [DEPLOYMENT.md](./DEPLOYMENT.md)**

## Data Storage

By default, submissions are stored in `submissions.json` file. For production with many submissions, consider upgrading to:

- **MongoDB**: For cloud database
- **PostgreSQL**: For relational database
- **Firebase**: For real-time database

## Security Considerations

1. **Change Default Credentials**: Update admin username/password
2. **Use Strong JWT Secret**: Generate a random string for JWT_SECRET
3. **Enable HTTPS**: Use SSL certificate in production
4. **Rate Limiting**: Add rate limiting to prevent abuse
5. **Input Validation**: Validate all form inputs on backend
6. **CORS Configuration**: Restrict CORS to your domain

## Customization

### Modify Form Fields

Edit `public/form.html` and update the form fields. Make sure to adjust the admin dashboard table columns accordingly.

### Change Styling

All styles are inline in the HTML files. You can easily customize colors, fonts, and layouts by editing the `<style>` sections.

### Add Database Support

Replace the JSON file storage in `server.js` with your preferred database:

```javascript
// Example: MongoDB
const mongoose = require('mongoose');
const Submission = mongoose.model('Submission', submissionSchema);

// Save submission
const submission = new Submission(formData);
await submission.save();
```

## Troubleshooting

### Port Already in Use

Change the PORT in `.env` file or kill the process:
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

### Cannot Access from Other Devices

Make sure your firewall allows connections on the specified port, and use your local IP instead of localhost:
```
http://192.168.1.x:3000/form.html
```

### Token Expired Error

Login again. Tokens expire after 24 hours for security.

## Contributing

Feel free to fork this project and submit pull requests for improvements!

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For issues or questions, please open an issue on the GitHub repository.

---

Made with Node.js, Express, and lots of care!
