// Global variables for popup management
let rephrasePopup = null;
let currentSelection = null;
let popupStyles = null;
let isDragging = false;
let dragOffset = { x: 0, y: 0 };

// Inject CSS styles for the popup
function injectPopupStyles() {
  if (popupStyles) return;
  
  popupStyles = document.createElement('style');
  popupStyles.textContent = `
    .rephrase-popup {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 450px;
      max-height: 80vh;
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
      z-index: 10000;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 14px;
      color: #333;
      overflow: hidden;
      user-select: none;
    }
    
    .rephrase-popup-header {
      background: #1a73e8;
      color: white;
      padding: 16px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: move;
      user-select: none;
    }
    
    .rephrase-popup-title {
      font-size: 16px;
      font-weight: 600;
      margin: 0;
    }
    
    .rephrase-popup-close {
      background: none;
      border: none;
      color: white;
      font-size: 24px;
      cursor: pointer;
      padding: 0;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .rephrase-popup-close:hover {
      background: rgba(255, 255, 255, 0.2);
    }
    
    .rephrase-popup-content {
      padding: 20px;
      max-height: calc(80vh - 80px);
      overflow-y: auto;
    }
    
    .rephrase-section {
      margin-bottom: 20px;
    }
    
    .rephrase-section h3 {
      margin: 0 0 8px 0;
      font-size: 14px;
      font-weight: 600;
      color: #5f6368;
    }
    
    .rephrase-textarea {
      width: 100%;
      padding: 10px 12px;
      border: 1px solid #dadce0;
      border-radius: 6px;
      font-size: 13px;
      font-family: inherit;
      resize: vertical;
      min-height: 60px;
      box-sizing: border-box;
    }
    
    .rephrase-textarea:focus {
      outline: none;
      border-color: #1a73e8;
      box-shadow: 0 0 0 2px rgba(26, 115, 232, 0.1);
    }
    
    .rephrase-textarea[readonly] {
      background: #f8f9fa;
      color: #5f6368;
    }
    
    .rephrase-tone-selector {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid #dadce0;
      border-radius: 6px;
      font-size: 13px;
      background: white;
      cursor: pointer;
    }
    
    .rephrase-buttons {
      display: flex;
      gap: 10px;
      margin-top: 15px;
    }
    
    .rephrase-btn {
      flex: 1;
      padding: 10px 16px;
      border: none;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    
    .rephrase-btn-primary {
      background: #1a73e8;
      color: white;
    }
    
    .rephrase-btn-primary:hover {
      background: #1557b0;
    }
    
    .rephrase-btn-secondary {
      background: #34a853;
      color: white;
    }
    
    .rephrase-btn-secondary:hover {
      background: #2d8e47;
    }
    
    .rephrase-btn-tertiary {
      background: #fbbc04;
      color: #1a1a1a;
    }
    
    .rephrase-btn-tertiary:hover {
      background: #f9ab00;
    }
    
    .rephrase-status {
      margin-top: 10px;
      padding: 8px 12px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 500;
    }
    
    .rephrase-status.success {
      background: #e8f5e8;
      color: #2d7d32;
      border: 1px solid #c8e6c9;
    }
    
    .rephrase-status.error {
      background: #fce8e6;
      color: #c5221f;
      border: 1px solid #f8bbd9;
    }
    
    .rephrase-status.info {
      background: #e3f2fd;
      color: #1565c0;
      border: 1px solid #bbdefb;
    }
    
    .rephrase-popup-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.3);
      z-index: 9999;
    }
    
    .rephrase-loading {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #1565c0;
    }
    
    .rephrase-spinner {
      width: 16px;
      height: 16px;
      border: 2px solid #e3f2fd;
      border-top: 2px solid #1565c0;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    .rephrase-setup-notification {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 10001;
      animation: slideInRight 0.3s ease-out;
    }
    
    .rephrase-notification-content {
      background: #fff;
      border: 1px solid #e0e0e0;
      border-left: 4px solid #1a73e8;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      padding: 16px;
      display: flex;
      align-items: center;
      gap: 12px;
      min-width: 300px;
      max-width: 400px;
    }
    
    .rephrase-notification-icon {
      font-size: 24px;
      flex-shrink: 0;
    }
    
    .rephrase-notification-text {
      flex: 1;
      font-size: 14px;
      color: #333;
    }
    
    .rephrase-notification-text strong {
      color: #1a73e8;
      font-weight: 600;
    }
    
    .rephrase-notification-close {
      background: none;
      border: none;
      font-size: 18px;
      color: #666;
      cursor: pointer;
      padding: 4px;
      border-radius: 4px;
      flex-shrink: 0;
    }
    
    .rephrase-notification-close:hover {
      background: #f0f0f0;
      color: #333;
    }
    
    @keyframes slideInRight {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  `;
  
  document.head.appendChild(popupStyles);
}

