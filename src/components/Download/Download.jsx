import React, { Component } from 'react';
import M from 'materialize-css';
import { gt } from 'semver';
import { version } from '../../../package.json';

export default class Download extends Component {
  state = {
    latestVersion: version,
    downloadURLs: {
      deb: '',
      msi: '',
      zip_linux: ''
    }
  }

  render() {
    console.log(this.state)
    return (
      <div>
        {
          (!navigator.userAgent.toLowerCase().includes('electron') || gt(this.state.latestVersion, version)) &&
          (
            <div>
              <button className="dropdown-trigger btn center brand-gradient gradient-text" data-target="download-dropdown">
                <i className="fa fa-download left" />
                Download {
                  navigator.userAgent.toLowerCase().includes('electron') ? 'New Version' : 'Desktop App'
                }
              </button>

              <ul id='download-dropdown' className='dropdown-content'>
                {
                  this.state.downloadURLs.deb !== '' &&
                  <li>
                    <a target="_blank" rel="noreferrer" href={this.state.downloadURLs.deb} className="btn-flat brand-gradient gradient-text">
                      <i className="fa fa-linux" />
                      Linux (deb)
                    </a>
                  </li>
                }
                {
                  this.state.downloadURLs.zip_linux !== '' &&
                  <li>
                    <a target="_blank" rel="noreferrer" href={this.state.downloadURLs.zip_linux} className="btn-flat brand-gradient gradient-text">
                      <i className="fa fa-linux" />
                      Linux (zip)
                    </a>
                  </li>
                }
                {
                  this.state.downloadURLs.msi !== '' &&
                  <li>
                    <a target="_blank" rel="noreferrer" href={this.state.downloadURLs.msi} className="btn-flat brand-gradient gradient-text">
                      <i className="fa fa-windows" />
                      Windows (MSI)
                    </a>
                  </li>
                }
                <li>
                  <a href="https://github.com/HarshKhandeparkar/rainbow-board/blob/master/MAC_PUBLISH.md" target="_blank" rel="noopener noreferrer" className="btn-flat brand-gradient gradient-text">
                    <i className="fa fa-apple" />
                    Need Help
                  </a>
                </li>
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

        const debAsset = releaseInfo.assets.find((asset) => asset.name.includes('.deb'));
        const zipLinuxAsset = releaseInfo.assets.find((asset) => asset.name.includes('.zip') && asset.name.includes('linux'));
        const msiAsset = releaseInfo.assets.find((asset) => asset.name.includes('.msi'));

        this.setState({
          latestVersion: releaseInfo.tag_name,
          downloadURLs: {
            deb: debAsset ? debAsset.browser_download_url : '',
            zip_linux: zipLinuxAsset ? zipLinuxAsset.browser_download_url : '',
            msi: msiAsset ? msiAsset.browser_download_url : '',
          }
        })
      }
    }
    xmlHttp.open('GET', 'https://api.github.com/repos/HarshKhandeparkar/rainbow-board/releases/latest', true); // true for asynchronous
    xmlHttp.send(null);
    xmlHttp.onerror = console.log;
  }
}
