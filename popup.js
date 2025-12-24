document.addEventListener('DOMContentLoaded', function() {
  // DOM elements
  const authSection = document.getElementById('authSection');
  const signInView = document.getElementById('signInView');
  const signedInView = document.getElementById('signedInView');
  const signInButton = document.getElementById('signInButton');
  const signOutButton = document.getElementById('signOutButton');
  const userEmail = document.getElementById('userEmail');
  const authStatus = document.getElementById('authStatus');
  const apiKeyInput = document.getElementById('apiKey');
  const saveApiKeyButton = document.getElementById('saveApiKey');
  const originalTextArea = document.getElementById('originalText');
  const rephrasedTextArea = document.getElementById('rephrasedText');
  const copyButton = document.getElementById('copyButton');
  const replaceButton = document.getElementById('replaceButton');
  const rephraseAgainButton = document.getElementById('rephraseAgain');
  const actionStatus = document.getElementById('actionStatus');
  const toneSelect = document.getElementById('toneSelect');
  
  // Authentication state
  let isAuthenticated = false;
  let userInfo = null;

  // Load saved data when popup opens
  loadAuthenticationState();
  
  // OAuth Sign In
  signInButton.addEventListener('click', function() {
    signInButton.disabled = true;
    signInButton.textContent = 'Signing In...';
    showStatus(authStatus, 'Initiating OpenAI sign-in...', 'info');
    
    chrome.runtime.sendMessage({type: "AUTHENTICATE_OPENAI"}, function(response) {
      signInButton.disabled = false;
      signInButton.textContent = 'Sign In with OpenAI';
      
      if (response && response.success) {
        showStatus(authStatus, 'Successfully signed in!', 'success');
        loadAuthenticationState();
      } else {
        const errorMsg = response ? response.error : 'Authentication failed';
        showStatus(authStatus, `Sign-in failed: ${errorMsg}`, 'error');
        console.error('OAuth error:', errorMsg);
      }
    });
  });
  
  // OAuth Sign Out
  signOutButton.addEventListener('click', function() {
    chrome.runtime.sendMessage({type: "SIGN_OUT"}, function(response) {
      if (response && response.success) {
        showStatus(authStatus, 'Signed out successfully', 'info');
        loadAuthenticationState();
      } else {
        showStatus(authStatus, 'Sign-out failed', 'error');
      }
    });
  });

  // Save API key (primary method)
  saveApiKeyButton.addEventListener('click', function() {
    const apiKey = apiKeyInput.value.trim();
    if (apiKey) {
      chrome.runtime.sendMessage({
        type: "SAVE_API_KEY",
        apiKey: apiKey
      }, function(response) {
        if (response && response.success) {
          showStatus(authStatus, '✅ API key saved successfully! Reloading page...', 'success');
          apiKeyInput.value = ''; // Clear the input for security
          
          // Reload the current active tab after a short delay
          setTimeout(() => {
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
              if (tabs[0] && tabs[0].id) {
                chrome.tabs.reload(tabs[0].id, function() {
                  // Close the popup after reload
                  window.close();
                });
              }
            });
          }, 1000);
          
        } else {
          showStatus(authStatus, 'Failed to save API key', 'error');
        }
      });
    } else {
      showStatus(authStatus, 'Please enter an API key', 'error');
    }
  });

  // Copy rephrased text to clipboard
  copyButton.addEventListener('click', function() {
    const text = rephrasedTextArea.value;
    if (text) {
      navigator.clipboard.writeText(text).then(function() {
        showStatus(actionStatus, 'Text copied to clipboard!', 'success');
      }).catch(function(err) {
        showStatus(actionStatus, 'Failed to copy text', 'error');
        console.error('Copy failed: ', err);
      });
    } else {
      showStatus(actionStatus, 'No text to copy', 'error');
    }
  });

  // Replace text on the current page
  replaceButton.addEventListener('click', function() {
    const newText = rephrasedTextArea.value;
    if (newText) {
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
          type: "REPLACE_SELECTED_TEXT",
          newText: newText
        }, function(response) {
          if (response && response.success) {
            showStatus(actionStatus, 'Text replaced on page!', 'success');
          } else {
            showStatus(actionStatus, 'Failed to replace text. Make sure text is still selected.', 'error');
          }
        });
      });
    } else {
      showStatus(actionStatus, 'No text to replace', 'error');
    }
  });

  // Rephrase again with different tone
  rephraseAgainButton.addEventListener('click', function() {
    const originalText = originalTextArea.value;
    const selectedTone = toneSelect.value;
    
    if (originalText) {
      rephraseWithTone(originalText, selectedTone);
    } else {
      showStatus(actionStatus, 'No original text to rephrase', 'error');
    }
  });

  // Load authentication state
  function loadAuthenticationState() {
    // Check for setup flag
    chrome.storage.local.get(['needsApiKeySetup', 'setupMessage'], function(setupData) {
      if (setupData.needsApiKeySetup) {
        showStatus(authStatus, setupData.setupMessage || 'Please enter your API key to get started', 'info');
        // Clear the flag
        chrome.storage.local.remove(['needsApiKeySetup', 'setupMessage']);
        // Focus on API key input
        setTimeout(() => {
          apiKeyInput.focus();
        }, 100);
      }
    });
    
    // Since OAuth is not available yet, focus on API key
    chrome.runtime.sendMessage({type: "GET_API_KEY"}, function(apiResponse) {
      if (apiResponse && apiResponse.apiKey) {
        showStatus(authStatus, '✅ API key configured - Ready to rephrase!', 'success');
        // Hide sign-in view, show a simple status
        signInView.style.display = 'block';
      } else {
        showStatus(authStatus, 'Please enter your OpenAI API key to get started', 'info');
        signInView.style.display = 'block';
      }
    });
    
    // Load rephrased text from storage and set up real-time updates
    chrome.storage.local.get(['rephrasedText', 'originalText'], function(data) {
      if (data.rephrasedText) {
        rephrasedTextArea.value = data.rephrasedText;
        autoResize(rephrasedTextArea);
      }
      if (data.originalText) {
        originalTextArea.value = data.originalText;
        autoResize(originalTextArea);
      }
    });
    
    // Listen for storage changes to update UI in real-time
    chrome.storage.onChanged.addListener((changes, namespace) => {
      if (namespace === 'local') {
        if (changes.needsApiKeySetup && changes.needsApiKeySetup.newValue) {
          showStatus(authStatus, 'Please enter your API key to continue rephrasing', 'info');
          apiKeyInput.focus();
        }
        
        if (changes.rephrasedText) {
          rephrasedTextArea.value = changes.rephrasedText.newValue || '';
          autoResize(rephrasedTextArea);
          
          if (changes.rephrasedText.newValue && changes.rephrasedText.newValue.startsWith('Error:')) {
            showStatus(actionStatus, 'Rephrasing failed. Check the text above.', 'error');
          } else if (changes.rephrasedText.newValue === 'Rephrasing text, please wait...') {
            showStatus(actionStatus, 'Rephrasing in progress...', 'info');
          } else if (changes.rephrasedText.newValue && !changes.rephrasedText.newValue.startsWith('Error:')) {
            showStatus(actionStatus, 'Text rephrased successfully!', 'success');
          }
        }
        if (changes.originalText) {
          originalTextArea.value = changes.originalText.newValue || '';
          autoResize(originalTextArea);
        }
      }
    });
  }
  
  // Update UI based on authentication state
  function updateAuthenticationUI() {
    if (isAuthenticated && userInfo) {
      signInView.style.display = 'none';
      signedInView.style.display = 'block';
      
      if (userInfo.email) {
        userEmail.textContent = userInfo.email;
      } else {
        userEmail.textContent = userInfo.name || 'OpenAI User';
      }
    } else {
      signInView.style.display = 'block';
      signedInView.style.display = 'none';
    }
  }

  // Rephrase text with specific tone
  async function rephraseWithTone(text, tone) {
    showStatus(actionStatus, 'Rephrasing...', 'info');
    
    try {
      // Check authentication status first
      const authResponse = await new Promise(resolve => {
        chrome.runtime.sendMessage({type: "CHECK_AUTH_STATUS"}, resolve);
      });
      
      if (!authResponse.isAuthenticated) {
        // Check for API key fallback
        const apiKeyResponse = await new Promise(resolve => {
          chrome.runtime.sendMessage({type: "GET_API_KEY"}, resolve);
        });
        
        if (!apiKeyResponse || !apiKeyResponse.apiKey) {
          throw new Error('Please sign in to OpenAI or provide an API key');
        }
      }

      const tonePrompts = {
        professional: 'Rephrase the following text in a professional and business-appropriate tone:',
        casual: 'Rephrase the following text in a casual and conversational tone:',
        formal: 'Rephrase the following text in a formal and academic tone:',
        technical: 'Rephrase the following text in a technical and precise tone:',
        friendly: 'Rephrase the following text in a friendly and approachable tone:',
        concise: 'Rephrase the following text to be more concise and to the point:'
      };

      // Get authentication token or API key
      const authData = await chrome.storage.local.get(['authToken']);
      const apiKeyData = await chrome.storage.sync.get(['openaiApiKey']);
      
      const headers = {
        'Content-Type': 'application/json'
      };
      
      if (authData.authToken) {
        headers['Authorization'] = `Bearer ${authData.authToken}`;
      } else if (apiKeyData.openaiApiKey) {
        headers['Authorization'] = `Bearer ${apiKeyData.openaiApiKey}`;
      } else {
        throw new Error('No authentication method available');
      }

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'user',
              content: `${tonePrompts[tone] || tonePrompts.professional}\n\n${text}`
            }
          ],
          max_tokens: 1000,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`API Error: ${error.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      const rephrasedText = data.choices[0].message.content.trim();
      
      rephrasedTextArea.value = rephrasedText;
      
      // Save to storage
      chrome.storage.local.set({ 
        rephrasedText: rephrasedText,
        originalText: text 
      });
      
      showStatus(actionStatus, 'Text rephrased successfully!', 'success');
      
    } catch (error) {
      console.error('Rephrase error:', error);
      showStatus(actionStatus, `Error: ${error.message}`, 'error');
    }
  }

  // Show status messages
  function showStatus(element, message, type) {
    element.textContent = message;
    element.className = `status ${type}`;
    
    // Auto-hide success messages after 3 seconds
    if (type === 'success') {
      setTimeout(() => {
        element.textContent = '';
        element.className = 'status';
      }, 3000);
    }
  }

  // Handle Enter key in API key input
  apiKeyInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
      saveApiKeyButton.click();
    }
  });

  // Auto-resize textareas
  function autoResize(textarea) {
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
    }
  }

  originalTextArea.addEventListener('input', function() {
    autoResize(this);
  });

  rephrasedTextArea.addEventListener('input', function() {
    autoResize(this);
  });
});