// ChatGPT Enhancer Injection
const chrome = chrome ?? browser;

// Enhanced DOM selectors for ChatGPT
const SELECTORS = {
  INPUT: 'textarea[id="prompt-textarea"], textarea[name="prompt"]',
  CONTAINER: '.relative, .input-container, .chat-input',
  SUBMIT_BUTTON: 'button[type="submit"]'
};

// Initialize enhancer with robust MutationObserver
function initEnhancer() {
  const observer = new MutationObserver((mutations) => {
    const inputArea = document.querySelector(SELECTORS.INPUT);
    if (inputArea && !inputArea.dataset.enhanced) {
      inputArea.dataset.enhanced = 'true';
      enhanceInput(inputArea);
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true
  });

  // Inject main script with error handling
  const script = document.createElement('script');
  script.src = chrome.runtime.getURL('quillbot.js');
  script.onload = function() { 
    this.remove(); 
  };
  script.onerror = function() {
    console.error('Failed to load quillbot.js');
    this.remove();
  };
  (document.head || document.documentElement).appendChild(script);
}

// Enhanced input area modification
function enhanceInput(inputArea) {
  const container = inputArea.closest(SELECTORS.CONTAINER) || inputArea.parentNode;
  
  // Create enhancement controls container
  const controls = document.createElement('div');
  controls.className = 'chatgpt-enhancer-controls flex gap-2 items-center';
  
  // Add enhancement button
  const enhanceBtn = document.createElement('button');
  enhanceBtn.className = 'enhance-btn bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded';
  enhanceBtn.innerHTML = '<i class="fas fa-magic mr-1"></i> Enhance';
  enhanceBtn.addEventListener('click', handleEnhance);
  
  // Add dark mode toggle
  const darkModeBtn = document.createElement('button');
  darkModeBtn.className = 'dark-mode-btn bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded';
  darkModeBtn.innerHTML = '<i class="fas fa-moon"></i>';
  darkModeBtn.addEventListener('click', toggleDarkMode);
  
  controls.appendChild(enhanceBtn);
  controls.appendChild(darkModeBtn);
  container.appendChild(controls);
}

// Handle enhancement requests
async function handleEnhance() {
  const inputArea = document.querySelector(SELECTORS.INPUT);
  if (!inputArea?.value) return;

  try {
    const response = await chrome.runtime.sendMessage({
      type: 'chat-process',
      message: inputArea.value
    });
    
    if (response?.error) {
      showToast(response.error, 'error');
    } else if (response?.text) {
      inputArea.value = response.text;
      showToast('Text enhanced successfully!', 'success');
    }
  } catch (error) {
    console.error('Enhancement failed:', error);
    showToast('Enhancement failed. Please try again.', 'error');
  }
}

// Toggle dark mode
function toggleDarkMode() {
  document.documentElement.classList.toggle('dark');
  const isDark = document.documentElement.classList.contains('dark');
  chrome.storage.local.set({ darkMode: isDark });
  showToast(`Dark mode ${isDark ? 'enabled' : 'disabled'}`);
}

// Show toast notification
function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `fixed bottom-20 right-4 px-4 py-2 rounded shadow-lg ${
    type === 'error' ? 'bg-red-500' : 
    type === 'success' ? 'bg-green-500' : 'bg-blue-500'
  } text-white`;
  toast.textContent = message;
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.remove();
  }, 3000);
}

// Initialize when ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initEnhancer);
} else {
  initEnhancer();
}
