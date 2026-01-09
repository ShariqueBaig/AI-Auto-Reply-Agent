
/**
 * AI Auto-Reply Agent - Consolidated Script
 * Merged to support file:// protocol (bypassing ESM CORS restrictions)
 */

// --- 1. CONFIGURATION ---
const CONFIG = {
    GEMINI_API_KEY: localStorage.getItem('GEMINI_API_KEY') || '',
    GEMINI_URL: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent'
};

// --- 2. SETTINGS MANAGEMENT ---
const settingsPanel = document.getElementById('settingsPanel');
const toggleSettingsBtn = document.getElementById('toggleSettings');
const apiKeyInput = document.getElementById('apiKeyInput');
const saveApiKeyBtn = document.getElementById('saveApiKey');

// Load existing key into input
if (CONFIG.GEMINI_API_KEY) {
    apiKeyInput.value = CONFIG.GEMINI_API_KEY;
}

toggleSettingsBtn.addEventListener('click', () => {
    settingsPanel.classList.toggle('active');
});

saveApiKeyBtn.addEventListener('click', () => {
    const newKey = apiKeyInput.value.trim();
    if (newKey) {
        localStorage.setItem('GEMINI_API_KEY', newKey);
        CONFIG.GEMINI_API_KEY = newKey;
        alert('API Key saved locally!');
        settingsPanel.classList.remove('active');
    }
});

// --- 2. INTENT DETECTION ---
const INTENTS = {
    GREETING: 'GREETING',
    PRICING: 'PRICING',
    SHIPPING: 'SHIPPING',
    PRODUCT_QUERY: 'PRODUCT_QUERY',
    COMPLAINT: 'COMPLAINT',
    UNKNOWN: 'UNKNOWN'
};

const detectIntent = (text) => {
    const input = text.toLowerCase().trim();
    if (/hi|hello|hey|good morning|hola/i.test(input)) return INTENTS.GREETING;
    if (/price|cost|how much|$$|price list/i.test(input)) return INTENTS.PRICING;
    if (/ship|delivery|track|order|where is my/i.test(input)) return INTENTS.SHIPPING;
    if (/available|stock|size|color|product|details/i.test(input)) return INTENTS.PRODUCT_QUERY;
    if (/bad|broken|wrong|refund|not working|terrible|slow/i.test(input)) return INTENTS.COMPLAINT;
    return INTENTS.UNKNOWN;
};

// --- 3. RESPONSE ENGINE ---
const RESPONSES = {
    [INTENTS.GREETING]: "Hello! Thank you for reaching out. How can we help you today?",
    [INTENTS.PRICING]: "Our pricing varies by product. You can check our full catalog at shop.example.com for up-to-date prices!",
    [INTENTS.SHIPPING]: "Orders are typically processed in 1-2 business days. Shipping takes 3-5 days. Use your order ID to track on our site.",
    [INTENTS.PRODUCT_QUERY]: "Most our items are in stock! If you need specific size/color info, please check the product page.",
    [INTENTS.COMPLAINT]: "We are sorry to hear you're having trouble. We've escalated this to a human agent who will contact you shortly.",
    [INTENTS.UNKNOWN]: "I'm not quite sure I understand. Let me get a human agent to help you out!"
};

const getResponse = (intent) => RESPONSES[intent] || RESPONSES[INTENTS.UNKNOWN];
const needsEscalation = (intent) => intent === INTENTS.COMPLAINT || intent === INTENTS.UNKNOWN;

// --- 4. ANALYTICS ---
let stats = {
    totalMessages: 0,
    autoReplied: 0,
    escalated: 0,
    intentCounts: {}
};

const trackMessage = (intent, wasEscalated) => {
    stats.totalMessages++;
    if (wasEscalated) stats.escalated++;
    else stats.autoReplied++;
    stats.intentCounts[intent] = (stats.intentCounts[intent] || 0) + 1;
};

