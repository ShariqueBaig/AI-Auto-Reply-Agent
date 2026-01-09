
import { INTENTS } from './intentDetector.js';

/**
 * FAQ Response Engine
 * Provides canned responses based on detected intents.
 */

const RESPONSES = {
    [INTENTS.GREETING]: "Hello! Thank you for reaching out. How can we help you today?",
    [INTENTS.PRICING]: "Our pricing varies by product. You can check our full catalog at shop.example.com for up-to-date prices!",
    [INTENTS.SHIPPING]: "Orders are typically processed in 1-2 business days. Shipping takes 3-5 days. Use your order ID to track on our site.",
    [INTENTS.PRODUCT_QUERY]: "Most our items are in stock! If you need specific size/color info, please check the product page.",
    [INTENTS.COMPLAINT]: "We are sorry to hear you're having trouble. We've escalated this to a human agent who will contact you shortly.",
    [INTENTS.UNKNOWN]: "I'm not quite sure I understand. Let me get a human agent to help you out!"
};

const getResponse = (intent) => {
    return RESPONSES[intent] || RESPONSES[INTENTS.UNKNOWN];
};

const needsEscalation = (intent) => {
    return intent === INTENTS.COMPLAINT || intent === INTENTS.UNKNOWN;
};

export { getResponse, needsEscalation };
