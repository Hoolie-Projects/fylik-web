import React, {ChangeEvent, createRef, useEffect, useState} from 'react'
import { connect } from 'react-redux';
import {Link, useRoute} from 'react-router5';
import {Transition} from "react-transition-group";
import Icon from './components/Icon';
import Loader from "./components/Loader";
import Popup from './components/Popup';
import {getSizeByBytes, httpClient, nError} from "./funcs";
import FileModel from "./models/File";
import AboutPageEn from "./pages/en/About";
import TermsPageEn from "./pages/en/Terms";
import FileList from "./pages/FileList";
import AboutPageRu from "./pages/ru/About";
import TermsPageRu from "./pages/ru/Terms";
import {Limits, mapDispatchToProps, mapStateToProps, StoreDispatch, StoreState} from './store';

import LogoImg from './logo.svg'

import classNames from 'classnames';

interface Props {
  store: StoreState,
  dispatcher: StoreDispatch
}

let notificationTimeout: any = null

const App = connect(mapStateToProps, mapDispatchToProps)(function App(props: Props) {

  const $router = useRoute()

  const [fileUploadPopup, setFileUploadPopup] = useState(false)

  const fileUploader = createRef<HTMLInputElement>()

  // Handle notifications
  useEffect(() => {

    clearTimeout(notificationTimeout)

    if (props.store.notification === null) {
      notificationTimeout = null
    }
    else {
      notificationTimeout = setTimeout(() => {
        props.dispatcher.setNotification(null)
      }, 5000)
    }

  }, [props.dispatcher, props.store.notification])

  // On mount
  useEffect(() => {

    //  Load limits
    (async () => {

      const {data: limits}: {data: Limits} = await httpClient.get('/limits')

      props.dispatcher.setLimits(limits)
    })()
  }, [props.dispatcher])

  // File upload function
  async function uploadFile(e: ChangeEvent<HTMLInputElement>) {

    if(!props.store.limits || !e.target.files) return

    const file = e.target.files[0]

    //  Validate file size
    if(file.size > props.store.limits?.maxFileSize)
      return props.dispatcher.setNotification({
        title: props.store.language === 'ru' ? (
          'Такой файл загрузить нельзя'
        ) : (
          'Can`t upload the file'
        ),
        contents: (
          props.store.language === 'ru' ? (
            'Выберите файл размером меньше'
          ) : (
            'Try to select a file with size less than'
          )
        ).concat(` ${getSizeByBytes(props.store.limits.maxFileSize)}`)
      })

    // Create formdata with file
    const formData = new FormData()
    formData.append('file', file, file.name)

    // Set uploading state
    props.dispatcher.setFileUploadingProgress({
      active: true,
      progress: 0
    })

    //  Hide the popup
    setFileUploadPopup(false)

    // Upload
    let uploadedFile: FileModel;

    try {
      uploadedFile = (await httpClient.post('/upload', formData, {
        onUploadProgress: ({loaded, total}) => {
          props.dispatcher.setFileUploadingProgress({
            active: true,
            progress: loaded / total * 100
          })
        }
      })).data

      // Add file info to store
      const fileIds = [...props.store.uploadedFilesInfo.fileIds, uploadedFile._id]
      props.dispatcher.setUploadedFilesInfo({fileIds})
    }
    catch(error: any) {
      nError(error)

      if(error.response?.status === 429)
        return props.dispatcher.setNotification({
          title: props.store.language === 'ru' ? (
            'Вы выгрузили слишком много файлов'
          ) : (
            'Too many files uploaded'
          ),
          contents: props.store.language === 'ru' ? (
            'Попробуйте позже'
          ) : (
            'Try again later'
          )
        })
      else {
        return props.dispatcher.setNotification({
          title: props.store.language === 'ru' ? (
            'Возникла ошибка при загрузке файла'
          ) : (
            'An Error occured during file uploading'
          ),
          contents: props.store.language === 'ru' ? (
            'Попробуйте позже'
          ) : (
            'Try again later'
          )
        })
      }
    }
    finally {

      // Set uploading state
      props.dispatcher.setFileUploadingProgress({
        active: false,
        progress: 0
      })
    }
  }

  // Render
  return (
    <>

      <header>

        <img className="Logo" src={LogoImg} alt="Fylik Logo" />

        <div className="headers">
          <h1>Fylik</h1>
          <span>&mdash;</span>
          <h2>
            {
              props.store.language === 'en' ? (
                'Shared File Sharing'
              ) : (
                'Быстрый файлообменник'
              )
            }
          </h2>
        </div>

        <div className="buttons">

          {/* Upload button */}
          {props.store.limits && !props.store.fileUploadingProgress.active ? (
            <button disabled={props.store.uploadedFilesInfo.fileIds.length >= props.store.limits.maxFilesPerClient} className="UploadButton _wa" onClick={() => setFileUploadPopup(true)}>
              <Icon icon="upload-18" />
              <span>
                {
                  props.store.language === 'en' ? (
                    'Upload a File'
                  ) : (
                    'Загрузить файл'
                  )
                }
              </span>
            </button>
          ) : null}

          {/* Uploading progress button */}
          {props.store.fileUploadingProgress.active ? (
            <button className="_wa _secondary _fake">
              <Loader size={24} weight={2} color='#aaa' speed={2} />
              <span>
                {
                  props.store.language === 'en' ? (
                    'Uploading...'
                  ) : (
                    'Загрузка...'
                  )
                }
                {' '}
                {
                  `${Math.floor(props.store.fileUploadingProgress.progress)}%`
                }
              </span>
            </button>
          ) : null}

          {/* Language switch button */}
          {
            props.store.language === 'en' ? (
              <button className="_wa _secondary" onClick={() => props.dispatcher.setLanguage('ru')}>EN</button>
            ) : (
              <button className="_wa _secondary" onClick={() => props.dispatcher.setLanguage('en')}>RU</button>
            )
          }
        </div>

        {props.store.fileUploadingProgress.active ? (
          <div className="fileUploadingProgress" style={{width: `${props.store.fileUploadingProgress.progress}%`}} />
        ) : null}
      </header>

      <div className="page-wrapper">

        {/* Main Page */}
        {$router.route.name === 'main' ? (
          <FileList />
        ) : null}

        {/* About Page */}
        {$router.route.name === 'about' ? (

          props.store.language === 'en' ? (
            <AboutPageEn />
          ) : (<AboutPageRu />)
        ) : null}

        {/* Terms Page */}
        {$router.route.name === 'terms' ? (

          props.store.language === 'en' ? (
            <TermsPageEn />
          ) : (<TermsPageRu />)
        ) : null}
      </div>

      <footer>

        <div className="links">
          <Link routeName="main">
            {
              props.store.language === 'en' ? (
                'Uploaded Files'
              ) : (
                'Файлы'
              )
            }
          </Link>
          <Link routeName="about">
            {
              props.store.language === 'en' ? (
                'About Fylik'
              ) : (
                'О проекте'
              )
            }
          </Link>
          <Link routeName="terms">
            {
              props.store.language === 'en' ? (
                'Terms'
              ) : (
                'Правила'
              )
            }
          </Link>
          <a href="https://github.com/hoolie-projects/fylik-web" target="_blank" rel="noreferrer">
            {
              props.store.language === 'en' ? (
                'Source Code'
              ) : (
                'Исходный код'
              )
            }
          </a>
        </div>

        <div className="copyright">
          Hoolie Projects &copy; {(new Date()).getFullYear()}
        </div>
      </footer>

      <div className="file-uploading-popup">
        <Popup
          title={
            props.store.language === 'en' ? (
              'File uploading'
            ) : (
              'Загрузить файл'
            )
          }
          onClose={() => setFileUploadPopup(false)}
          isActive={fileUploadPopup}
        >
          <div className="drop-zone" onClick={() => fileUploader?.current?.click()}>

            <input type="file" ref={fileUploader} onChange={uploadFile} />

            <Icon icon="upload-18" />

            <div className="hint">
              {
                props.store.language === 'en' ? (
                  'Drag & Drop a file here'
                ) : (
                  'Перетащите файл сюда'
                )
              }
            </div>

            <div className="or">
              {
                props.store.language === 'en' ? (
                  'or'
                ) : (
                  'или'
                )
              }
            </div>

            <button className="_wa">
              <Icon icon="paperclip-2" />
              <span>
                {
                  props.store.language === 'en' ? (
                    'Select a file'
                  ) : (
                    'Выберите файл'
                  )
                }
              </span>
            </button>
          </div>
        </Popup>
      </div>

      <Transition in={props.store.notification !== null} timeout={0.3}>
        {(state) => (
          <div className={classNames('Notification', `pop-${state}`)}>
            <div className="title">{props.store.notification?.title}</div>
            <div className="contents">{props.store.notification?.contents}</div>
          </div>
        )}
      </Transition>
    </>
  );
})

export default App;
