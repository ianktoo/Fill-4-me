# Publishing Fill-4-Me to Browser Stores 🚀

This guide explains how to package and publish the **Fill-4-Me** extension to the Chrome Web Store and Firefox Add-ons.

---

## 1. Prepare the Production Build

We've provided a `Makefile` to automate the packaging process.

```bash
# Build and package the extension into a .zip file
make zip
```

The production zip will be generated in the `releases/` directory, named with the current version (e.g., `fill-4-me-v1.0.0.zip`).

---

## 2. Chrome Web Store (Google Chrome)

### Prerequisites
- A Google Developer Account (one-time $5 USD fee).
- [Chrome Developer Dashboard](https://chrome.google.com/webstore/devconsole).

### Steps
1. **Zip the Build**: Create a `.zip` file of the contents of the `dist/` folder.
   - *Note: Do not zip the `dist/` folder itself, only its contents.*
2. **Upload**: In the Developer Dashboard, click **"New Item"** and upload your `.zip` file.
3. **Metadata**:
   - **Name**: Fill-4-Me
   - **Summary**: Privacy-first browser extension to manage and auto-fill social media profiles.
   - **Detailed Description**: Use the content from `README.md`.
   - **Icons**: Upload icons (128x128px required).
   - **Screenshots**: Provide at least one 1280x800 or 640x400 screenshot.
4. **Privacy**:
   - **Single Purpose**: Explain that the extension's only purpose is to help users fill social media profile links.
   - **Permission Justification**: 
     - `storage`: To save profiles locally.
     - `activeTab`: To detect fields on the current page.
5. **Submit**: Click **"Submit for Review"**. Review typically takes 1-3 days.

---

## 3. Firefox Add-ons (Mozilla Firefox)

### Prerequisites
- A Firefox Accounts (AMO) account.
- [Firefox Add-on Developer Hub](https://addons.mozilla.org/en-US/developers/).

### Steps
1. **Zip the Build**: Create a `.zip` file of the contents of the `dist/` folder.
2. **Submit**: Click **"Submit a New Add-on"**.
3. **Self-Distribution vs. On AMO**: Choose **"On this site"** to list it publicly on Mozilla's store.
4. **Upload**: Upload your `.zip` file.
5. **Source Code**: Mozilla may ask if you used a build tool (Vite). Select **"Yes"** and provide a link to your GitHub repository or upload a zip of the source code (excluding `node_modules`).
6. **Metadata**: Fill in the name, description, and categories.
7. **Review**: Mozilla's review process is often faster than Chrome's but can be more strict regarding source code transparency.

---

## 4. Required Assets Checklist

Ensure you have these ready before starting the submission:

- [x] **Makefile**: Use `make zip` to generate your upload package.
- [ ] **Icons**: 16x16, 48x48, and 128x128 PNG files (generated via AI).
- [ ] **Screenshots**: At least 2 high-quality screenshots of the dashboard and the auto-fill feature in action.
- [ ] **Promotional Tile**: A 440x280 image for the Chrome Web Store.
- [ ] **Privacy Policy URL**: You can host a simple privacy policy on GitHub Pages or a similar service.

---

## 5. Privacy Policy Template

Since Fill-4-Me is privacy-first, your policy can be very simple:

> "Fill-4-Me does not collect, store, or transmit any user data to external servers. All profile information is stored locally on the user's device using browser storage APIs. No tracking or analytics are used."

---

## 6. Versioning

When you want to push an update:
1. Increment the `"version"` in `public/manifest.json` and `package.json`.
2. Run `npm run build` again.
3. Upload the new `.zip` to the respective developer consoles.