// Create and show the rephrase popup
function createRephrasePopup(selectedText) {
  // Remove existing popup
  removeRephrasePopup();
  
  // Inject styles
  injectPopupStyles();
  
  // Create overlay
  const overlay = document.createElement('div');
  overlay.className = 'rephrase-popup-overlay';
  overlay.onclick = removeRephrasePopup;
  
  // Create popup
  rephrasePopup = document.createElement('div');
  rephrasePopup.className = 'rephrase-popup';
  rephrasePopup.onclick = (e) => e.stopPropagation();
  
  rephrasePopup.innerHTML = `
    <div class="rephrase-popup-header">
      <h2 class="rephrase-popup-title">RephraseGenie</h2>
      <button class="rephrase-popup-close">×</button>
    </div>
    <div class="rephrase-popup-content">
      <div class="rephrase-section">
        <h3>Original Text</h3>
        <textarea class="rephrase-textarea" id="original-text" readonly></textarea>
      </div>
      
      <div class="rephrase-section">
        <h3>Tone Style</h3>
        <select class="rephrase-tone-selector" id="tone-selector">
          <option value="professional">Professional</option>
          <option value="casual">Casual</option>
          <option value="formal">Formal</option>
          <option value="technical">Technical</option>
          <option value="friendly">Friendly</option>
          <option value="concise">Concise</option>
        </select>
      </div>
      
      <div class="rephrase-section">
        <h3>Rephrased Text</h3>
        <textarea class="rephrase-textarea" id="rephrased-text" readonly></textarea>
        <div class="rephrase-buttons">
          <button class="rephrase-btn rephrase-btn-primary" id="rephrase-again-btn">Rephrase Again</button>
          <button class="rephrase-btn rephrase-btn-secondary" id="copy-btn">Copy Text</button>
          <button class="rephrase-btn rephrase-btn-tertiary" id="replace-btn">Replace Original</button>
        </div>
        <div class="rephrase-status" id="rephrase-status" style="display: none;"></div>
      </div>
    </div>
  `;
  
  // Add to page
  document.body.appendChild(overlay);
  document.body.appendChild(rephrasePopup);
  
  // Set original text
  const originalTextArea = rephrasePopup.querySelector('#original-text');
  originalTextArea.value = selectedText;
  autoResize(originalTextArea);
  
  // Set initial rephrased text to loading
  const rephrasedTextArea = rephrasePopup.querySelector('#rephrased-text');
  showLoadingInTextArea(rephrasedTextArea);
  
  // Add event listeners
  setupPopupEventListeners(selectedText);
  
  // Make popup draggable
  makeDraggable(rephrasePopup);
  
  return rephrasePopup;
}

// Remove the rephrase popup
function removeRephrasePopup() {
  const overlay = document.querySelector('.rephrase-popup-overlay');
  if (overlay) overlay.remove();
  
  if (rephrasePopup) {
    rephrasePopup.remove();
    rephrasePopup = null;
  }
}

