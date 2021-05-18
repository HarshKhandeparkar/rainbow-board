import React, { Component, createRef, RefObject } from 'react';
import M, { Modal } from 'materialize-css';
import PaintSettings from '../../PaintSettings/PaintSettings';
import { Dropdown } from '../../Dropdown/Dropdown';

import { Icon } from '../../Icon/Icon';
import {
  faPaintBrush,
  faEraser,
  faGripLines,
  faPalette,
  faUndo,
  faRedo,
  faSave,
  faBan,
  faHome,
  faBorderAll,
  faAlignJustify,
  faSquare,
  faEllipsisV,
  faFileImage
} from '@fortawesome/free-solid-svg-icons';

import './Toolbar.css';
import { go } from '../../../util/navigation';
import ipcHandler from '../../../util/ipc-handler';
import { RealDrawBoard, RealDrawBoardTypes } from 'svg-real-renderer/build/src/renderers/RealDrawBoard/RealDrawBoard';
import { getRGBColorString } from 'svg-real-renderer/build/src/util/getRGBColorString';
import { Tool, ToolSettings } from 'svg-real-renderer/build/src/renderers/RealDrawBoard/tools/tools';
import { Color } from 'svg-real-renderer/build/src/types/RealRendererTypes';

import * as EVENTS from '../../../../common/constants/eventNames';
import { BRUSH_TOOL, LINE_TOOL, ERASER_TOOL, COLOR_PALETTE, UNDO, REDO, EXPORT_PAGE, CLEAR_PAGE, SAVE } from '../../../../common/constants/shortcuts';

export interface IToolbarProps {
  boardOptions: RealDrawBoardTypes.IRealDrawBoardParametersSettings;
  _changeToolSetting: (setting: keyof ToolSettings, value: number) => void;
  _setTool: (tool: Tool) => void;
  boardState: {
    drawBoard: RealDrawBoard,
    tool: Tool
  };
  _clearBoard: () => void;
  _export: (saveType: 'svg' | 'png') => void;
  _save: () => void;
  _onUndo: () => void;
  _onRedo: () => void;
}

export type RBBGType = 'ruled' | 'grid' | 'none';

export class Toolbar extends Component<IToolbarProps> {
  // Modals
  saveBoardRef: RefObject<HTMLDivElement> = createRef();
  colorPickerRef: RefObject<HTMLDivElement> = createRef();

  // Ranges
  brushSizeRangeRef: RefObject<HTMLInputElement> = createRef();
  eraserSizeRangeRef: RefObject<HTMLInputElement> = createRef();
  changeRateRangeRef: RefObject<HTMLInputElement> = createRef();
  lineThicknessRangeRef: RefObject<HTMLInputElement> = createRef();
  lineColorRangeRef: RefObject<HTMLInputElement> = createRef();

  saveBoardModalInstance: Modal;
  colorPickerInstance: Modal;

  state: {
    brushSize: number;
    eraserSize: number;
    lineThickness: number;
    lineColor: Color;
    brushColor: Color;
    saveType: 'svg' | 'png';
    saveModalOn: boolean;
    previousTool: Tool;
    bgType: RBBGType;
  } = {
    brushSize: this.props.boardOptions.toolSettings.brushSize,
    eraserSize: this.props.boardOptions.toolSettings.eraserSize,
    // changeRate: this.props.boardOptions.toolSettings.changeRate,
    lineThickness: this.props.boardOptions.toolSettings.lineThickness,
    lineColor: this.props.boardOptions.toolSettings.lineColor,
    brushColor: this.props.boardOptions.toolSettings.brushColor,
    saveType: 'png',
    saveModalOn: false,
    previousTool: this.props.boardOptions.tool,
    bgType: this.props.boardState.drawBoard.bgType.type as RBBGType
  }

  _initializeModal() {
    if (!this.saveBoardModalInstance) this.saveBoardModalInstance = M.Modal.init(this.saveBoardRef.current);
    if (!this.colorPickerInstance) this.colorPickerInstance = M.Modal.init(this.colorPickerRef.current);
  }

