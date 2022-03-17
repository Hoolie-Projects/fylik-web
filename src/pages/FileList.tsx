import React, {useEffect, useRef, useState} from "react";
import { connect } from "react-redux";
import File from "../components/File";
import {httpClient, nError, socket} from "../funcs";
import FileModel from "../models/File";
import { StoreDispatch, StoreState, mapDispatchToProps, mapStateToProps } from "../store";

interface Props {
  store: StoreState,
  dispatcher: StoreDispatch
}

const FileList = connect(mapStateToProps, mapDispatchToProps)(function (props: Props) {

  const [files, setFiles] = useState<FileModel[]>([])
  const filesRef = useRef(files)
  filesRef.current = files

  // On page mount
  useEffect(() => {

    // Load file list from API
    (async() => {
      let {data: files}: {data: FileModel[]} = await httpClient.get('/files')

      files = files.map((file) => ({...file,
        expiresIn: new Date(file.expiresIn),
        createdAt: new Date(file.createdAt)
      }))

      setFiles(files)

      //  Delete old file ids from store
      const fileIds = props.store.uploadedFilesInfo.fileIds
        .filter(fileId => files.map(_file => _file._id).includes(fileId))

      props.dispatcher.setUploadedFilesInfo({fileIds})
    })().catch((error) => nError(error))

    // Listen to new files
    socket.on('newFile', (file: FileModel) => {

      setFiles([...filesRef.current, {
        ...file,
        expiresIn: new Date(file.expiresIn),
        createdAt: new Date(file.createdAt)
      }])
    })

    // On unmount
    return () => {

      // Unsubscribe from newFiles
      socket.removeAllListeners('newFile')
    }
  }, [])

  // On file expired
  function onFileExpired(file: FileModel) {

    const _files = files
      .filter(_file => _file._id !== file._id)

    const fileIds = props.store.uploadedFilesInfo.fileIds
      .filter(fileId => fileId !== file._id)

    setFiles(_files)
    props.dispatcher.setUploadedFilesInfo({fileIds})
  }

  // Render
  return (
    <div className="FileList">
      <div className="files-grid">
        {files.map((file, i) => (
          <File key={file._id} file={file} onExpired={onFileExpired} />
        ))}
      </div>
    </div>
  )
})
export default FileList
