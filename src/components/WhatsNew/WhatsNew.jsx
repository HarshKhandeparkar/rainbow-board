import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import './WhatsNew.css';

function New({title, desc, version}) {
  return (
    <div className="card">
      <div className="card-content">
        <span className="card-title styled-text brand-text">{title}</span>
        <p>{desc}</p>
      </div>
      <div className="card-action">
        Added in <a href={`https://github.com/HarshKhandeparkar/rainbow-board/releases/${version}`}>v{version.replace('v', '')}</a>
      </div>
    </div>
  )
}

export default class WhatsNew extends Component {
  render() {
    return (
      <div>
        <nav>
          <div className="nav-wrapper header container">
            <span className="brand-logo center styled-text brand-text">What's New</span>
            <NavLink to="/" title="Home">
              <i className="material-icons brand-text">home</i>
            </NavLink>
          </div>
        </nav>

        <div className="container">
          <div className="row valign-wrapper">
            <div className="col s6">
              <New
                title="Hotkeys"
                desc={(<p><b>Ctrl+Z</b> or <b>Command+Z</b> to undo, <b>Ctrl+Shift+Z</b> or <b>Command+Shift+Z</b> to redo, and <b>Ctrl+S</b> or <b>Command+S</b> to save the slide!</p>)}
                version="0.4.0"
              />
            </div>
            <div className="col s6">
              <New
                title="Undo Redo"
                desc={(<p>You can now <b>undo</b> and <b>redo</b>  using the shiny buttons or hotkeys.</p>)}
                version="0.4.0"
              />
            </div>
          </div>
          <div className="row valign-wrapper">
            <div className="col s6">
              <New
                title="macOS Support"
                desc="Rainbow Board will be published to macOS every time as a dmg file."
                version="v0.4.1"
              />
            </div>
            <div className="col s6">
              <New
                title="Fixed Toolbar Overflow"
                desc="Whiteboard toolbar will adjust the size of the buttons in order to prevent overflow on small screen-sizes."
                version="v0.4.1"
              />
            </div>
          </div>
        </div>
      </div>
    )
  }
}