  componentDidUpdate() {
    this._initializeModal();
  }

  onBrushSizeChange = () => {
    this.props._changeToolSetting('brushSize', Number(this.brushSizeRangeRef.current.value));
    this.setState({
      brushSize: Number(this.brushSizeRangeRef.current.value)
    })
  }

  // onColorRateChange = () => {
  //   this.props._changeToolSetting('changeRate', Number(this.changeRateRangeRef.current.value));
  //   this.setState({
  //     changeRate: Number(this.changeRateRangeRef.current.value)
  //   })
  // }

  onEraserSizeChange = () => {
    this.props._changeToolSetting('eraserSize', Number(this.eraserSizeRangeRef.current.value));
    this.setState({
      eraserSize: Number(this.eraserSizeRangeRef.current.value)
    })
  }

  onLineThicknessChange = () => {
    this.props._changeToolSetting('lineThickness', Number(this.lineThicknessRangeRef.current.value));
    this.setState({
      lineThickness: Number(this.lineThicknessRangeRef.current.value)
    })
  }

  _removeHotkeys() {
    ipcHandler.removeEventHandler(EVENTS.TOGGLE_COLOR_PALETTE, 'colorPaletteHandler');
    ipcHandler.removeEventHandler(EVENTS.SET_TOOL, 'setToolHandler');
  }

  _setHotkeys() {
    this._removeHotkeys();

    ipcHandler.addEventHandler(EVENTS.TOGGLE_COLOR_PALETTE, 'colorPaletteHandler', () => this.colorPickerInstance.isOpen ? this.colorPickerInstance.close() : this.colorPickerInstance.open());
    ipcHandler.addEventHandler(EVENTS.SET_TOOL, 'setToolHandler', (event, args) => this._setTool(args.tool));
    ipcHandler.addEventHandler(EVENTS.PREV_TOOL, 'prevToolHandler', (event, args) => this._setTool(this.state.previousTool));
  }

  private _setTool(tool: Tool) {
    if (tool !== this.props.boardState.tool) {
      this.setState({
        previousTool: this.props.boardState.tool
      })
      this.props._setTool(tool);
    }
  }

  componentDidMount() {
    this._setHotkeys();
    this._initializeModal();

    this.props.boardState.drawBoard.on('tool-setting-change', 'toolbar-setting-change', ({settingName, newValue}) => {
      this.setState({
        [settingName]: newValue
      })
    })

    this.props.boardState.drawBoard.on('import', 'bgtype-handler', (params) => {
      if (params.import.bgType) {
        this.setState({
          bgType: params.import.bgType.type as RBBGType
        })
      }
    })
  }

  componentWillUnmount() {
    this._removeHotkeys();
  }

  _setBG(type: 'ruled' | 'grid' | 'none') {
    switch(type) {
      case 'none':
        this.props.boardState.drawBoard.changeBackground({
          type: 'none'
        })

        this.setState({bgType: type})
        break;

      case 'grid':
        this.props.boardState.drawBoard.changeBackground({
          type: 'grid',
          xSpacing: 15,
          ySpacing: 15,
          lineColor: [0.5, 0.5, 0.5]
        })

        this.setState({bgType: type});
        break;

      case 'ruled':
        this.props.boardState.drawBoard.changeBackground({
          type: 'ruled',
          spacing: 15,
          orientation: 'horizontal',
          lineColor: [0.5, 0.5, 0.5]
        })

        this.setState({bgType: type});
        break;

      default:
        break;
    }
  }

