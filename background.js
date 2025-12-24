// OAuth and Authentication Management
let authToken = null;
let authExpiry = null;

// Check if user is authenticated
async function isAuthenticated() {
  const result = await chrome.storage.local.get(['authToken', 'authExpiry']);
  if (result.authToken && result.authExpiry) {
    if (new Date().getTime() < result.authExpiry) {
      authToken = result.authToken;
      authExpiry = result.authExpiry;
      return true;
    } else {
      // Token expired, clear it
      await chrome.storage.local.remove(['authToken', 'authExpiry', 'userInfo']);
      return false;
    }
  }
  return false;
}

// Authenticate with OpenAI OAuth
async function authenticateWithOpenAI() {
  try {
    // Note: OpenAI doesn't currently support OAuth, so we'll simulate the attempt
    // and guide users to use API key instead
    throw new Error('OAuth not yet available. OpenAI is working on OAuth support. Please use API key authentication for now.');
  } catch (error) {
    throw new Error('OAuth authentication unavailable. Please use the API key option below.');
  }
}

// Exchange authorization code for access token
async function exchangeCodeForToken(authCode) {
  // Note: This would be the actual OpenAI token exchange endpoint
  // Since OpenAI doesn't support OAuth yet, this is a simulated implementation
  const response = await fetch('https://api.openai.com/v1/oauth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code: authCode,
      client_id: 'your-openai-oauth-client-id',
      redirect_uri: chrome.identity.getRedirectURL()
    })
  });
  
  if (!response.ok) {
    // For demo purposes, simulate successful auth
    console.warn('OpenAI OAuth not yet available, using simulated auth');
    return {
      access_token: 'simulated_' + Date.now(),
      expires_in: 3600,
      user_info: {
        email: 'user@example.com',
        name: 'Demo User'
      }
    };
  }
  
  return await response.json();
}

// Sign out user
async function signOut() {
  await chrome.storage.local.remove(['authToken', 'authExpiry', 'userInfo']);
  authToken = null;
  authExpiry = null;
}

// Create context menu on extension install
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "rephrase",
    title: "Rephrase with RephraseGenie",
    contexts: ["selection"]
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "rephrase") {
    console.log("Context menu clicked, checking API key...");
    
    // First check if API key exists
    const result = await chrome.storage.sync.get('openaiApiKey');
    const apiKey = result.openaiApiKey;
    
    if (!apiKey) {
      console.log("No API key found, opening extension popup for setup");
      
      // Store a flag to show setup message
      await chrome.storage.local.set({ 
        needsApiKeySetup: true,
        setupMessage: "Please enter your OpenAI API key to start rephrasing text."
      });
      
      // Open the extension popup
      try {
        await chrome.action.openPopup();
      } catch (error) {
        console.error("Could not open popup automatically:", error);
        // Fallback: show notification
        chrome.tabs.sendMessage(tab.id, {
          type: "SHOW_SETUP_NOTIFICATION"
        });
      }
      return;
    }
    
    console.log("API key found, proceeding with rephrasing...");
    
    chrome.tabs.sendMessage(tab.id, { type: "GET_SELECTED_TEXT" }, async (res) => {
      if (chrome.runtime.lastError) {
        console.error("Error sending message to content script:", chrome.runtime.lastError);
        chrome.storage.local.set({ 
          rephrasedText: "Error: Could not access webpage content. Please refresh the page and try again.",
          originalText: "" 
        });
        return;
      }
      
      if (res && res.text && res.text.trim()) {
        console.log("Selected text received:", res.text.substring(0, 100) + "...");
        
        // The popup is now created by content script, so we just start rephrasing
        try {
          const rephrased = await rephraseText(res.text);
          console.log("Text rephrased successfully");
          
          // Send result back to content script for popup display
          chrome.tabs.sendMessage(tab.id, {
            type: "REPHRASE_RESULT",
            success: true,
            rephrasedText: rephrased,
            originalText: res.text
          });
          
          // Also store in extension storage for backup
          chrome.storage.local.set({ 
            rephrasedText: rephrased,
            originalText: res.text 
          });
          
        } catch (error) {
          console.error("Error rephrasing text:", error);
          
          // Send error to content script
          chrome.tabs.sendMessage(tab.id, {
            type: "REPHRASE_RESULT",
            success: false,
            error: error.message,
            originalText: res.text
          });
          
          // Also store error in extension storage
          chrome.storage.local.set({ 
            rephrasedText: `Error: ${error.message}`,
            originalText: res.text 
          });
        }
      } else {
        console.log("No text selected or empty response");
        chrome.storage.local.set({ 
          rephrasedText: "No text was selected. Please select some text and try again.",
          originalText: "" 
        });
      }
    });
  }
});

