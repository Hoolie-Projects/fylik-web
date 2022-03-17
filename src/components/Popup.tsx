import classNames from 'classnames';
import React from 'react'

import { CSSTransition } from 'react-transition-group'

import "../styles/components/popup.sass"
import Icon from './Icon'

interface Props {
  children: any,

  title: string,
  isActive: boolean,

  onClose?(): void
}

function Popup(props: Props) {
  return (
    <CSSTransition in={props.isActive} timeout={320}>
      {(state) => (
        <div className={classNames('Popup', `fade-${state}`)} onClick={({ target, currentTarget }) => target === currentTarget && props.onClose ? props.onClose() : null}>

          <div className={classNames(`__wrapper`, `__state-${state}`)}>

            <div className="__header">

              <div className="__title">{props.title}</div>

              {props.onClose ? (
                <div className="__close-button">
                  <button className="_zeroed" onClick={() => props.onClose ? props.onClose() : null}>
                    <Icon icon="mark-7" />
                  </button>
                </div>
              ) : null}
            </div>

            <div className="__contents">
              {props.children}
            </div>
          </div>
        </div>
      )}
    </CSSTransition>
  );
}

export default Popup;