  render() {
    const { boardState, _clearBoard, _export, _onUndo, _onRedo } = this.props;

    return (
      <div className="toolbar">
        <div className={`top-toolbar valign-wrapper`} title="Brush Size (SCROLL)"> {/* boardState.tool === 'rainbow_brush' ? 'left' : 'hide'}`}>*/}
          <label>Brush Size</label>
          <input type="range" min="2" max="100" value={this.state.brushSize} ref={this.brushSizeRangeRef} onChange={this.onBrushSizeChange} />
        </div>

        {/* <div className={`top-toolbar valign-wrapper ${boardState.tool === 'rainbow_brush' ? 'right' : 'hide'}`}>
          <label>Color Change Rate</label>
          <input type="range" min="1" max="50" value={this.state.changeRate} ref={this.changeRateRangeRef} onChange={this.onColorRateChange} />
        </div> */}

        <div className={`top-toolbar valign-wrapper ${boardState.tool === 'eraser' ? '' : 'hide'}`} title="Eraser Size (SCROLL)">
          <label>Eraser Size</label>
          <input type="range" min="2" max="100" value={this.state.eraserSize} ref={this.eraserSizeRangeRef} onChange={this.onEraserSizeChange} />
        </div>

        <div className={`top-toolbar valign-wrapper ${boardState.tool === 'line' ? '' : 'hide'}`} title="Line Thickness (SCROLL)">
          <label>Line Thickness</label>
          <input type="range" min="2" max="100" value={this.state.lineThickness} ref={this.lineThicknessRangeRef} onChange={this.onLineThicknessChange} />
        </div>

        <div className="bottom-toolbar">
          {/* Tools */}
          <button
            className={`btn-flat ${boardState.tool === 'brush' ? 'active' : ''} brand-text`}
            title={`Brush (${BRUSH_TOOL.platformFormattedString})`}
            onClick={() => this._setTool('brush')}
            style={{
              position: 'relative'
            }}
          >
            <div
              className="color-circle"
              style={{
                background: getRGBColorString(this.state.brushColor)
              }}
            />
            <Icon options={{icon: faPaintBrush}} />
          </button>
          {/* <button className={`btn-flat ${boardState.tool === 'rainbow_brush' ? 'active' : ''} brand-text`} title="Rainbow Brush" onClick={() => this._setTool('rainbow_brush')}>
            <Icon options={{icon:} />
          </button> */}
          <button
            className={`btn-flat ${boardState.tool === 'line' ? 'active' : ''} brand-text`}
            title={`Line Tool (${LINE_TOOL.platformFormattedString})`}
            onClick={() => this._setTool('line')}
            style={{
              position: 'relative'
            }}
          >
            <div
              className="color-circle"
              style={{
                background: getRGBColorString(this.state.lineColor),
              }}
            />
            <Icon options={{icon: faGripLines}} />
          </button>
          <button className={`btn-flat ${boardState.tool === 'eraser' ? 'active' : ''} brand-text`} title={`Eraser (${ERASER_TOOL.platformFormattedString})`} onClick={() => this._setTool('eraser')}>
            <Icon options={{icon: faEraser}} />
          </button>
          {/* /Tools */}

          <div className="vertical-separator-line" />

          {/* Board Manipulation */}
          <button className="btn-flat brand-text" title={`Color Palette (${COLOR_PALETTE.platformFormattedString})`} onClick={() => this.colorPickerInstance.open()}>
            <Icon options={{icon :faPalette}} />
          </button>
          <button className="btn-flat brand-text" title={`Undo (${UNDO.platformFormattedString})`} onClick={() => _onUndo()}>
            <Icon options={{icon: faUndo}} />
          </button>
          <button className="btn-flat brand-text" title={`Redo (${REDO.platformFormattedString})`} onClick={() => _onRedo()}>
            <Icon options={{icon: faRedo}} />
          </button>
          {/* /Board Manipulation */}

          <div className="vertical-separator-line" />

          {/* BG */}
          <Dropdown
            getTriggerBtn={
              (ref) =>
              <button ref={ref} className="btn-flat brand-text" title="Set Background...">
                <Icon options={{icon: this.state.bgType === 'grid' ? faBorderAll : this.state.bgType === 'ruled' ? faAlignJustify : faSquare}} />
              </button>
            }
            vertical={true}
            fixedPosn={true}
          >
            <button className={`btn-flat ${this.state.bgType === 'grid' ? 'active' : ''} brand-text`} title="Grid Background" onClick={() => this._setBG('grid')}>
              <Icon options={{icon: faBorderAll}} />
            </button>
            <button className={`btn-flat ${this.state.bgType === 'ruled' ? 'active' : ''} brand-text`} title="Ruled Background" onClick={() => this._setBG('ruled')}>
              <Icon options={{icon: faAlignJustify}} />
            </button>
            <button className={`btn-flat ${this.state.bgType === 'none' ? 'active' : ''} brand-text`} title="Blank Background" onClick={() => this._setBG('none')}>
              <Icon options={{icon: faSquare}} />
            </button>
          </Dropdown>
          {/* /BG */}

          {/* Others */}
          <button
            className="btn-flat brand-text"
            title={`Clear Page (${CLEAR_PAGE.platformFormattedString})`}
            onClick={_clearBoard}
          >
            <Icon options={{icon: faBan}} />
          </button>

          <Dropdown
            getTriggerBtn={(ref) => <button ref={ref} title="More Options..." className="btn-flat brand-text"><Icon options={{icon: faEllipsisV}} /></button>}
            vertical={true}
            fixedPosn={true}
          >
            <button className="btn-flat brand-text" title={`Save Whiteboard (${SAVE.platformFormattedString})`} onClick={() => this.props._save()}>
              <Icon options={{icon: faSave}} />
            </button>
            <button className="btn-flat brand-text" title={`Export Page (${EXPORT_PAGE.platformFormattedString})`} onClick={() => this.saveBoardModalInstance.open()}>
              <Icon options={{icon: faFileImage}} />
            </button>
            <button
              className="btn-flat brand-text"
              title="Go to Home"
              onClick={() => go('/')}
            >
              <Icon options={{icon: faHome}} />
            </button>
          </Dropdown>
          {/* /Others */}
        </div>

        <div className="modal" ref={this.saveBoardRef}>
          <div className="modal-content container-fluid">
            <h3>Export Page</h3>
            <p>Export the current page as an image.</p>
            <div className="container">
              <div className="row">
                <div className="col s12">
                  <div className={`save-type ${this.state.saveType === 'png' ? 'selected' : ''}`} onClick={() => this.setState({ saveType: 'png', saveModalOn: true })}>
                    <h6>PNG</h6>
                    Saves as a normal image. Works everywhere. Default and recommended for most users.
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col s12">
                  <div  className={`save-type ${this.state.saveType === 'svg' ? 'selected' : ''}`} onClick={() => {this.setState({ saveType: 'svg', saveModalOn: true })}}>
                    <h6>SVG</h6>
                    Saves the file as an <a href="https://en.wikipedia.org/wiki/SVG" rel="noreferrer" style={{display: 'inline'}} target="_blank">SVG</a>. Use it if you know what it is.
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer container">
            <button className="btn right" title="Cancel" onClick={e => this.saveBoardModalInstance.close()}>Cancel</button>
            <button
              className="btn brand-text left"
              title="Save"
              onClick={e => {
                _export(this.state.saveType);
                this.saveBoardModalInstance.close();
              }}
            >Save</button>
          </div>
        </div>

        <div className="modal" ref={this.colorPickerRef}>
          <div className="modal-content">
            <PaintSettings
              color={getRGBColorString(boardState.tool === 'line' ? this.state.lineColor : this.state.brushColor)}
              tool={boardState.tool}
              onPickColor={color => {
                if(boardState.tool === 'brush' || boardState.tool === 'line'){
                  const colorArr: Color = [color.rgb.r / 255, color.rgb.g / 255, color.rgb.b / 255];

                  boardState.drawBoard.changeToolSetting(`${boardState.tool}Color` as keyof ToolSettings, colorArr);
                  this.setState({
                    [`${boardState.tool}Color`]: colorArr
                  })
                }
                else return;
              }}
            />
          </div>
          <div className="modal-footer container">
            <button title="Done" className="btn brand-text" onClick={() => this.colorPickerInstance.close()}>Done</button>
          </div>
        </div>
      </div>
    )
  }
}
