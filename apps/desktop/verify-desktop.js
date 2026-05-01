const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');

app.on('ready', async () => {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    show: false, // Run headlessly for verification
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  const url = 'http://localhost:4300';
  console.log(`Loading ${url}...`);
  
  await win.loadURL(url);
  
  // Wait a bit for everything to render
  console.log('Waiting for render...');
  await new Promise(resolve => setTimeout(resolve, 5000));

  const screenshotPath = '/Users/cjungwo/.gemini/antigravity/brain/ca9c8984-26c7-403d-9afe-3d5742d93097/desktop_screenshot.png';
  
  try {
    const image = await win.webContents.capturePage();
    fs.writeFileSync(screenshotPath, image.toPNG());
    console.log(`Screenshot saved to ${screenshotPath}`);
  } catch (error) {
    console.error('Failed to capture page:', error);
  }

  app.quit();
});
