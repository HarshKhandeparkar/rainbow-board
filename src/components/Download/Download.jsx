import React, { Component } from 'react';
import M from 'materialize-css';
import { version } from '../../../package.json';

export default class Download extends Component {
  state = {
    latestVersion: version,
    downloadURLs: {
      // linux
      deb: '',
      zip_linux: '',
      appimg: '',

      // windows
      exe: '',
      msi: '',
      zip_windows: '',

      // macos
      dmg: ''
    }
  }

  render() {
    return (
      <div>
        {
          (
            <div>
              <button className="dropdown-trigger btn center brand-text" data-target="download-dropdown">
                <i className="fa fa-download left" />
                Download Desktop App
              </button>

              <ul id="download-dropdown" className="dropdown-content">
                <li>
                  <a target="_blank" rel="noreferrer" href="https://snapcraft.io/rainbow-board" className="btn-flat brand-text">
                    <i className="fa fa-linux" />
                    Linux (snap)
                  </a>
                </li>
                {
                  this.state.downloadURLs.msi !== '' &&
                  <li>
                    <a target="_blank" rel="noreferrer" href={this.state.downloadURLs.msi} className="btn-flat brand-text">
                      <i className="fa fa-windows" />
                      Windows (MSI)
                    </a>
                  </li>
                }
                {
                  this.state.downloadURLs.dmg !== '' &&
                  <li>
                    <a target="_blank" rel="noreferrer" href={this.state.downloadURLs.exe} className="btn-flat brand-text">
                      <i className="fa fa-apple" />
                      Mac (DMG)
                    </a>
                  </li>
                }
                {
                  this.state.downloadURLs.deb !== '' &&
                  <li>
                    <a target="_blank" rel="noreferrer" href={this.state.downloadURLs.deb} className="btn-flat brand-text">
                      <i className="fa fa-linux" />
                      Linux (DEB)
                    </a>
                  </li>
                }
                {
                  this.state.downloadURLs.appimg !== '' &&
                  <li>
                    <a target="_blank" rel="noreferrer" href={this.state.downloadURLs.appimg} className="btn-flat brand-text">
                      <i className="fa fa-linux" />
                      Linux (portable)
                    </a>
                  </li>
                }
                {
                  this.state.downloadURLs.zip_windows !== '' &&
                  <li>
                    <a target="_blank" rel="noreferrer" href={this.state.downloadURLs.zip_windows} className="btn-flat brand-text">
                      <i className="fa fa-windows" />
                      Windows (ZIP)
                    </a>
                  </li>
                }
                {
                  this.state.downloadURLs.zip_linux !== '' &&
                  <li>
                    <a target="_blank" rel="noreferrer" href={this.state.downloadURLs.zip_linux} className="btn-flat brand-text">
                      <i className="fa fa-linux" />
                      Linux (ZIP)
                    </a>
                  </li>
                }
                {
                  this.state.downloadURLs.exe !== '' &&
                  <li>
                    <a target="_blank" rel="noreferrer" href={this.state.downloadURLs.exe} className="btn-flat brand-text">
                      <i className="fa fa-windows" />
                      Windows (EXE)
                    </a>
                  </li>
                }
              </ul>
            </div>
          )
        }
      </div>
    )
  }

  componentDidUpdate() {
    const elems = document.querySelectorAll('.dropdown-trigger');
    M.Dropdown.init(elems);
  }

  componentDidMount() {
    const elems = document.querySelectorAll('.dropdown-trigger');
    M.Dropdown.init(elems);

    const xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = () => {
      if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
        const releaseInfo = JSON.parse(xmlHttp.responseText);

        // linux assets
        const debAsset = releaseInfo.assets.find((asset) => asset.name.includes('.deb'));
        const zipLinuxAsset = releaseInfo.assets.find((asset) => asset.name.includes('.zip') && asset.name.includes('linux'));
        const appimgAsset = releaseInfo.assets.find((asset) => asset.name.toLowerCase().includes('.appimage'));

        // windows assets
        const exeAsset = releaseInfo.assets.find((asset) => asset.name.includes('.exe'));
        const msiAsset = releaseInfo.assets.find((asset) => asset.name.includes('.msi'));
        const zipWindowsAsset = releaseInfo.assets.find((asset) => asset.name.includes('.zip') && asset.name.includes('win'));

        // macos assets
        const dmgAsset = releaseInfo.assets.find((asset) => asset.name.toLowerCase().includes('.dmg'));

        this.setState({
          latestVersion: releaseInfo.tag_name,
          downloadURLs: {
            // linux
            deb: debAsset ? debAsset.browser_download_url : '',
            zip_linux: zipLinuxAsset ? zipLinuxAsset.browser_download_url : '',
            appimg: appimgAsset ? appimgAsset.browser_download_url : '',

            // windows
            exe: exeAsset ? exeAsset.browser_download_url : '',
            msi: msiAsset ? msiAsset.browser_download_url : '',
            zip_windows: zipWindowsAsset ? zipWindowsAsset.browser_download_url : '',

            // macos
            dmg: dmgAsset ? dmgAsset.browser_download_url : ''
          }
        })
      }
    }
    xmlHttp.open('GET', 'https://api.github.com/repos/HarshKhandeparkar/rainbow-board/releases/latest', true); // true for asynchronous
    xmlHttp.send(null);
    xmlHttp.onerror = console.log;
  }
}
