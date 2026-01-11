# Scoop AI Chat Widget 🍨💬

**React-based Chat Widget for Scoop.ge** - Real-time Streaming

[![React](https://img.shields.io/badge/React-19.1-61dafb.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
[![Cloud Run](https://img.shields.io/badge/Google-Cloud%20Run-blue.svg)](https://cloud.google.com/run)

---

## 🎯 რა არის?

Scoop AI Chat Widget არის **React-based** ჩატ ვიჯეტი სპორტული კვების კონსულტაციისთვის.

### ✨ ფუნქციონალი

- 🎨 **Light Theme** - Scoop brand colors (Pine Green #0A7364)
- ⚡ **Real-time Streaming** - Token-by-token responses
- 💬 **Quick Replies** - კონტექსტური ღილაკები
- 📝 **Markdown Rendering** - ფორმატირებული პასუხები
- 📱 **Responsive Design** - Mobile-friendly
- 🇬🇪 **Georgian Language** - სრული ქართული interface

---

## 🚀 Quick Start

### Development

```bash
npm install
npm run dev
# → http://localhost:5173
```

### Production Build

```bash
npm run build
npm run preview
```

---

## 🏗️ არქიტექტურა

```
scoop-widget/
├── src/
│   ├── App.tsx              # Main app + Streaming logic
│   ├── components/
│   │   ├── ChatArea.tsx     # Chat messages + Quick Replies
│   │   ├── Sidebar.tsx      # Conversation list
│   │   └── SuggestionCards.tsx  # Welcome cards
│   └── styles/
│       └── widget.css       # All styling
├── Dockerfile               # Cloud Run deployment
└── nginx.conf               # Static file serving
```

---

## 📡 API Integration

Widget connects to Scoop AI Backend:

```typescript
const BACKEND_URL = 'https://scoop-ai-sdk-358331686110.europe-west1.run.app';

// Streaming endpoint
POST /chat/stream → SSE (Server-Sent Events)

// Fallback endpoint
POST /chat → JSON response
```

---

## 🎨 Branding

| Element | Value |
|---------|-------|
| Primary Color | `#0A7364` (Pine Green) |
| Theme | Light |
| Font | Noto Sans Georgian |
| Icon | 🍨 |

---

## 🚀 Deployment

### Cloud Run (Recommended)

Service deployed at:
```
https://scoop-widget-358331686110.europe-west1.run.app
```

### Auto-Deploy

GitHub push → Cloud Build → Cloud Run (automatic)

---

## 📦 Tech Stack

- **React 19.1** - UI framework
- **TypeScript 5.8** - Type safety
- **Vite 7.3** - Build tool
- **react-markdown** - Markdown rendering
- **Nginx** - Static file serving (production)

---

## 🔗 Related Repositories

- [claude-agent-experiments](https://github.com/Maqashable-284/claude-agent-experiments) - Backend API
- [scoop-chainlit](https://github.com/Maqashable-284/scoop-chainlit) - Chainlit Web UI

---

## 📄 License

MIT
