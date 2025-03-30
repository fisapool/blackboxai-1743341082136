// ChatGPT Enhancer Background Service
(function() {
  "use strict";

  const chatHistory = [];
  const enhancementPresets = {
    rewrite: "Improve this text while keeping the original meaning:",
    summarize: "Summarize this text in key points:",
    expand: "Expand on this idea with more details:"
  };

  // Process enhancement requests
  async function processEnhancement(message, preset) {
    try {
      const enhancedText = await applyEnhancement(message, preset);
      
      // Save to history
      chatHistory.push({
        timestamp: Date.now(),
        original: message,
        enhanced: enhancedText,
        preset: preset
      });

      return { 
        success: true,
        enhancedText,
        history: chatHistory.slice(-10) // Return last 10 items
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Apply enhancement using AI
  async function applyEnhancement(text, preset) {
    // TODO: Implement actual enhancement logic
    return `${enhancementPresets[preset]} ${text}`;
  }

  // Message handler
  chrome = chrome ?? browser;
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    switch(request.type) {
      case 'chat-process':
        processEnhancement(request.message, request.preset)
          .then(sendResponse);
        return true;
      case 'get-history':
        sendResponse({ history: chatHistory.slice(-10) });
        return true;
      default:
        sendResponse({ 
          success: false,
          error: 'Unknown request type'
        });
    }
  });
})();