// --- 5. GEMINI SERVICE ---
const callGemini = async (userComment) => {
    if (!CONFIG.GEMINI_API_KEY) {
        return {
            reply: "Please click the ⚙️ Settings button and enter your Gemini API Key to use the AI features.",
            escalated: false,
            intent: 'ERROR'
        };
    }

    const prompt = `
        You are an AI customer support agent for an Instagram/WhatsApp business.
        Your goal is to reply to customer comments professionally and helpfuly.
        If the customer has a complaint or a very complex question you can't satisfy, 
        end your response with [ESCALATE].
        
        Customer says: "${userComment}"
        
        Reply:
    `;

    try {
        const response = await fetch(`${CONFIG.GEMINI_URL}?key=${CONFIG.GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            console.error('Gemini API Error details:', errData);
            throw new Error(`API returned ${response.status}: ${errData.error?.message || 'Unknown error'}`);
        }

        const data = await response.json();
        const replyText = data.candidates[0].content.parts[0].text.trim();
        const escalated = replyText.includes('[ESCALATE]');
        const cleanReply = replyText.replace('[ESCALATE]', '').trim();

        return { reply: cleanReply, escalated, intent: 'GEN-AI' };
    } catch (error) {
        console.error('Gemini Error:', error);
        return {
            reply: "I'm having trouble connecting to my AI brain. Let me get a human to help!",
            escalated: true,
            intent: 'ERROR'
        };
    }
};

// --- 6. UI ORCHESTRATION ---
const commentInput = document.getElementById('commentInput');
const sendBtn = document.getElementById('sendBtn');
const feed = document.getElementById('feed');
const totalMsgEl = document.getElementById('totalMsg');
const autoRepliedEl = document.getElementById('autoReplied');
const escalatedEl = document.getElementById('escalated');
const intentStatsEl = document.getElementById('intentStats');
const escalationQueueEl = document.getElementById('escalationQueue');
const aiToggle = document.getElementById('aiToggle');

let escalations = [];

const init = () => {
    console.log("AI Agent initialized.");
    updateAnalyticsUI();
    sendBtn.addEventListener('click', handleProcessComment);
    commentInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleProcessComment();
    });
};

const handleProcessComment = async () => {
    const text = commentInput.value.trim();
    if (!text) return;

    addMessageToFeed(text, 'user');
    commentInput.value = '';
    const thinkingId = addThinkingToFeed();

    let result;
    if (aiToggle.checked) {
        result = await callGemini(text);
    } else {
        const intent = detectIntent(text);
        result = {
            reply: getResponse(intent),
            escalated: needsEscalation(intent),
            intent: intent
        };
        await new Promise(r => setTimeout(r, 600));
    }

    removeThinkingFromFeed(thinkingId);
    trackMessage(result.intent, result.escalated);
    addMessageToFeed(result.reply, 'bot', result.intent);

    if (result.escalated) {
        addToEscalationQueue(text, result.intent);
    }
    updateAnalyticsUI();
};

const addThinkingToFeed = () => {
    const id = 'thinking-' + Date.now();
    const msg = document.createElement('div');
    msg.id = id;
    msg.className = 'bot-msg message-bubble thinking';
    msg.innerHTML = '<div class="dot"></div><div class="dot"></div><div class="dot"></div>';
    feed.appendChild(msg);
    feed.scrollTop = feed.scrollHeight;
    return id;
};

const removeThinkingFromFeed = (id) => {
    const el = document.getElementById(id);
    if (el) el.remove();
};

const addMessageToFeed = (text, sender, intent = null) => {
    const msg = document.createElement('div');
    msg.className = `${sender}-msg message-bubble`;
    let content = `<div>${text}</div>`;
    if (intent) content += `<span class="intent-tag">Intent: ${intent}</span>`;
    msg.innerHTML = content;
    feed.appendChild(msg);
    feed.scrollTop = feed.scrollHeight;
};

const addToEscalationQueue = (text, intent) => {
    escalations.unshift({ text, intent, time: new Date().toLocaleTimeString() });
    renderEscalationQueue();
};

const renderEscalationQueue = () => {
    if (escalations.length === 0) {
        escalationQueueEl.innerHTML = '<p style="color: var(--text-dim); font-size: 0.9rem; text-align: center; margin-top: 1rem;">No pending escalations.</p>';
        return;
    }
    escalationQueueEl.innerHTML = escalations.map(item => `
        <div class="escalated-item">
            <span class="escalated-reason">${item.intent === 'UNKNOWN' || item.intent === 'GEN-AI' || item.intent === 'ERROR' ? 'Needs Review' : 'Escalated'}</span>
            <div style="margin-bottom: 0.25rem;">"${item.text}"</div>
            <div style="font-size: 0.7rem; color: var(--text-dim);">${item.time}</div>
        </div>
    `).join('');
};

const updateAnalyticsUI = () => {
    totalMsgEl.textContent = stats.totalMessages;
    autoRepliedEl.textContent = stats.autoReplied;
    escalatedEl.textContent = stats.escalated;

    const total = stats.totalMessages || 1;
    const allIntents = [...Object.values(INTENTS), 'GEN-AI'];
    intentStatsEl.innerHTML = allIntents.map(label => {
        const count = stats.intentCounts[label] || 0;
        const percentage = (count / total) * 100;
        return `
            <div class="intent-row">
                <span style="width: 100px;">${label}</span>
                <div class="progress-bar-bg">
                    <div class="progress-bar-fill" style="width: ${percentage}%"></div>
                </div>
                <span style="width: 20px; text-align: right;">${count}</span>
            </div>
        `;
    }).join('');
};

document.addEventListener('DOMContentLoaded', init);
