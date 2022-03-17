import classNames from "classnames";
import React, { CSSProperties } from 'react'

import "../styles/components/icon.sass"

import iconsSvg from '../im-icons.svg'

interface Props {
  icon: string,
  className?: string,
  style?: CSSProperties
}

function Icon(props: Props) {
  return (
    <svg viewBox="0 0 24 24" style={props.style} className={classNames(['Icon', props.className])}>
      <use xlinkHref={iconsSvg + `#${props.icon}`} />
    </svg>
  );
}

export default Icon;
