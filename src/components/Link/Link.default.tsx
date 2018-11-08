import * as React from 'react'
import { IPosition, IOnLinkMouseEnter, IOnLinkMouseLeave, IOnLinkClick, ILink } from 'types'

export interface ILinkDefaultProps {
  link: ILink
  startPos: IPosition
  endPos: IPosition
  onLinkMouseEnter: IOnLinkMouseEnter
  onLinkMouseLeave: IOnLinkMouseLeave
  onLinkClick: IOnLinkClick
}

export const LinkDefault = ({
  link,
  startPos,
  endPos,
  onLinkMouseEnter,
  onLinkMouseLeave,
  onLinkClick,
}: ILinkDefaultProps) => {
  const points = `${startPos.x},${startPos.y} ${endPos.x},${endPos.y}`

  return (
    <svg style={{ overflow: 'visible', position: 'absolute', cursor: 'pointer' }}>
      <circle
        r="4"
        cx={ startPos.x }
        cy={ startPos.y }
        fill="cornflowerblue"
      />
      {/* Main line */}
      <polyline
        points={ points }  
        stroke="cornflowerblue" 
        strokeWidth="3"
        fill="none"
      />
      {/* Thick line to make selection easier */}
      <polyline
        points={ points }  
        stroke="cornflowerblue" 
        strokeWidth="20"
        fill="none"
        strokeLinecap="round"
        strokeOpacity={ (link.hover || link.selected) ? 0.1 : 0 }
        onMouseEnter={() => onLinkMouseEnter({ linkId: link.id }) }
        onMouseLeave={() => onLinkMouseLeave({ linkId: link.id }) }
        onClick={(e) => {
          onLinkClick({ linkId: link.id })
          e.stopPropagation()
        } }
      />
      <circle
        r="4"
        cx={ endPos.x }
        cy={ endPos.y }
        fill="cornflowerblue"
      />
    </svg>
  )
}