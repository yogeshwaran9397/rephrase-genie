# RephraseGenie 🪄

[![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-green?logo=google-chrome)](https://chrome.google.com/webstore)
[![Version](https://img.shields.io/badge/version-1.0-blue)](#)
[![License](https://img.shields.io/badge/license-Open%20Source-brightgreen)](#license)

**RephraseGenie** is a powerful Chrome extension that transforms your writing instantly with AI-powered text rephrasing. Whether you're a writer, student, or professional, enhance your content quality effortlessly with just a right-click or keyboard shortcut.

<div align="center">
  <img width="562" height="595" alt="RephraseGenie Extension Interface" src="https://github.com/user-attachments/assets/6fe7fd96-d3df-402b-8d69-f2fad07582e5" />
</div>

## ✨ Key Features

🎯 **Multiple Access Methods**
- Right-click context menu integration
- Keyboard shortcut (`Ctrl+Shift+R`)
- Extension popup interface

🎨 **6 Professional Tone Styles**
- **Professional** - Business-appropriate language
- **Casual** - Conversational and relaxed
- **Formal** - Academic and structured
- **Technical** - Precise and technical language
- **Friendly** - Warm and approachable
- **Concise** - Brief and to the point

⚡ **Instant Actions**
- Copy rephrased text to clipboard
- Replace selected text directly on the page
- Draggable popup interface
- Real-time text transformation

🔒 **Security & Privacy**
- Secure API key storage in Chrome's storage
- Direct OpenAI API integration
- No third-party data collection
- Local processing

## 🚀 Quick Start

### 1. **Installation**
```
1. Download or clone this repository
2. Open Chrome → Extensions (chrome://extensions/)
3. Enable Developer mode
4. Click "Load unpacked" → Select the extension folder
```

### 2. **Setup OpenAI API Key**
```
1. Get your API key from https://platform.openai.com/
2. Click the extension icon in Chrome's toolbar
3. Enter your API key and click "Save Key"
```

### 3. **Start Rephrasing**
```
1. Select any text on a webpage
2. Right-click → "Rephrase with RephraseGenie"
3. Choose your preferred tone style
4. Copy or replace the enhanced text
```

## 📖 How It Works

RephraseGenie leverages OpenAI's advanced language models to intelligently rephrase your selected text while maintaining the original meaning. The extension integrates seamlessly into your browsing experience, making text enhancement as simple as a right-click.

### **Workflow:**
1. **Select** - Highlight any text on any webpage
2. **Rephrase** - Right-click or use `Ctrl+Shift+R`
3. **Choose** - Pick from 6 different tone styles
4. **Apply** - Copy to clipboard or replace directly

## 🛠️ Technical Details

### **Built With:**
- **Manifest V3** - Latest Chrome extension standard
- **OpenAI API** - GPT-4o-mini for cost-effective rephrasing
- **Vanilla JavaScript** - Lightweight and fast
- **Chrome Storage API** - Secure local storage

### **Permissions:**
- `contextMenus` - Right-click integration
- `activeTab` - Access to current webpage
- `storage` - API key storage
- `scripting` - Text manipulation

## 📁 Project Structure

```
rephrase-genie/
├── 📄 manifest.json          # Extension configuration
├── ⚙️ background.js          # Service worker for API calls
├── 🌐 content.js             # Content script for webpage interaction
├── 🎨 popup.html             # Extension popup interface
├── ⚡ popup.js               # Popup functionality
├── 💅 styles.css             # Popup styling
├── 📚 SETUP_GUIDE.md         # Detailed setup instructions
├── 🔐 OAUTH_DOCUMENTATION.md # OAuth configuration guide
└── 🖼️ icons/                # Extension icons
    └── 📝 README.md          # Icon setup instructions
```

## 💡 Use Cases

### **For Writers & Content Creators**
- Adjust tone for different audiences
- Improve clarity and readability
- Generate alternative phrasings
- Enhance professional communication

### **For Students & Academics**
- Transform casual notes to formal writing
- Improve essay quality
- Create multiple versions of explanations
- Enhance technical writing

### **For Professionals**
- Polish email communications
- Improve presentation content
- Standardize documentation tone
- Enhance client communications

## 🎯 Perfect For

✅ Email writing and responses  
✅ Social media content  
✅ Academic papers and essays  
✅ Professional documentation  
✅ Blog posts and articles  
✅ Marketing copy  
✅ Customer communications  

## 💰 Cost Considerations

- Uses OpenAI's pay-per-use API model
- GPT-4o-mini provides cost-effective rephrasing
- Transparent usage tracking through OpenAI dashboard
- Set usage limits in your OpenAI account for budget control

## 🔧 Development & Customization

Want to customize RephraseGenie? Check out our [Setup Guide](SETUP_GUIDE.md) for detailed development instructions.

### **Quick Development Setup:**
```bash
1. Clone the repository
2. Make your changes to the source files
3. Reload the extension in Chrome
4. Test your modifications
```

## 🤝 Contributing

We welcome contributions! Whether it's bug fixes, feature enhancements, or documentation improvements:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 🐛 Troubleshooting

**Common Issues:**
- **API Key Error**: Ensure your OpenAI API key is valid and saved
- **No Context Menu**: Make sure text is selected before right-clicking
- **Shortcut Not Working**: Check for conflicts with other extensions

For detailed troubleshooting, see our [Setup Guide](SETUP_GUIDE.md).

## 📄 License

This project is open source and available under the MIT License. Feel free to modify and distribute according to your needs.

## ⚠️ Privacy Notice

RephraseGenie sends selected text to OpenAI's servers for processing. Ensure compliance with your organization's data policies when using with sensitive information.

---

<div align="center">
  <strong>Transform your writing instantly with RephraseGenie! 🎉</strong>
  <br><br>
  <em>Made with ❤️ for writers, students, and professionals worldwide</em>
</div>
