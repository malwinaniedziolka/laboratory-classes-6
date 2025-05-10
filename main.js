const { app, BrowserWindow } = require('electron');
const http = require('http');
const expressApp = require('./server.js');

let mainWindow;

const createWindow = () => {
	mainWindow = new BrowserWindow({
		width: 1000,
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
	expressApp
		.listen(3000)
		.on('listening', () => {
			const checkServer = setInterval(() => {
				http
					.get('http://localhost:3000', (res) => {
						if (res.statusCode === 200) {
							clearInterval(checkServer);
							createWindow();
						}
					})
					.on('error', () => {});
			}, 1000);
		})
		.on('error', (err) => {
			app.quit();
		});

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
