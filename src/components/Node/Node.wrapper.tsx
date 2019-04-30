import * as React from 'react'
import Draggable from 'react-draggable'
import { INode, IOnDragNode, IOnNodeClick } from '../../'
import { INodeDefaultProps, NodeDefault } from './Node.default'

export interface INodeWrapperProps {
  node: INode
  onDragNode: IOnDragNode
  onNodeClick: IOnNodeClick
  children: any
  isSelected: boolean
  Component?: React.SFC<INodeDefaultProps>
}

export const NodeWrapper = ({
  node,
  onDragNode,
  children,
  onNodeClick,
  isSelected,
  Component = NodeDefault,
}: INodeWrapperProps) => {
  return (
    <Draggable
      bounds="parent"
      axis="both"
      position={node.position}
      grid={[1,1]}
      onStart={ (e) => {
        // Stop propagation so the canvas does not move
        e.stopPropagation()
      }}
      onDrag={(e, dragData) => onDragNode(e, dragData, node.id)}
    >
      <Component
        children={children}
        onClick={(e) => {
          onNodeClick({ nodeId: node.id })
          e.stopPropagation()
        }}
        isSelected={isSelected}
        node={node}
      />
    </Draggable>
  )
}