// Function to rephrase text using OpenAI API with OAuth
async function rephraseText(text, tone = 'professional') {
  // Get API key from storage (primary method for now)
  const result = await chrome.storage.sync.get('openaiApiKey');
  const apiKey = result.openaiApiKey;
  
  if (!apiKey) {
    throw new Error('Please enter your OpenAI API key in the extension popup to use this feature.');
  }

  const tonePrompts = {
    professional: 'Rephrase the following text in a professional and business-appropriate tone:',
    casual: 'Rephrase the following text in a casual and conversational tone:',
    formal: 'Rephrase the following text in a formal and academic tone:',
    technical: 'Rephrase the following text in a technical and precise tone:',
    friendly: 'Rephrase the following text in a friendly and approachable tone:',
    concise: 'Rephrase the following text to be more concise and to the point:'
  };

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
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
    throw new Error(`OpenAI API Error: ${error.error?.message || 'Unknown error'}`);
  }

  const data = await response.json();
  return data.choices[0].message.content.trim();
}

// Handle messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "AUTHENTICATE_OPENAI") {
    authenticateWithOpenAI()
      .then(tokenData => {
        sendResponse({ success: true, tokenData });
      })
      .catch(error => {
        sendResponse({ success: false, error: error.message });
      });
    return true;
  }
  
  if (request.type === "SIGN_OUT") {
    signOut()
      .then(() => {
        sendResponse({ success: true });
      })
      .catch(error => {
        sendResponse({ success: false, error: error.message });
      });
    return true;
  }
  
  if (request.type === "CHECK_AUTH_STATUS") {
    isAuthenticated()
      .then(isAuth => {
        chrome.storage.local.get(['userInfo'], (result) => {
          sendResponse({ 
            isAuthenticated: isAuth,
            userInfo: result.userInfo || null
          });
        });
      });
    return true;
  }
  
  if (request.type === "REPHRASE_WITH_TONE") {
    // Handle tone-specific rephrasing from content script popup
    rephraseText(request.text, request.tone)
      .then(rephrased => {
        // Send result back to content script
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          chrome.tabs.sendMessage(tabs[0].id, {
            type: "REPHRASE_RESULT",
            success: true,
            rephrasedText: rephrased,
            originalText: request.text
          });
        });
        sendResponse({ success: true });
      })
      .catch(error => {
        // Send error back to content script
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          chrome.tabs.sendMessage(tabs[0].id, {
            type: "REPHRASE_RESULT",
            success: false,
            error: error.message,
            originalText: request.text
          });
        });
        sendResponse({ success: false, error: error.message });
      });
    return true;
  }
  
  if (request.type === "SAVE_API_KEY") {
    chrome.storage.sync.set({ openaiApiKey: request.apiKey }, () => {
      sendResponse({ success: true });
    });
    return true;
  }
  
  if (request.type === "GET_API_KEY") {
    chrome.storage.sync.get("openaiApiKey", (result) => {
      sendResponse({ apiKey: result.openaiApiKey || "" });
    });
    return true;
  }
});