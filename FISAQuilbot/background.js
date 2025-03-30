// ChatGPT Enhancer Background Service
(function() {
  "use strict";

  const chatHistory = [];
  let rateLimit = {
    remaining: 50,
    limit: 50,
    reset: Date.now() + 3600000 // 1 hour from now
  };

  // Process chat messages
  async function processChat(message) {
    try {
      // Save to history
      chatHistory.push({
        timestamp: Date.now(),
        message: message
      });

      // Update rate limit
      if (rateLimit.remaining > 0) {
        rateLimit.remaining--;
      }

      return { 
        success: true,
        history: chatHistory,
        rateLimit: rateLimit
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Message handler
  chrome = chrome ?? browser;
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    switch(request.type) {
      case 'chat-process':
        processChat(request.message).then(sendResponse);
        return true; // Required for async response
      case 'get-history':
        sendResponse({ history: chatHistory });
        break;
      case 'get-rate-limit':
        sendResponse({ rateLimit });
        break;
      default:
        sendResponse({ 
          success: false,
          error: 'Unknown request type'
        });
    }
  });

  // Reset rate limit periodically
  setInterval(() => {
    rateLimit = {
      remaining: 50,
      limit: 50,
      reset: Date.now() + 3600000
    };
  }, 3600000); // Every hour
})();
