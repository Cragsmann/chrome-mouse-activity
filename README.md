Getting Started
To set up and run the Chrome extension, follow these steps:

1. Install Dependencies
   First, install the necessary dependencies using either yarn or npm.

# Using yarn

yarn install

# Or using npm

npm install

2. Build the Extension
   After installing the dependencies, build the extension.

# Using yarn

yarn build

# Or using npm

npm run build
This will compile the TypeScript files and bundle the extension into the dist folder.

3. Load the Extension in Chrome
   Open Chrome and navigate to chrome://extensions/.
   Enable Developer mode using the toggle in the top-right corner.
   Click on the "Load unpacked" button.
   Select the dist folder in your project directory.
   Your extension should now be loaded and ready to use!

4. Debugging
   You can inspect and debug different parts of the extension:

Popup: Right-click inside the extension popup and select Inspect.
Content Script: Inspect any webpage where the content script is active by right-clicking on the page and selecting Inspect.
Service Worker: Go to chrome://extensions/, find your extension, and click "Service worker" under "Inspect views".
