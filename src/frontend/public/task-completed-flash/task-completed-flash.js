/**
 * Task Completed Flash Animation Component
 * Reusable vanilla JavaScript implementation
 * No external dependencies required
 */

class TaskCompletedFlash {
  constructor(options = {}) {
    this.autoHideMs = options.autoHideMs || 4000;
    this.container = null;
    this.hideTimer = null;
  }

  /**
   * Initialize and mount the component to the DOM
   */
  init() {
    if (this.container) return; // Already initialized

    // Create container
    this.container = document.createElement('div');
    this.container.className = 'task-flash-overlay';
    this.container.style.display = 'none';
    
    // Create glow layer
    const glowLayer = document.createElement('div');
    glowLayer.className = 'task-flash-glow';
    
    // Create popup
    const popup = document.createElement('div');
    popup.className = 'task-flash-popup';
    
    // Create content structure
    const content = document.createElement('div');
    content.className = 'task-flash-content';
    
    // Icon container
    const iconContainer = document.createElement('div');
    iconContainer.className = 'task-flash-icon';
    iconContainer.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/>
      </svg>
    `;
    
    // Text container
    const textContainer = document.createElement('div');
    textContainer.className = 'task-flash-text';
    
    const title = document.createElement('h3');
    title.className = 'task-flash-title';
    title.textContent = 'Task Completed! 🎉';
    
    const quote = document.createElement('p');
    quote.className = 'task-flash-quote';
    quote.id = 'task-flash-quote-text';
    
    textContainer.appendChild(title);
    textContainer.appendChild(quote);
    
    content.appendChild(iconContainer);
    content.appendChild(textContainer);
    popup.appendChild(content);
    
    this.container.appendChild(glowLayer);
    this.container.appendChild(popup);
    
    document.body.appendChild(this.container);
  }

  /**
   * Trigger the animation with a random quote
   */
  trigger() {
    if (!this.container) {
      this.init();
    }

    // Clear any existing timer
    if (this.hideTimer) {
      clearTimeout(this.hideTimer);
    }

    // Select random quote
    const randomIndex = Math.floor(Math.random() * HINDI_QUOTES.length);
    const quote = HINDI_QUOTES[randomIndex];
    
    // Update quote text
    const quoteElement = document.getElementById('task-flash-quote-text');
    if (quoteElement) {
      quoteElement.textContent = quote;
    }

    // Show the animation
    this.container.style.display = 'flex';

    // Auto-hide after specified duration
    this.hideTimer = setTimeout(() => {
      this.hide();
    }, this.autoHideMs);
  }

  /**
   * Hide the animation
   */
  hide() {
    if (this.container) {
      this.container.style.display = 'none';
    }
    if (this.hideTimer) {
      clearTimeout(this.hideTimer);
      this.hideTimer = null;
    }
  }

  /**
   * Clean up and remove from DOM
   */
  destroy() {
    this.hide();
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
    this.container = null;
  }
}

// Export for use in modules or make globally available
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TaskCompletedFlash;
} else {
  window.TaskCompletedFlash = TaskCompletedFlash;
}
