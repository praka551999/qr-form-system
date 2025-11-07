# Deployment Guide - QR Form System

This guide will help you deploy your QR Form System to make it accessible from anywhere, including mobile phones.

## Why Deploy?

When running locally on `localhost:3000`, the application is only accessible on your computer. To scan QR codes with your phone and access the form from anywhere, you need to deploy it to a public server.

## Recommended: Deploy to Render (Free)

Render offers free hosting for web applications. Follow these steps:

### Step 1: Prepare Your Code

1. Make sure all your code is saved
2. Initialize a Git repository (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit for deployment"
   ```

### Step 2: Create a GitHub Repository

1. Go to [GitHub](https://github.com) and create a new repository
2. Push your code to GitHub:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git branch -M main
   git push -u origin main
   ```

### Step 3: Deploy on Render

1. Go to [Render.com](https://render.com) and sign up/login
2. Click "New +" and select "Web Service"
3. Connect your GitHub account and select your repository
4. Render will auto-detect the settings from `render.yaml`
5. Click "Create Web Service"

### Step 4: Configure Environment Variables

After deployment, go to your service's **Environment** tab and set:

- `BASE_URL`: Your Render URL (e.g., `https://your-app-name.onrender.com`)
- `ADMIN_USERNAME`: Your admin username
- `ADMIN_PASSWORD`: A secure password (Render will generate JWT_SECRET automatically)

### Step 5: Access Your Application

Once deployed, you'll get a URL like: `https://your-app-name.onrender.com`

Your endpoints will be:
- Form: `https://your-app-name.onrender.com/form.html`
- Admin: `https://your-app-name.onrender.com/admin.html`
- Login: `https://your-app-name.onrender.com/login.html`

### Step 6: Generate QR Code

1. Go to your admin dashboard
2. The QR code will now point to your public URL
3. Anyone can scan it and access your form!

## Alternative: Quick Testing with ngrok

If you just want to test quickly without deploying:

1. Install ngrok: Download from [ngrok.com](https://ngrok.com)
2. Run your server locally: `npm start`
3. In another terminal, run: `ngrok http 3000`
4. Use the ngrok URL (e.g., `https://abc123.ngrok.io`) as your BASE_URL
5. Generate QR code with this URL

**Note:** ngrok URLs are temporary and change each time you restart.

## Other Deployment Options

### Railway.app (Free)
- Similar to Render
- Connect GitHub repo
- Auto-deploys on push
- Free tier available

### Heroku (Paid)
- Popular platform
- No longer has free tier
- Good for production apps

### Vercel (Free for Node.js apps)
- Great for serverless deployments
- Free tier available

## Troubleshooting

### QR Code Still Shows Localhost
- Make sure you set the `BASE_URL` environment variable to your deployment URL
- Restart your service after updating environment variables
- Clear your browser cache and regenerate the QR code

### Form Not Submitting
- Check browser console for errors
- Verify CORS is enabled (it's set in server.js)
- Ensure your deployment service allows POST requests

### Admin Login Not Working
- Verify you set `ADMIN_USERNAME` and `ADMIN_PASSWORD` environment variables
- Check that `JWT_SECRET` is set (Render generates this automatically)

## Security Notes

1. **Change Default Credentials**: Never use "admin/admin123" in production
2. **Use Strong Secrets**: Let Render generate secure JWT_SECRET
3. **HTTPS Only**: Render provides free SSL certificates
4. **Environment Variables**: Never commit secrets to Git

## Need Help?

- Render Documentation: https://render.com/docs
- Check your server logs in the Render dashboard
- Verify all environment variables are set correctly
