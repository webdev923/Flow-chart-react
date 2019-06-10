import * as React from 'react'
import Draggable from 'react-draggable'
import { IOnCanvasClick, IOnCanvasDrop, IOnDeleteKey, IOnDragCanvas, REACT_FLOW_CHART } from '../../'
import CanvasContext from './CanvasContext'
import { ICanvasInnerDefaultProps } from './CanvasInner.default'
import { ICanvasOuterDefaultProps } from './CanvasOuter.default'

export interface ICanvasWrapperProps {
  position: {
    x: number
    y: number,
  }
  onDragCanvas: IOnDragCanvas
  onDeleteKey: IOnDeleteKey
  onCanvasClick: IOnCanvasClick
  onCanvasDrop: IOnCanvasDrop
  ComponentInner: React.FunctionComponent<ICanvasInnerDefaultProps>
  ComponentOuter: React.FunctionComponent<ICanvasOuterDefaultProps>
  onSizeChange: (x: number, y: number) => void
  children: any
}

interface IState {
  width: number
  height: number
  offsetX: number
  offsetY: number
}

export class CanvasWrapper extends React.Component<ICanvasWrapperProps, IState> {
  public state = {
    width: 0,
    height: 0,
    offsetX: 0,
    offsetY: 0,
  }

  private ref = React.createRef<HTMLElement>()

  public componentDidMount () {
    this.updateSize()

    if (this.ref.current) {
      if ((window as any).ResizeObserver) {
        const ro = new (window as any).ResizeObserver(this.updateSize)
        ro.observe(this.ref.current)
      } else {
        window.addEventListener('resize', this.updateSize)
      }
      window.addEventListener('scroll', this.updateSize)
    }
  }

  public componentDidUpdate () {
    this.updateSize()
  }

  public componentWillUnmount () {
    window.removeEventListener('resize', this.updateSize)
    window.removeEventListener('scroll', this.updateSize)
  }

  public render () {
    const {
      ComponentInner,
      ComponentOuter,
      position,
      onDragCanvas,
      children,
      onCanvasClick,
      onDeleteKey,
      onCanvasDrop,
    } = this.props

    return (
      <CanvasContext.Provider value={{ offsetX: this.state.offsetX, offsetY: this.state.offsetY }}>
        <ComponentOuter ref={this.ref}>
          <Draggable
            axis="both"
            position={position}
            grid={[1, 1]}
            onDrag={(e, dragData) => onDragCanvas(e, dragData)}
          >
            <ComponentInner
              children={children}
              onClick={onCanvasClick}
              tabIndex={0}
              onKeyDown={ (e: React.KeyboardEvent) => {
                // delete or backspace keys
                if (e.keyCode === 46 || e.keyCode === 8) {
                  onDeleteKey()
                }
              }}
              onDrop={ (e) => {
                const data = JSON.parse(e.dataTransfer.getData(REACT_FLOW_CHART))
                onCanvasDrop({ data, position: {
                  // subtract offset to adjust for non zero origin of canvas
                  x: e.clientX - position.x - this.state.offsetX,
                  y: e.clientY - position.y - this.state.offsetY,
                }})
              } }
              onDragOver={(e) => e.preventDefault()}
            />
          </Draggable>
        </ComponentOuter>
      </CanvasContext.Provider>
    )
  }

  private updateSize = () => {
    const el = this.ref.current

    if (el) {
      const rect = el.getBoundingClientRect()

      if (el.offsetWidth !== this.state.width || el.offsetHeight !== this.state.height) {
        this.setState({ width: el.offsetWidth, height: el.offsetHeight })
        this.props.onSizeChange(el.offsetWidth, el.offsetHeight)
      }

      if (rect.left !== this.state.offsetX || rect.top !== this.state.offsetY) {
        this.setState({ offsetX: rect.left, offsetY: rect.top })
      }
    }
  }
}
