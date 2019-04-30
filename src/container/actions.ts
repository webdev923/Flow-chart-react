import { v4 } from 'uuid'
import {
  IChart, IOnCanvasClick, IOnCanvasDrop, IOnDeleteKey, IOnDragCanvas, IOnDragNode, IOnLinkCancel,
  IOnLinkComplete, IOnLinkMouseEnter, IOnLinkMouseLeave, IOnLinkMove, IOnLinkStart, IOnNodeClick,
  IOnNodeSizeChange, IOnPortPositionChange,
} from '../'

/**
 * This file contains actions for updating state after each of the required callbacks
 */

export const onDragNode: IOnDragNode = (event, data, id) => (chart: IChart) => {
  const nodechart = chart.nodes[id]

  if (nodechart) {
    chart.nodes[id] = {
      ...nodechart,
      position: {
        x: data.x,
        y: data.y,
      },
    }
  }

  return chart
}

export const onDragCanvas: IOnDragCanvas = (event, data) => (chart: IChart): IChart => {
  chart.offset.x = data.x
  chart.offset.y = data.y
  return chart
}

export const onLinkStart: IOnLinkStart = ({ linkId, fromNodeId, fromPortId }) => (chart: IChart): IChart => {
  chart.links[linkId] = {
    id: linkId,
    from: {
      nodeId: fromNodeId,
      portId: fromPortId,
    },
    to: {},
  }
  return chart
}

export const onLinkMove: IOnLinkMove = ({ linkId, toPosition }) => (chart: IChart): IChart => {
  const link = chart.links[linkId]
  link.to.position = toPosition
  chart.links[linkId] = { ...link }
  return chart
}

export const onLinkComplete: IOnLinkComplete = ({ linkId, fromNodeId, fromPortId, toNodeId, toPortId }) =>
  (chart: IChart): IChart => {
    if ([fromNodeId, fromPortId].join() !== [toNodeId, toPortId].join()) {
      chart.links[linkId].to = {
        nodeId: toNodeId,
        portId: toPortId,
      }
    }
    return chart
  }

export const onLinkCancel: IOnLinkCancel = ({ linkId }) => (chart: IChart) => {
  delete chart.links[linkId]
  return chart
}

export const onLinkMouseEnter: IOnLinkMouseEnter = ({ linkId }) => (chart: IChart) => {
  // Set the link to hover
  const link = chart.links[linkId]
  // Set the connected ports to hover
  if (link.to.nodeId && link.to.portId) {
    if (chart.hovered.type !== 'link' || chart.hovered.id !== linkId) {
      chart.hovered = {
        type: 'link',
        id: linkId,
      }
    }
  }
  return chart
}

export const onLinkMouseLeave: IOnLinkMouseLeave = ({ linkId }) => (chart: IChart) => {
  const link = chart.links[linkId]
  // Set the connected ports to hover
  if (link.to.nodeId && link.to.portId) {
    chart.hovered = {}
  }
  return chart
}

export const onLinkClick: IOnLinkMouseLeave = ({ linkId }) => (chart: IChart) => {
  if (chart.selected.id !== linkId || chart.selected.type !== 'link') {
    chart.selected = {
      type: 'link',
      id: linkId,
    }
  }
  return chart
}

export const onCanvasClick: IOnCanvasClick = () => (chart: IChart) => {
  if (chart.selected.id) {
    chart.selected = {}
  }
  return chart
}

export const onDeleteKey: IOnDeleteKey = () => (chart: IChart) => {
  if (chart.selected.type === 'node' && chart.selected.id) {
    const node = chart.nodes[chart.selected.id]
    // Delete the connected links
    Object.keys(chart.links).forEach((linkId) => {
      const link = chart.links[linkId]
      if (link.from.nodeId === node.id || link.to.nodeId === node.id) {
        delete chart.links[link.id]
      }
    })
    // Delete the node
    delete chart.nodes[chart.selected.id]
  } else if (chart.selected.type === 'link' && chart.selected.id) {
    delete chart.links[chart.selected.id]
  }
  if (chart.selected) {
    chart.selected = {}
  }
  return chart
}

export const onNodeClick: IOnNodeClick = ({ nodeId }) => (chart: IChart) => {
  if (chart.selected.id !== nodeId || chart.selected.type !== 'node') {
    chart.selected = {
      type: 'node',
      id: nodeId,
    }
  }
  return chart
}

export const onNodeSizeChange: IOnNodeSizeChange = ({ nodeId, size }) => (chart: IChart) => {
  chart.nodes[nodeId] = {
    ...chart.nodes[nodeId],
    size,
  }
}

export const onPortPositionChange: IOnPortPositionChange = (nodeToUpdate, port, position) =>
  (chart: IChart): IChart => {
    const node = chart.nodes[nodeToUpdate.id]
    node.ports[port.id].position = {
      x: position.x,
      y: position.y,
    }

    chart.nodes[nodeToUpdate.id] = { ...node }

    return chart
  }

export const onCanvasDrop: IOnCanvasDrop = ({ data, position }) => (chart: IChart): IChart => {
  const id = v4()
  chart.nodes[id] = {
    id,
    position,
    type: data.type,
    ports: data.ports,
    properties: data.properties,
  }
  return chart
}
