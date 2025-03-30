// ChatGPT Enhancer Injection
chrome = chrome ?? browser;

// Initialize enhancer with MutationObserver
function initEnhancer() {
  const observer = new MutationObserver((mutations) => {
    // Look for ChatGPT's input area
    const inputArea = document.querySelector('textarea[id="prompt-textarea"]');
    if (inputArea && !inputArea.dataset.enhanced) {
      inputArea.dataset.enhanced = 'true';
      enhanceInput(inputArea);
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  // Inject main script
  const script = document.createElement('script');
  script.src = chrome.runtime.getURL('quillbot.js');
  script.onload = function() { script.remove(); };
  document.documentElement.prepend(script);
}

// Enhance ChatGPT input area
function enhanceInput(inputArea) {
  // Add custom buttons or UI elements
  const container = inputArea.closest('.relative') || inputArea.parentNode;
  const enhanceBtn = document.createElement('button');
  enhanceBtn.className = 'enhance-btn';
  enhanceBtn.textContent = 'Enhance';
  enhanceBtn.addEventListener('click', handleEnhance);
  container.appendChild(enhanceBtn);
}

// Handle enhancement requests
async function handleEnhance() {
  const inputArea = document.querySelector('textarea[id="prompt-textarea"]');
  if (inputArea?.value) {
    const response = await chrome.runtime.sendMessage({
      type: 'chat-process',
      message: inputArea.value
    });
    // Process response
  }
}

// Initialize when ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initEnhancer);
} else {
  initEnhancer();
}
