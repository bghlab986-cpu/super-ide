# Quick Start Guide - Super IDE

## 🚀 Quick Setup (5 minutes)

### 1. Clone Repository
```bash
git clone https://github.com/bghlab986-cpu/super-ide.git
cd super-ide
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Server
```bash
npm start
```

### 4. Open Browser
```
http://localhost:3000
```

---

## 📝 First Project

### Create HTML File
1. Click "محرر الأكواد" (Code Editor)
2. Click "+" to add new file
3. Name it `hello.html`
4. Write:
```html
<!DOCTYPE html>
<html>
<head>
    <title>My First Project</title>
</head>
<body>
    <h1>مرحبا بك في Super IDE</h1>
    <p>هذا هو مشروعي الأول</p>
</body>
</html>
```
5. Preview updates automatically

---

## 🎮 Create Simple Game

### Go to Game Engine
1. Click "محرك الألعاب"
2. Click "مشروع جديد"
3. Click "تشغيل اللعبة"
4. Use Arrow Keys to control

---

## 📂 Upload Files

### File Manager
1. Click "إدارة الملفات"
2. Drag files or click to select
3. Files appear in file tree

---

## 🌐 Scrape Web Data

### Web Scraper
1. Click "جلب البيانات من الويب"
2. Enter URL: `https://example.com`
3. Leave CSS selector empty for full page
4. Click "جلب البيانات"

---

## ⚙️ Settings

### Customize IDE
1. Click "الإعدادات"
2. Toggle Dark Mode
3. Adjust font size
4. Enable/disable auto-save

---

## 💡 Tips

- **Auto-save:** Enabled by default
- **Multiple files:** Use tabs to switch
- **Console:** View output at bottom
- **Preview:** Updates in real-time
- **Dark mode:** Saves preference

---

## 🐛 Troubleshooting

### Server won't start
```bash
# Check if port 3000 is in use
lsof -i :3000

# Use different port
PORT=3001 npm start
```

### Files not saving
- Check browser console (F12)
- Ensure localStorage is enabled
- Try different browser

### Web scraper not working
- Some websites block scraping
- Use CORS proxy if needed
- Check URL is valid

---

## 📚 Learn More

- [Full README](./README.md)
- [API Documentation](./API_DOCS.md)
- [GitHub Repository](https://github.com/bghlab986-cpu/super-ide)

---

## 🎉 Done!

You're ready to code! Enjoy Super IDE! 🚀
