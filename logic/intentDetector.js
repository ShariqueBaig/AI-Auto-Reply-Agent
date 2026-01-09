
/**
 * Intent Detector Module
 * Categorizes customer messages into predefined intents.
 */

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

    if (/hi|hello|hey|good morning|hola/i.test(input)) {
        return INTENTS.GREETING;
    }
    
    if (/price|cost|how much|$$|price list/i.test(input)) {
        return INTENTS.PRICING;
    }

    if (/ship|delivery|track|order|where is my/i.test(input)) {
        return INTENTS.SHIPPING;
    }

    if (/available|stock|size|color|product|details/i.test(input)) {
        return INTENTS.PRODUCT_QUERY;
    }

    if (/bad|broken|wrong|refund|not working|terrible|slow/i.test(input)) {
        return INTENTS.COMPLAINT;
    }

    return INTENTS.UNKNOWN;
};

export { detectIntent, INTENTS };
