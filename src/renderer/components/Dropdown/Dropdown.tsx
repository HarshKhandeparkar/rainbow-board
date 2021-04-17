import React, { Component, createRef, RefObject } from 'react';
import './Dropdown.css'

interface IDropdownProps {
  getTriggerBtn: (ref: RefObject<HTMLButtonElement>) => React.ReactElement<HTMLButtonElement>
}

export class Dropdown extends Component<IDropdownProps> {
  btnRef: RefObject<HTMLButtonElement> = createRef();
  dropdownRef: RefObject<HTMLDivElement> = createRef();
  arrowRef: RefObject<HTMLDivElement> = createRef();

  state = {
    dropped: false
  }

  adjustPosition() {
    const btnRect = this.btnRef.current.getBoundingClientRect();
    const dropdownRect = this.dropdownRef.current.getBoundingClientRect();
    const arrowRect = this.arrowRef.current.getBoundingClientRect();

    let dropdownLeft = btnRect.left - (dropdownRect.width - btnRect.width) / 2;
    const dropdownTop = btnRect.top + btnRect.height + arrowRect.height / 2;
    let arrowLeft = btnRect.left - (arrowRect.width / Math.sqrt(2) - btnRect.width) / (2);
    const arrowTop = dropdownTop - arrowRect.height / (2 * Math.sqrt(2)); // sqrt(2) to handle 45deg rotation

    dropdownLeft = Math.min(document.body.clientWidth - dropdownRect.width - 5, dropdownLeft); // 5 px padding on the right
    dropdownLeft = Math.max(5, dropdownLeft); // 5 px padding on the left

    arrowLeft = Math.min(arrowLeft, dropdownLeft + dropdownRect.width - arrowRect.width / Math.sqrt(2)); // padding to the right of dropdown
    arrowLeft = Math.min(arrowLeft, dropdownLeft + arrowRect.width / Math.sqrt(2)); // padding to the left of dropdown

    this.dropdownRef.current.style.setProperty('left', `${dropdownLeft.toString()}px`);
    this.dropdownRef.current.style.setProperty('top', `${dropdownTop.toString()}px`);
    this.dropdownRef.current.style.setProperty('min-width', `${btnRect.width.toString()}px`);

    this.arrowRef.current.style.setProperty('top', `${arrowTop.toString()}px`);
    this.arrowRef.current.style.setProperty('left', `${arrowLeft.toString()}px`);
  }

  _onResize = () => {
    this.adjustPosition();
  }

  _onClick = () => {
    this.adjustPosition();

    this.setState({
      dropped: !this.state.dropped
    })
  }

  componentDidMount() {
    this.btnRef.current.addEventListener('click', this._onClick);
    window.addEventListener('resize', this._onResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this._onResize);
    this.btnRef.current.removeEventListener('resize', this._onClick);
  }

  render() {
    return (
      <>
        {this.props.getTriggerBtn(this.btnRef)}
        <div
          ref={this.arrowRef}
          className="dropdown-arrow"
          style={{
            visibility: this.state.dropped ? 'visible' : 'hidden',
            position: 'absolute'
          }}
        />
        <div
          className="dropdown-content"
          ref={this.dropdownRef}
          style={
            {
              visibility: this.state.dropped ? 'visible' : 'hidden',
              position: 'absolute'
            }
          }
        >
          {this.props.children}
        </div>
      </>
    )
  }
}
