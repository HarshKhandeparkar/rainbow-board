import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.jsx';
import 'materialize-css/dist/css/materialize.min.css';

import './css/index.css';
import './css/font-awesome.min.css';
import 'material-icons/iconfont/material-icons.css';

import { goHome, goPages, goWhatsNew, goCredits } from './util/navigation';
import { ipcRenderer } from 'electron';
import ipcHandler from './util/ipc-handler';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)

ipcRenderer.send('set-hotkeys');
ipcHandler.addEventHandler('go-home', 'goHomeHandler', goHome);
ipcHandler.addEventHandler('go-whatsnew', 'goNewHandler', goWhatsNew);
ipcHandler.addEventHandler('go-pages', 'goPagesHandler', goPages);
ipcHandler.addEventHandler('go-credits', 'goCreditsHandler', goCredits);
