
/**
 * Analytics Module
 * Tracks message statistics.
 */

let stats = {
    totalMessages: 0,
    autoReplied: 0,
    escalated: 0,
    intentCounts: {}
};

const trackMessage = (intent, wasEscalated) => {
    stats.totalMessages++;
    if (wasEscalated) {
        stats.escalated++;
    } else {
        stats.autoReplied++;
    }

    stats.intentCounts[intent] = (stats.intentCounts[intent] || 0) + 1;
};

const getStats = () => ({ ...stats });

export { trackMessage, getStats };
