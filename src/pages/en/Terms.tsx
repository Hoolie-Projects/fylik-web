import React from "react";
import { connect } from "react-redux";
import { StoreDispatch, StoreState, mapDispatchToProps, mapStateToProps } from "../../store";

interface Props {
  store: StoreState,
  dispatcher: StoreDispatch
}

const TermsPageEn = connect(mapStateToProps, mapDispatchToProps)(function (props: Props) {

  return (
    <div className="TermsPage">
      <h1>Terms</h1>

      <p>
        This is an open source project and it`s launched as is. Fylik was built as a small test web project
        and doesn`t give you any warranties for service availability and functionality.
      </p>

      <p>
        All uploaded files get deleted after some time since uploading. It`s a random time and is not managed by Fylik
        creators or administrators.
      </p>

      <p>
        All uploaded files don`t pass any checks and may be vulnerable for you or your device.
        Download them with care!
      </p>
    </div>
  )
})
export default TermsPageEn
