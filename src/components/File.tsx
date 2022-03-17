import React, {useEffect, useState} from "react";
import { connect } from "react-redux";
import FileModel from "../models/File";
import { StoreDispatch, StoreState, mapDispatchToProps, mapStateToProps } from "../store";
import Icon from "./Icon";

import "../styles/components/file.sass"
import {getSizeByBytes} from "../funcs";

interface Props {
  store: StoreState,
  dispatcher: StoreDispatch,

  file: FileModel,
  onExpired(file: FileModel): void
}

const File = connect(mapStateToProps, mapDispatchToProps)(function (props: Props) {

  const [expirationProgress, setExpirationProgress] = useState(100)

  const getFileIconByType = (type: string): {
    icon: string,
    color?: string
  } => {

    if (type === 'text/plain') return { icon: 'file-22' }
    if (type.startsWith('image/')) return { icon: 'file-26', color: '#558B2F' }
    if (type.startsWith('audio/')) return { icon: 'file-30', color: '#D84315' }
    if (type.startsWith('video/')) return { icon: 'file-28', color: '#4527A0' }
    if (type.includes('pdf')) return { icon: 'file-34', color: '#C62828' }
    if (type.includes('word')) return { icon: 'file-24', color: '#283593' }
    if (type.includes('zip')) return { icon: 'zip-12', color: '#AD1457' }

    if (false
      || type.includes('html')
      || type.includes('css')
      || type.includes('javascript')
      || type.includes('json')
      || type.includes('php')
    ) return { icon: 'code-11', color: '#F9A825' }

    return {
      icon: 'file-5'
    }
  }

  // On mount
  useEffect(() => {

    const fileWatcher = () => {

      //  Delete file if expired
      if(props.file.expiresIn <= new Date())
        return props.onExpired(props.file)

      let ex = props.file.expiresIn.getTime()
      let cu = Date.now()
      let cr = props.file.createdAt.getTime()

      ex = ex - cr
      cu = cu - cr

      setExpirationProgress(100 - (cu / ex * 100))

    }

    //  Watch the file state every second
    const fileWatcherInterval = setInterval(fileWatcher, 1000)
    fileWatcher()

    return () => {

      clearInterval(fileWatcherInterval)
    }
  }, [props])

  // Render
  return (
    <div className="File" onClick={() => window.open(`${process.env.REACT_APP_API_URL}/download/${props.file._id}`)}>

      <div className="icon">
        <Icon icon={getFileIconByType(props.file.type).icon} style={{ fill: getFileIconByType(props.file.type).color }} />
      </div>

      <div className="info">

        <div className="name" title={props.file.name}>{props.file.name}</div>
        <div className="size">{getSizeByBytes(props.file.size)}</div>
      </div>

      <div className="expire-progress" style={{
        width: `${expirationProgress}%`
      }} />
    </div>
  )
})
export default File
