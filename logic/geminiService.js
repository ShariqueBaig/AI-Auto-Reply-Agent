
import { CONFIG } from './config.js';

/**
 * Gemini Service Module
 * Handles direct communication with Google AI Studio Gemini API.
 */

const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

export const callGemini = async (userComment) => {
    const prompt = `
        You are an AI customer support agent for an Instagram/WhatsApp business.
        Your goal is to reply to customer comments professionally and helpfuly.
        If the customer has a complaint or a very complex question you can't satisfy, 
        end your response with [ESCALATE].
        
        Customer says: "${userComment}"
        
        Reply:
    `;

    try {
        const response = await fetch(`${API_URL}?key=${CONFIG.GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: prompt }]
                }]
            })
        });

        if (!response.ok) {
            throw new Error('Gemini API call failed');
        }

        const data = await response.json();
        const replyText = data.candidates[0].content.parts[0].text.trim();

        const needsEscalation = replyText.includes('[ESCALATE]');
        const cleanReply = replyText.replace('[ESCALATE]', '').trim();

        return {
            reply: cleanReply,
            escalated: needsEscalation,
            intent: 'GEN-AI'
        };
    } catch (error) {
        console.error('Gemini Error:', error);
        return {
            reply: "I'm having trouble connecting to my AI brain. Let me get a human to help!",
            escalated: true,
            intent: 'ERROR'
        };
    }
};
