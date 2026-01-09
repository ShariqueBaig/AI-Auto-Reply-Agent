# AI Auto-Reply Agent | Instagram & WhatsApp Comment Simulation

![Final Dashboard Output](C:/Users/AS/.gemini/antigravity/brain/d0b9a85f-af5a-45b1-94a7-0220854bbbcc/final_test_dashboard_1767966454642.png)

A premium, AI-powered customer support simulation designed to monitor and automatically reply to Instagram and WhatsApp comments. Built with **Google Gemini 3 Flash** for intelligent, context-aware interactions.

## 🚀 Key Features

- **Gemini 3 Flash Integration**: Leverages `gemini-3-flash-preview` for high-quality, pro-level intelligence.
- **Intent Detection**: Real-time classification of customer queries (Greeting, Pricing, Shipping, Product Info, Complaint).
- **Escalation Engine**: Automatically flags high-priority complaints or complex queries for human intervention.
- **Real-time Analytics**: Visual dashboard tracking message volume, response rates, and intent distribution.
- **Premium Design**: Modern Glassmorphism UI with smooth animations and interactive states.

## 🛠️ Tech Stack

- **Frontend**: Vanilla HTML5, CSS3, JavaScript (ES6+)
- **AI Engine**: Google Gemini API (via Google AI Studio)
- **Styling**: Modern CSS with custom properties and animations

## ⚙️ Setup & Installation

### 1. Prerequisites
- A Google AI Studio API Key. Get one at [aistudio.google.com](https://aistudio.google.com/).

### 2. Configure API Key
Open `app.js` and locate the `CONFIG` object at the top:

```javascript
const CONFIG = {
    GEMINI_API_KEY: 'YOUR_API_KEY_HERE',
    // ...
};
```
Replace `'YOUR_API_KEY_HERE'` with your actual API key.

### 3. Run the Application
Simply open `index.html` in any modern web browser.
> **Note**: The application is optimized to run directly via the `file://` protocol for easy demonstration.

## 📖 Usage Guide

1. **Toggle AI Mode**: Use the "Use Gemini AI" switch to toggle between generative AI replies and rule-based fallback logic.
2. **Post Comments**: Enter a sample comment (e.g., "How much for the blue shirt?") in the input box.
3. **Observe Analytics**: Watch the dashboard update in real-time as the agent processes intents.
4. **Monitor Escalations**: Check the Escalation Queue for messages that require human attention.

## 🤝 Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
