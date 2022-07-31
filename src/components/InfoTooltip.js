import { useEffect, useCallback } from 'react';
import imgSucces from './../images/image-success.png';

function InfoTooltip({ name, isOpen, onClose, mainImgDiscription }) {

  // /** Закрываем попапы по нажатию Escape */
  const closeByEscape = useCallback((e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  }, [onClose])


  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', closeByEscape);

      return () => {
        document.removeEventListener('keydown', closeByEscape);
      }
    }
  }, [isOpen, closeByEscape]);

  /** Закрываем попапы по нажатию вне попапа */
  const closeByClick = (e) => {
    e.target.classList.contains('popup') && onClose();
  }

  return ((
    <div
      // className={`popup popup_infotooltip ${isOpen && 'popup_opened'}`}
      className={`popup popup_${name} ${isOpen && 'popup_opened'}`}
      onClick={closeByClick}
    >
      <div className="popup__container popup__container_infotooltip">
        <button
          onClick={onClose}
          type="button"
          className="popup__closer">
        </button>
        <img
          className="popup__main-img"
          src={imgSucces}
          alt={mainImgDiscription}
        />
        {/* <h2 className="popup__header">{title}</h2> */}
        <h2 className="popup__header">TITLE</h2>
      </div>
    </div>
  ));
}

export default InfoTooltip;