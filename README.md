# Fill-4-Me 🚀

> **Suggested GitHub Repo Name:** `fill-4-me`  
> **Suggested Description:** Privacy-first browser extension to manage and auto-fill social media profiles. Your data never leaves your browser.

## Overview
Fill-4-Me is an open-source browser extension (Chrome & Firefox) designed to help users manage and auto-fill their social media profiles. It's particularly useful for developers and professionals who maintain multiple profiles (e.g., Personal vs. Work GitHub) and frequently need to provide these links on job applications, contact forms, or networking sites.

## 🛡️ Privacy First
Privacy is the core of Fill-4-Me. 
- **Local Storage Only**: All your profile data is stored exclusively in your browser's local storage (`chrome.storage.local` or `localStorage`).
- **No Cloud Sync**: We do not use any external databases or cloud services.
- **No Tracking**: There are no analytics, tracking scripts, or telemetry.
- **Zero Data Leakage**: Your data never leaves your machine.

## Key Features
- **Multi-Profile Support**: Save multiple profiles for the same platform (LinkedIn, GitHub, Twitter, etc.).
- **AI Magic Fill**: Use AI to extract profile information from raw text or bios instantly. Supports **Google Gemini**, **OpenAI**, and **Anthropic**.
- **Custom AI Providers**: Bring your own API keys for your preferred AI model.
- **Smart Detection**: Automatically identifies social media input fields on any website.
- **One-Click Fill**: Injects a small "F" icon into detected fields for quick selection.
- **Open Source**: Fully transparent code that you can audit or contribute to.

## Technical Architecture
- **Frontend**: React 19 with Tailwind CSS 4.
- **Animations**: Motion (formerly Framer Motion).
- **Icons**: Lucide React.
- **Extension Manifest**: Manifest V3 (Chrome) and compatible with Firefox.

## How to Install (Developer Mode)
1. Download the source code.
2. Run `npm install` and `npm run build`.
3. Open your browser's extension management page:
   - Chrome: `chrome://extensions`
   - Firefox: `about:debugging#/runtime/this-firefox`
4. Enable "Developer mode".
5. Click "Load unpacked" and select the `dist` folder.

## Project Structure
- `/src/App.tsx`: The main dashboard and popup UI.
- `/src/content.ts`: The script that runs on websites to detect fields.
- `/public/manifest.json`: Extension configuration.
- `/src/types.ts`: TypeScript definitions for profiles.

## License
This project is open-source and available under the [MIT License](LICENSE).