// Setup event listeners for popup
function setupPopupEventListeners(originalText) {
  const popup = rephrasePopup;
  
  // Close button
  popup.querySelector('.rephrase-popup-close').onclick = removeRephrasePopup;
  
  // Rephrase again button
  popup.querySelector('#rephrase-again-btn').onclick = () => {
    const tone = popup.querySelector('#tone-selector').value;
    const rephrasedTextArea = popup.querySelector('#rephrased-text');
    showLoadingInTextArea(rephrasedTextArea);
    hideStatus();
    
    // Send message to background to rephrase with selected tone
    chrome.runtime.sendMessage({
      type: "REPHRASE_WITH_TONE",
      text: originalText,
      tone: tone
    });
  };
  
  // Copy button
  popup.querySelector('#copy-btn').onclick = () => {
    const rephrasedText = popup.querySelector('#rephrased-text').value;
    if (rephrasedText && !rephrasedText.includes('Rephrasing...')) {
      navigator.clipboard.writeText(rephrasedText).then(() => {
        showStatus('Text copied to clipboard!', 'success');
      }).catch(() => {
        showStatus('Failed to copy text', 'error');
      });
    } else {
      showStatus('No text to copy', 'error');
    }
  };
  
  // Replace button
  popup.querySelector('#replace-btn').onclick = () => {
    const rephrasedText = popup.querySelector('#rephrased-text').value;
    if (rephrasedText && !rephrasedText.includes('Rephrasing...')) {
      replaceSelectedText(rephrasedText);
      showStatus('Text replaced successfully!', 'success');
      setTimeout(removeRephrasePopup, 1500);
    } else {
      showStatus('No text to replace', 'error');
    }
  };
  
  // Tone selector change
  popup.querySelector('#tone-selector').onchange = () => {
    const tone = popup.querySelector('#tone-selector').value;
    const rephrasedTextArea = popup.querySelector('#rephrased-text');
    showLoadingInTextArea(rephrasedTextArea);
    hideStatus();
    
    chrome.runtime.sendMessage({
      type: "REPHRASE_WITH_TONE",
      text: originalText,
      tone: tone
    });
  };
}

// Show loading state in textarea
function showLoadingInTextArea(textarea) {
  textarea.value = '';
  const loadingDiv = document.createElement('div');
  loadingDiv.className = 'rephrase-loading';
  loadingDiv.innerHTML = `
    <div class="rephrase-spinner"></div>
    <span>Rephrasing text, please wait...</span>
  `;
  
  // Replace textarea temporarily
  textarea.style.display = 'none';
  textarea.parentNode.insertBefore(loadingDiv, textarea);
  
  // Store reference to remove later
  textarea._loadingDiv = loadingDiv;
}

// Hide loading and show text
function hideLoadingInTextArea(textarea, text) {
  if (textarea._loadingDiv) {
    textarea._loadingDiv.remove();
    textarea._loadingDiv = null;
  }
  textarea.style.display = 'block';
  textarea.value = text;
  autoResize(textarea);
}

// Show status message
function showStatus(message, type) {
  const statusEl = rephrasePopup.querySelector('#rephrase-status');
  statusEl.textContent = message;
  statusEl.className = `rephrase-status ${type}`;
  statusEl.style.display = 'block';
  
  if (type === 'success') {
    setTimeout(hideStatus, 3000);
  }
}

// Hide status message
function hideStatus() {
  const statusEl = rephrasePopup.querySelector('#rephrase-status');
  statusEl.style.display = 'none';
}

// Auto-resize textarea
function autoResize(textarea) {
  textarea.style.height = 'auto';
  textarea.style.height = textarea.scrollHeight + 'px';
}

// Listen for messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Content script received message:", request.type);
  
  if (request.type === "GET_SELECTED_TEXT") {
    const selectedText = window.getSelection().toString().trim();
    console.log("Selected text:", selectedText ? selectedText.substring(0, 100) + "..." : "No text selected");
    
    if (selectedText) {
      // Store current selection for later use
      currentSelection = window.getSelection().getRangeAt(0).cloneRange();
      
      // Create and show popup immediately
      createRephrasePopup(selectedText);
    }
    
    sendResponse({ text: selectedText });
    return true;
  }
  
  if (request.type === "REPHRASE_RESULT") {
    if (rephrasePopup) {
      const rephrasedTextArea = rephrasePopup.querySelector('#rephrased-text');
      if (request.success) {
        hideLoadingInTextArea(rephrasedTextArea, request.rephrasedText);
        showStatus('Text rephrased successfully!', 'success');
      } else {
        hideLoadingInTextArea(rephrasedTextArea, `Error: ${request.error}`);
        showStatus('Rephrasing failed. Please try again.', 'error');
      }
    }
    sendResponse({ success: true });
    return true;
  }
  
  if (request.type === "REPLACE_SELECTED_TEXT") {
    replaceSelectedText(request.newText);
    sendResponse({ success: true });
    return true;
  }
  
  if (request.type === "SHOW_SETUP_NOTIFICATION") {
    // Show an in-page notification when popup can't be opened automatically
    showSetupNotification();
    sendResponse({ success: true });
    return true;
  }
});

