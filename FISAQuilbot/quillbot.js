// ChatGPT Enhancement UI
document.addEventListener("DOMContentLoaded", function() {
  // Add Tailwind CSS
  const tailwind = document.createElement('script');
  tailwind.src = 'https://cdn.tailwindcss.com';
  document.head.appendChild(tailwind);

  // Create floating action button
  const fab = document.createElement('div');
  fab.id = 'chatgpt-enhancer';
  fab.className = 'fixed bottom-6 right-6 z-50 flex flex-col gap-2';
  fab.innerHTML = `
    <button class="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg transition-all">
      <i class="fas fa-save"></i>
    </button>
    <button class="bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-full shadow-lg transition-all">
      <i class="fas fa-moon"></i>
    </button>
    <div class="bg-white dark:bg-gray-800 p-2 rounded-lg shadow-md text-sm hidden" id="rate-limit">
      <span class="font-medium">API Usage:</span>
      <div class="w-full bg-gray-200 rounded-full h-2 mt-1">
        <div class="bg-green-500 h-2 rounded-full" style="width: 80%"></div>
      </div>
    </div>
  `;
  document.body.appendChild(fab);

  // Add Font Awesome
  const fa = document.createElement('link');
  fa.rel = 'stylesheet';
  fa.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css';
  document.head.appendChild(fa);
});
