# 🩸 SugarControl

> Modern diabetes diet management app with personalized meal recommendations based on blood sugar levels.

[![Build & Push Docker Image](https://github.com/Harinzu47/sugar-control-app/actions/workflows/docker-publish.yml/badge.svg)](https://github.com/Harinzu47/sugar-control-app/actions/workflows/docker-publish.yml)
![SugarControl](https://img.shields.io/badge/Version-1.0.0-4ECDC4?style=for-the-badge)
![JavaScript](https://img.shields.io/badge/JavaScript-Vanilla-F7DF1E?style=for-the-badge&logo=javascript)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-7952B3?style=for-the-badge&logo=bootstrap)
![PWA](https://img.shields.io/badge/PWA-Ready-5A0FC8?style=for-the-badge)

---

## ✨ Features

- 🍽️ **DiabetesDish Matcher** - Get personalized food recommendations based on your blood sugar level
- 📊 **Visual Glucose Gauge** - Interactive visual indicator showing your blood sugar range
- 📰 **Health Blogs** - Latest diabetes and nutrition articles from trusted sources
- 📱 **PWA Support** - Install as app & works offline
- ♿ **Accessible** - ARIA labels, keyboard navigation, reduced motion support

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| Vanilla JavaScript (ES6+) | Core SPA functionality |
| Bootstrap 5 | UI framework & components |
| Webpack 5 | Module bundler |
| Lazysizes | Image lazy loading |
| Service Worker | PWA & offline support |
| Spoonacular API | Recipe & nutrition data |
| GNews API | Diabetes health articles |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- npm 8+

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/Sugar-App.git
   cd Sugar-App
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Copy `.env.example` to `.env` and add your API keys:
   ```env
   SPOONACULAR_API_KEY=your_spoonacular_api_key
   GNEWS_API_KEY=your_gnews_api_key
   ```

4. **Start development server**
   ```bash
   npm run start-dev
   ```

5. **Open in browser**
   ```
   http://localhost:3030
   ```

### Build for Production
```bash
npm run build
```
Output will be in the `dist/` folder.

---

## 📁 Project Structure

```
Sugar-App/
├── src/
│   ├── public/           # Static assets & manifest
│   ├── scripts/
│   │   ├── data/         # API sources
│   │   ├── global/       # Config & endpoints
│   │   ├── routes/       # SPA routing
│   │   ├── utils/        # Utilities
│   │   └── views/        # Pages & templates
│   ├── styles/           # CSS files
│   └── templates/        # HTML template
├── .env                  # Environment variables (gitignored)
├── .env.example          # Environment template
├── webpack.common.js     # Webpack shared config
├── webpack.dev.js        # Development config
└── webpack.prod.js       # Production config
```

---

## 🎨 Design System

| Color | Hex | Usage |
|-------|-----|-------|
| Mint Green | `#4ECDC4` | Primary |
| Deep Navy | `#1A2B4A` | Text |
| Orange | `#FF6B35` | CTA/Accent |

**Font**: Poppins (Google Fonts)

---

## 📱 PWA Features

- ✅ Installable on mobile/desktop
- ✅ Offline caching with Service Worker
- ✅ Network-first strategy with fallback
- ✅ App manifest for home screen

---

## 🔒 Security

- API keys stored in `.env` (never committed)
- `.env` added to `.gitignore`
- Uses `dotenv-webpack` for build-time injection

---

## 📄 License

MIT License - feel free to use for personal or commercial projects.

---

## 👨‍💻 Author

**Khalid Jundullah**
- LinkedIn: [khalid-jundullah](https://www.linkedin.com/in/khalid-jundullah-8086b8249/)
- Instagram: [@khalid.jundullah](https://www.instagram.com/khalid.jundullah/)

---

<p align="center">
  Made with ❤️ for diabetic health awareness
</p>
