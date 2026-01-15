# Quick Start Guide - Orange Corners Mentorship Booking

## 🚀 Getting Started in 3 Steps

### Step 1: Set Up Your Database

1. Go to [Neon](https://neon.tech) and create a free PostgreSQL database
2. Copy your connection string (it looks like: `postgresql://user:password@host/database`)
3. Run the database schema:
   ```bash
   psql <your-connection-string> < database/schema.sql
   ```

### Step 2: Configure Environment

1. Create a `.env` file in the project root:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your database URL:
   ```
   DATABASE_URL=postgresql://user:password@host/database?sslmode=require
   ```

### Step 3: Test Locally

```bash
# Install Netlify CLI (if not already installed)
npm install -g netlify-cli

# Start the development server
netlify dev
```

Visit `http://localhost:8888` to see your app!

---

## 📦 Deploy to Netlify

### Option 1: Netlify CLI

```bash
netlify init
netlify deploy --prod
```

### Option 2: GitHub Integration

1. Push your code to GitHub
2. Go to [Netlify](https://netlify.com)
3. Click "Add new site" → "Import an existing project"
4. Connect your GitHub repository
5. Add environment variable: `DATABASE_URL=your_database_url`
6. Deploy!

---

## 🎯 How to Use

### For Organizers

1. **Create a Project**
   - Visit your deployed site homepage
   - Fill in project details
   - Add time slots (date, time, duration)
   - Click "Créer le projet"
   
2. **Share Links**
   - Copy the **public link** → Share with entrepreneurs
   - Save the **admin link** → Use to track bookings

3. **Track Bookings**
   - Open your admin link
   - View statistics and booked slots
   - Export data to CSV

### For Entrepreneurs

1. Open the public booking link
2. Browse available slots
3. Click on a slot to book
4. Fill in your details
5. Confirm booking
6. Done! ✅

---

## 🔧 Troubleshooting

**Build fails?**
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Database connection error?**
- Check your `DATABASE_URL` is correct
- Ensure it includes `?sslmode=require` at the end
- Verify the database is accessible

**Functions not working locally?**
- Use `netlify dev` instead of `npm run dev`
- Check `.env` file exists and has correct values

---

## 📝 Important Notes

- **Logo**: Replace `/public/orange-corners-logo.svg` with your actual Orange Corners logo
- **Colors**: Customize in `tailwind.config.js` if needed
- **Email Notifications**: Not implemented yet (future enhancement)
- **Security**: Admin tokens are secure random strings, but consider adding proper authentication for production

---

## 🎨 Customization

### Change Brand Colors

Edit `tailwind.config.js`:
```javascript
colors: {
  'oc-orange': '#YOUR_COLOR',
  'oc-dark': '#YOUR_COLOR',
  // ...
}
```

### Add More Fields

1. Update database schema in `database/schema.sql`
2. Add fields to TypeScript types in `src/types/index.ts`
3. Update API functions in `netlify/functions/`
4. Update frontend forms

---

## 📚 Resources

- [Full README](./README.md) - Detailed documentation
- [Walkthrough](/.gemini/antigravity/brain/.../walkthrough.md) - Complete implementation details
- [Database Schema](./database/schema.sql) - SQL structure

---

## ✅ What's Included

- ✅ Project creation with unlimited slots
- ✅ Public booking interface
- ✅ Admin dashboard with statistics
- ✅ CSV export
- ✅ Duplicate booking prevention
- ✅ Concurrency control
- ✅ Mobile-responsive design
- ✅ Orange Corners branding

**Ready to launch!** 🚀
