import React from "react";
import { connect } from "react-redux";
import { StoreDispatch, StoreState, mapDispatchToProps, mapStateToProps } from "../../store";

import LogoImg from '../../logo.svg'

interface Props {
  store: StoreState,
  dispatcher: StoreDispatch
}

const AboutPageEn = connect(mapStateToProps, mapDispatchToProps)(function (props: Props) {

  return (
    <div className="AboutPage">
      <h1>About Fylik Project</h1>

      <img src={LogoImg} alt="Fylik Logo" style={{
        width: '100px',
        margin: '50px 0'
      }} />

      <p>
        <b>Fylik</b> is a small web appliation that lets everyone to upload any files and share them with others.
      </p>

      <p>
        All uploaded files automatically get deleted after some time since uploading. Until a file deleted you can
        download it by it`s direct link.
      </p>

      <p>
        You can expore our <a href="https://api.fylik.ru" target="_blank" rel="noreferrer">REST API</a> to get your projects integrated with Fylik.
        Also you can download <a href="https://github.com/hoolie-projects/fylik-web" target="_blank" rel="noreferrer">Fylik PWA</a> and <a href="https://github.com/hoolie-projects/fylik-api" target="_blank" rel="noreferrer">BackEnd</a> source code
      </p>
    </div>
  )
})
export default AboutPageEn
