const { app, BrowserWindow } = require('electron');
const http = require('http');

let mainWindow;

const createWindow = () => {
	mainWindow = new BrowserWindow({
		width: 1200,
		height: 800,
		webPreferences: {
			nodeIntegration: true,
		},
	});

	mainWindow.loadURL('http://localhost:3000');

	mainWindow.on('closed', () => {
		mainWindow = null;
	});
};

app.whenReady().then(() => {
  const checkServer = setInterval(() => {
    http.get('http://localhost:3000', (res) => {
      if (res.statusCode === 200) {
        clearInterval(checkServer);
        createWindow();
      }
    }).on('error', () => {});
  }, 500);

	app.on('window-all-closed', () => {
		if (process.platform !== 'darwin') {
			app.quit();
		}
	});
});

app.on('activate', () => {
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow();
	}
});
