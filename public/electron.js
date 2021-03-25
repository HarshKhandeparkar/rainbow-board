const { app, BrowserWindow, shell, dialog, ipcMain, Menu } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');

function makeSplashScreen() {
  const splashWin = new BrowserWindow({
    width: 400,
    height: 400,
    center: true,
    resizable: false,
    frame: false,
    show: false,
    icon: path.join(__dirname, 'icon.png')
  })

  splashWin.removeMenu();
  splashWin.loadFile(path.join(__dirname, 'splash.html'));

  splashWin.webContents.on('did-finish-load', () => {
    splashWin.show();
  })

  return splashWin;
}

function createMainWindow(splashWin) {
  const win = new BrowserWindow({
    webPreferences: {
      devTools: isDev,
      enableRemoteModule: true,
      nodeIntegration: true,
      contextIsolation: false
    },
    show: false,
    icon: path.join(__dirname, 'icon.png')
  })

  win.loadFile(path.join(__dirname, 'index.html'));

  const windowMenuTemplate = [
    {
      type: 'submenu',
      label: '&File',
      submenu: [
        {label: 'Start New', accelerator: 'CmdOrCtrl + N'},
        {label: 'Save Page', accelerator: 'CmdOrCtrl + S'}
      ]
    },
    {
      type: 'submenu',
      label: '&Edit',
      submenu: [
        {label: 'Undo', accelerator: 'CmdOrCtrl + Z'},
        {label: 'Redo', accelerator: 'CmdOrCtrl + Y'},
        {type: 'separator'},
        {label: 'Add Page', accelerator: 'Plus'},
        {label: 'Clear Page', accelerator: 'Delete'},
        {label: 'Delete Page', accelerator: 'CmdOrCtrl + Delete'},
        {type: 'separator'},
        {label: 'Next Page', accelerator: 'Right'},
        {label: 'Previous Page', accelerator: 'Left'},
        {type: 'separator'},
        {label: 'Color Palette', accelerator: 'CmdOrCtrl + P'},
        {label: 'Brush Tool', accelerator: 'CmdOrCtrl + 1'},
        {label: 'Eraser', accelerator: 'CmdOrCtrl + 2'},
        {label: 'Line Tool', accelerator: 'CmdOrCtrl + 3'},
      ]
    },
    {
      type: 'submenu',
      label: '&Go',
      submenu: [
        {label: 'Home'},
        {label: `What's New`},
        {label: 'Credits'}
      ]
    }
  ]

  win.setMenu(Menu.buildFromTemplate(windowMenuTemplate));

  ipcMain.on('set-hotkeys', (event) => {
    // Submenu: File
    windowMenuTemplate[0].submenu[0].click = () => event.reply('go-pages');
    windowMenuTemplate[0].submenu[1].click = () => event.reply('save');

    // Submenu: Edit
    windowMenuTemplate[1].submenu[0].click = () => event.reply('undo');
    windowMenuTemplate[1].submenu[1].click = () => event.reply('redo');
    windowMenuTemplate[1].submenu[3].click = () => event.reply('add');
    windowMenuTemplate[1].submenu[4].click = () => event.reply('clear');
    windowMenuTemplate[1].submenu[5].click = () => event.reply('delete');
    windowMenuTemplate[1].submenu[7].click = () => event.reply('next');
    windowMenuTemplate[1].submenu[8].click = () => event.reply('prev');
    windowMenuTemplate[1].submenu[10].click = () => event.reply('color-palette');
    windowMenuTemplate[1].submenu[11].click = () => event.reply('set-tool', {tool: 'brush'});
    windowMenuTemplate[1].submenu[12].click = () => event.reply('set-tool', {tool: 'eraser'});
    windowMenuTemplate[1].submenu[13].click = () => event.reply('set-tool', {tool: 'line'});

    // Submenu: Go
    windowMenuTemplate[2].submenu[0].click = () => event.reply('go-home');
    windowMenuTemplate[2].submenu[1].click = () => event.reply('go-whatsnew');
    windowMenuTemplate[2].submenu[2].click = () => event.reply('go-credits');

    win.setMenu(Menu.buildFromTemplate(windowMenuTemplate));
  })

  if (isDev) win.webContents.openDevTools();

  win.webContents.setWindowOpenHandler((e, url) => {
    e.preventDefault();
    shell.openExternal(url);
  })

  app.showExitPrompt = true;

  ipcMain.on('prompt', (event, args) => {
    dialog.showMessageBox(win, {
      type: 'question',
      buttons: args.buttons,
      title: args.title,
      message: args.message
    }).then(({ response }) => {
      event.reply('prompt-reply', { event: args.event, response, options: args.options });
    })
  })

  win.on('close', (e) => {
    if (app.showExitPrompt) {
      if (win.webContents.getURL().toLowerCase().includes('#/pages')) {
        e.preventDefault(); // Prevents the window from closing
        dialog.showMessageBox(win, {
          type: 'question',
          buttons: ['Yes', 'No'],
          title: 'Quit?',
          message: 'Unsaved data will be lost. Are you sure you want to quit?'
        }).then(({ response }) => {
          if (response === 0) { // Runs the following if 'Yes' is clicked
            app.showExitPrompt = false;
            win.close();
          }
        })
      }
    }
  })

  win.webContents.on('did-finish-load', () => {
    if (splashWin) if (!splashWin.isDestroyed()) splashWin.close();
    win.show();
  })
}

app.setName('Rainbow Board');

app.whenReady().then(() => {
  const splashWin = makeSplashScreen();
  createMainWindow(splashWin);
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
  }
})
