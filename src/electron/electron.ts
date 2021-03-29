import { app, BrowserWindow } from 'electron';
import isDev from 'electron-is-dev';

import { loadPlugins } from './util/plugins';
import { makeSplashScreen } from './windows/splash';
import { createMainWindow } from './windows/mainWindow';
import { Plugin } from '../renderer/util/plugins';

let plugins: Plugin[] = [];

loadPlugins(plugins);

app.setName('Rainbow Board');

app.whenReady().then(() => {
  const splashWin = makeSplashScreen();
  createMainWindow(isDev, plugins, splashWin);
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow(isDev, plugins, null);
  }
})
