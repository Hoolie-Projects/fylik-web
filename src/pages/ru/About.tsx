import React from "react";
import { connect } from "react-redux";
import { StoreDispatch, StoreState, mapDispatchToProps, mapStateToProps } from "../../store";

import LogoImg from '../../logo.svg'

interface Props {
  store: StoreState,
  dispatcher: StoreDispatch
}

const AboutPageRu = connect(mapStateToProps, mapDispatchToProps)(function (props: Props) {

  return (
    <div className="AboutPage">
      <h1>О проекте &laquo;Fylik&raquo;</h1>

      <img src={LogoImg} alt="Fylik Logo" style={{
        width: '100px',
        margin: '50px 0'
      }} />

      <p>
        <b>Fylik (Файлик)</b> - небольшое веб-приложение, которое позволяет любому желающему загрузить любой файл
        и получить прямую ссылку на его скачивание. Все загруженные файлы автоматически удаляются спустя некоторое
        время после загрузки на сайт. Все загруженные файлы видны на главной странице, пока не будут удалены.
      </p>

      <p>
        У проекта Fylik открытый <a href="https://github.com/hoolie-projects/fylik-web" target="_blank" rel="noreferrer">исходный код</a> и <a href="https://api.fylik.ru" rel="noreferrer">открытое REST API</a>, благодаря чему вы можете делать свои проекты на
        основе платформы Fylik, либо интегрироваться с ней.
      </p>

      <p>
        Проект Fylik написан на React (клиентская часть) и Node.JS (серверная часть). В качестве БД выбрана MongoDB,
        хотя такой проект можно реализовать и на Redis.
      </p>

      <p>
        Проект Fylik не собирает никакую информацию об отправителе файлов, кроме его IP-адреса (используется для
        ограничения количества загружаемых файлов). Когда все файлы пользователя удалены, вся информация о нём безвозвратно
        стирается.
      </p>
    </div>
  )
})
export default AboutPageRu
