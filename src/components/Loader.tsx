import React from 'react'

import "../styles/components/loader.sass"

interface Props {
  color: string,
  size: number,
  weight: number,
  speed: number
}

function Loader(props: Props) {
  return (
    <div className="Loader" style={{
      borderColor: props.color,
      width: `${props.size}px`,
      height: `${props.size}px`,
      borderWidth: `${props.weight}px`,
      animationDuration: `${1/props.speed}s`
    }} />
  );
}

export default Loader;