// Function to replace selected text on the page
function replaceSelectedText(newText) {
  if (currentSelection) {
    // Use stored selection
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(currentSelection);
    
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const textNode = document.createTextNode(newText);
      
      range.deleteContents();
      range.insertNode(textNode);
      
      // Clear and highlight new text
      selection.removeAllRanges();
      const newRange = document.createRange();
      newRange.selectNodeContents(textNode);
      selection.addRange(newRange);
    }
  } else {
    // Fallback to current selection
    const selection = window.getSelection();
    
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const selectedText = range.toString();
      
      if (selectedText.trim()) {
        const textNode = document.createTextNode(newText);
        range.deleteContents();
        range.insertNode(textNode);
        
        selection.removeAllRanges();
        const newRange = document.createRange();
        newRange.selectNodeContents(textNode);
        selection.addRange(newRange);
      }
    }
  }
}

// Add keyboard shortcut listener (Ctrl+Shift+R)
document.addEventListener('keydown', function(event) {
  if (event.ctrlKey && event.shiftKey && event.key === 'R') {
    event.preventDefault();
    
    const selectedText = window.getSelection().toString().trim();
    if (selectedText) {
      // Send message to background script to rephrase
      chrome.runtime.sendMessage({
        type: "REPHRASE_SHORTCUT",
        text: selectedText
      });
    }
  }
});

// Listen for shortcut rephrase results
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "SHORTCUT_REPHRASE_RESULT") {
    if (request.success && request.rephrasedText) {
      replaceSelectedText(request.rephrasedText);
    } else {
      console.error("Error rephrasing text:", request.error);
    }
  }
});

// Show setup notification when popup can't be opened automatically
function showSetupNotification() {
  // Remove any existing notification
  const existingNotification = document.querySelector('.rephrase-setup-notification');
  if (existingNotification) {
    existingNotification.remove();
  }
  
  // Inject notification styles if not already done
  if (!popupStyles) {
    injectPopupStyles();
  }
  
  // Create notification
  const notification = document.createElement('div');
  notification.className = 'rephrase-setup-notification';
  notification.innerHTML = `
    <div class="rephrase-notification-content">
      <div class="rephrase-notification-icon">🔑</div>
      <div class="rephrase-notification-text">
        <strong>API Key Required</strong><br>
        Please click the extension icon to enter your OpenAI API key.
      </div>
      <button class="rephrase-notification-close">×</button>
    </div>
  `;
  
  // Add to page
  document.body.appendChild(notification);
  
  // Auto-remove after 5 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.remove();
    }
  }, 5000);
  
  // Close button functionality
  notification.querySelector('.rephrase-notification-close').onclick = () => {
    notification.remove();
  };
}

// Make popup draggable
function makeDraggable(popup) {
  const header = popup.querySelector('.rephrase-popup-header');
  
  header.addEventListener('mousedown', function(e) {
    // Don't start dragging if clicking on the close button
    if (e.target.classList.contains('rephrase-popup-close')) return;
    
    isDragging = true;
    
    // Calculate offset from mouse to popup's current position
    const rect = popup.getBoundingClientRect();
    dragOffset.x = e.clientX - rect.left;
    dragOffset.y = e.clientY - rect.top;
    
    // Change cursor and add visual feedback
    document.body.style.cursor = 'move';
    popup.style.transition = 'none';
    popup.style.transform = 'none';
    
    // Set initial position
    popup.style.left = rect.left + 'px';
    popup.style.top = rect.top + 'px';
    
    e.preventDefault();
  });
  
  document.addEventListener('mousemove', function(e) {
    if (!isDragging || !popup) return;
    
    // Calculate new position
    let newX = e.clientX - dragOffset.x;
    let newY = e.clientY - dragOffset.y;
    
    // Get popup dimensions
    const rect = popup.getBoundingClientRect();
    const popupWidth = rect.width;
    const popupHeight = rect.height;
    
    // Constrain to viewport
    const maxX = window.innerWidth - popupWidth;
    const maxY = window.innerHeight - popupHeight;
    
    newX = Math.max(0, Math.min(newX, maxX));
    newY = Math.max(0, Math.min(newY, maxY));
    
    // Update position
    popup.style.left = newX + 'px';
    popup.style.top = newY + 'px';
    
    e.preventDefault();
  });
  
  document.addEventListener('mouseup', function(e) {
    if (isDragging) {
      isDragging = false;
      document.body.style.cursor = '';
      
      if (popup) {
        popup.style.transition = '';
      }
    }
  });
}