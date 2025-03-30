// ChatGPT Enhancer Injection
chrome = chrome ?? browser;

// Initialize enhancer
function initEnhancer() {
  // Inject main script
  const script = document.createElement('script');
  script.src = chrome.runtime.getURL('quillbot.js');
  script.onload = function() { script.remove(); };
  document.documentElement.prepend(script);

  // Listen for chat messages
  document.addEventListener('chatgpt-message', async (event) => {
    const response = await chrome.runtime.sendMessage({
      type: 'chat-process',
      message: event.detail
    });
    document.dispatchEvent(new CustomEvent('chatgpt-response', {
      detail: response
    }));
  });
}

// Wait for ChatGPT interface to load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initEnhancer);
} else {
  initEnhancer();
}
