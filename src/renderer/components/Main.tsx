import React from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import packageFile from '../../../package.json';
import Download from './Download/Download';
import Grid from './Grid/Grid';
import GridItem from './Grid/GridItem';

import { hasSetting, getSetting } from '../util/settings';
import { Icon } from './Icon/Icon';
import { faPaintBrush, faBell, faCog } from '@fortawesome/free-solid-svg-icons';

const { version, discordInvite } = packageFile;

function Main() {
  const history = useHistory();
  let doShowChangelog = true;

  if (hasSetting('lastVersionChangelogShown')) {
    if (getSetting('lastVersionChangelogShown') === version) doShowChangelog = false;
  }

  if (doShowChangelog) history.push('/new');

  return (
    <div id="main">
      <nav>
        <div className="nav-wrapper header">
          <span className="header-text brand-logo center brand-text">Rainbow Board</span>
        </div>
      </nav>
      <div className="container center">
        <div className="row">
          <p>
            Open Source, Cross Platform Whiteboard software made with React JS, Electron and SVG Real Renderer.
          </p>
        </div>

        <Grid
          options={{
            numColumns: 6
          }}
        >
          <GridItem />
          <GridItem
            options={{
              width: 2
            }}
          >
            <NavLink to="/pages" className="btn center brand-text full-width" title="New Whiteboard Page">
              <Icon options={{icon: faPaintBrush}} rightMargin={true} /> New Page
            </NavLink>
          </GridItem>

          <GridItem
            options={{
              width: 2
            }}
          >
            <NavLink to="/new" className="btn center brand-text full-width" title="New Changes">
              <Icon options={{icon: faBell}} rightMargin={true} />What's New!
            </NavLink>
          </GridItem>
          <GridItem />

          <GridItem />
          <GridItem
            options={{
              width: 4
            }}
          >
            <Download />
          </GridItem>
          <GridItem />
        </Grid>
      </div>

      <footer className="page-footer">
        <div className="container">
          <div className="row">
            <div className="col s6">
              <div className="row">
                <h5 className="brand-text">Additional Links</h5>
              </div>
              <div className="row">
                <ul>
                  <li><a href="https://github.com/HarshKhandeparkar/rainbow-board/issues/new/choose" target="_blank" rel="noreferrer">Feedback or Questions</a></li>
                  <li><a href="https://github.com/HarshKhandeparkar/rainbow-board/" target="_blank" rel="noreferrer">Star on Github</a></li>
                  <li><a href={discordInvite} target="_blank" rel="noreferrer">Chat on Discord</a></li>
                </ul>
              </div>
              <div className="row">
                <NavLink to="/settings" className="btn-floating brand-text center" title="Open Settings">
                  <Icon options={{icon: faCog}} />
                </NavLink>
              </div>
            </div>
            <div className="col s6">
              <h5 className="brand-text">Painted Using</h5>
              <ul>
                <li><a href="https://electronjs.org" target="_blank" rel="noreferrer">Electron</a></li>
                <li><a href="https://reactjs.org" target="_blank" rel="noreferrer">React</a></li>
                <li><a href="https://harshkhandeparkar.github.io/svg-real-renderer" target="_blank" rel="noreferrer">SVG Real Renderer</a></li>
                <li><NavLink to="/credits">Full Credits</NavLink></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-copyright container-fluid center z-depth-2">
          <p className="center" style={{width: '100%'}}>
            v{version}
          </p>
        </div>
      </footer>
    </div>
  )
}

export default Main;
