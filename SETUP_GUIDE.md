# RephraseGenie - Chrome Extension

A Chrome extension that allows users to rephrase selected text on any webpage using AI-powered RephraseGenie.

## 🚀 Features

- **Right-click to rephrase**: Select text and right-click to access the rephrase option
- **Keyboard shortcut**: Use `Ctrl+Shift+R` to quickly rephrase selected text
- **Multiple tone styles**: Professional, Casual, Formal, Technical, Friendly, and Concise
- **Copy to clipboard**: Easily copy rephrased text
- **Replace on page**: Directly replace selected text with rephrased version
- **Secure API key storage**: Your OpenAI API key is stored securely in Chrome's storage
- **User-friendly popup interface**: Clean and intuitive design

## 📁 Project Structure

```
rephrase-plugin/
├── manifest.json          # Extension configuration
├── background.js          # Service worker for API calls
├── content.js            # Content script for webpage interaction
├── popup.html            # Extension popup interface
├── popup.js              # Popup functionality
├── styles.css            # Popup styling
├── icons/                # Extension icons (need to be added)
│   ├── icon16.png
│   ├── icon48.png
│   ├── icon128.png
│   └── README.md         # Instructions for adding icons
└── README.md             # This file
```

## 🛠️ Installation & Setup

### 1. Get OpenAI API Key
1. Visit [OpenAI's website](https://platform.openai.com/)
2. Create an account or sign in
3. Go to API Keys section
4. Create a new API key and copy it

### 2. Install the Extension
1. Open Chrome and go to `chrome://extensions/`
2. Enable **Developer mode** (toggle in top right)
3. Click **Load unpacked**
4. Select the `rephrase-plugin` folder
5. The extension should now appear in your extensions list

### 3. Add Icons (Required)
1. Create or download 3 PNG icon files:
   - `icon16.png` (16x16 pixels)
   - `icon48.png` (48x48 pixels) 
   - `icon128.png` (128x128 pixels)
2. Place them in the `icons/` folder
3. Reload the extension in Chrome

### 4. Configure API Key
1. Click the extension icon in Chrome's toolbar
2. Enter your OpenAI API key in the input field
3. Click "Save Key"
4. You should see a success message

## 🎯 How to Use

### Method 1: Right-Click Menu
1. Go to any webpage
2. Select text you want to rephrase
3. Right-click and select "Rephrase with RephraseGenie"
4. Click the extension icon to view results
5. Copy or replace the text as needed

### Method 2: Keyboard Shortcut
1. Select text on any webpage
2. Press `Ctrl+Shift+R`
3. The selected text will be automatically replaced with the rephrased version

### Method 3: Extension Popup
1. Click the extension icon
2. Use the popup interface to:
   - View original and rephrased text
   - Choose different tone styles
   - Rephrase again with different tones
   - Copy text to clipboard
   - Replace text on the page

## 🎨 Tone Styles

The extension supports multiple rephrasing tones:
- **Professional**: Business-appropriate language
- **Casual**: Conversational and relaxed
- **Formal**: Academic and structured
- **Technical**: Precise and technical language
- **Friendly**: Warm and approachable
- **Concise**: Brief and to the point

## 🔒 Privacy & Security

- **API Key Storage**: Your OpenAI API key is stored locally in Chrome's secure storage
- **No Data Collection**: The extension doesn't collect or store any personal data
- **Direct API Calls**: Text is sent directly to OpenAI's servers, not to any third-party
- **Local Processing**: All text processing happens locally or through OpenAI

## 🐛 Troubleshooting

### "API key not found" error
- Make sure you've entered and saved your OpenAI API key in the extension popup

### "Failed to rephrase text" error
- Check your internet connection
- Verify your OpenAI API key is valid and has sufficient credits
- Make sure the selected text isn't too long (OpenAI has token limits)

### Extension not showing in right-click menu
- Make sure you have text selected before right-clicking
- Try refreshing the webpage and reinstalling the extension

### Keyboard shortcut not working
- Make sure text is selected before using `Ctrl+Shift+R`
- Check if other extensions are using the same shortcut

## 💰 Cost Considerations

- This extension uses OpenAI's API, which charges per token used
- GPT-4o-mini is cost-effective for text rephrasing
- Monitor your OpenAI usage in your account dashboard
- Consider setting usage limits in your OpenAI account

## 🔧 Development

### Prerequisites
- Basic knowledge of JavaScript, HTML, CSS
- Chrome browser with Developer mode enabled
- OpenAI API account

### Making Changes
1. Edit the relevant files
2. Go to `chrome://extensions/`
3. Click the refresh icon on your extension
4. Test the changes

### Adding Features
- Modify `background.js` for new API integrations
- Update `content.js` for webpage interactions
- Enhance `popup.html` and `popup.js` for UI features

## 📝 License

This project is open source. Feel free to modify and distribute according to your needs.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## ⚠️ Disclaimer

This extension sends selected text to OpenAI's servers for processing. Make sure you comply with your organization's data policies before using it with sensitive information.

---

**Enjoy rephrasing with RephraseGenie! 🎉**