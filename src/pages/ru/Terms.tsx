import React from "react";
import { connect } from "react-redux";
import { StoreDispatch, StoreState, mapDispatchToProps, mapStateToProps } from "../../store";

interface Props {
  store: StoreState,
  dispatcher: StoreDispatch
}

const TermsPageRu = connect(mapStateToProps, mapDispatchToProps)(function (props: Props) {

  return (
    <div className="TermsPage">
      <h1>Правила</h1>

      <p>
        Fylik - маленький тестовый проект, созданный для демонстрации навыков его создателя.
        Проект создан и работает как есть и не гарантирует доступность и функциональность, которые в любой момент
        могут поменяться.
      </p>

      <p>
        Все загруженные файлы автоматически удаляются спустя какое-то время после загрузки. Время выбирается рандомно
        и мы не можем на это повлиять. При загрузке файла на сервер, временно сохраняется ваш IP-адрес. Он используется,
        чтобы мы могли ограничить количество загружаемых файлов на сервер.
      </p>

      <p>
        Все загружаемые файлы не проходят никаких проверок и могут навредить вам или вашему устройству. Скачивайте
        их с осторожностью!
      </p>
    </div>
  )
})
export default TermsPageRu
