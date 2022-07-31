import { useEffect, useState } from 'react';
import { CurrentUserContext } from '../context/CurrentUserContext';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import AddPlacePopup from './AddPlacePopup';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import PopupWithForm from './PopupWithForm';
import ImagePopup from './ImagePopup';
import api from '../utils/api';

function App() {

  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isImagePopupOpen, setIsImagePopupOpen] = useState(false);
  const [selectedCard, setIsSelectedCard] = useState({});
  const [currentUser, setCurrentUser] = useState(null);
  const [cards, setCards] = useState([]);

  useEffect(() => {
    api.getUserData()
      .then(currentUser => setCurrentUser(currentUser))
      .catch(err => console.log(`Error: ${err}`))
    api.getInitialCards()
      .then(cards => setCards(cards))
      .catch(err => console.log(`Error: ${err}`))
  }, [])

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  function handleCardClick(card) {
    setIsSelectedCard(card);
    setIsImagePopupOpen(true);
  }

  function closeAllPopups() {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsImagePopupOpen(false);
  }

  function handleUpdateUser(data) {
    api.setUserData(data)
      .then(res => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch(err => console.log(`Error: ${err}`));
  }

  function handleUpdateAvatar(item) {
    api.editProfileAvatar(item)
      .then(res => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch(err => console.log(`Error: ${err}`));
  }

  function handleCardLike(card) {

    function setLikeCardStatus(newCard) {
      setCards((state) => state.map(c => c._id === card._id ? newCard : c));
    }
    /** Снова проверяем, есть ли уже лайк на этой карточке */
    const isLiked = card.likes.some(i => i._id === currentUser._id)
    if (!isLiked) {
      /** Отправляем запрос в API и получаем обновлённые данные карточки */
      api.likeCard(card._id)
        .then(newCard => setLikeCardStatus(newCard))
        .catch(err => console.log(`Error: ${err}`))
    } else {
      api.unlikeCard(card._id)
        .then(newCard => setLikeCardStatus(newCard))
        .catch(err => console.log(`Error: ${err}`))
    }
  }
  
  function handleCardDelete(card) {
    
    function setCardDeleteSatus() {
      setCards(cards => cards.filter(item => item._id !== card._id))
    }

    api.deleteCard(card._id)
      .then(() => setCardDeleteSatus())
      .catch(err => console.log(`Error: ${err}`))
  }

  function handleAddPlaceSubmit(item) {
    api.addNewCard(item)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch(err => console.log(`Error: ${err}`))
  }

  return ((
    <div id="page" className="page">
      <div id="page__content" className="page__content">
        <CurrentUserContext.Provider value={currentUser}>
          <Header />
          <Main
            onEditProfile={handleEditProfileClick}
            onAddPlace={handleAddPlaceClick}
            onEditAvatar={handleEditAvatarClick}
            cards={cards}
            onCardClick={handleCardClick}
            onCardLike={handleCardLike}
            onCardDelete={handleCardDelete}
          />
          <Footer />
          <EditProfilePopup
            isOpen={isEditProfilePopupOpen}
            onClose={closeAllPopups}
            onUpdateUser={handleUpdateUser}
          />
          <EditAvatarPopup
            isOpen={isEditAvatarPopupOpen}
            onClose={closeAllPopups}
            onUpdateAvatar={handleUpdateAvatar}
          />
          <AddPlacePopup
            isOpen={isAddPlacePopupOpen}
            onClose={closeAllPopups}
            onAddPlace={handleAddPlaceSubmit}
          />
          <PopupWithForm name="submit-deleting"
            title="Вы уверены?"
            btnValue="Да"
            nameForm="submit-deleting"
            onClose={closeAllPopups} >
          </PopupWithForm>
          <ImagePopup
            name='image-view'
            card={selectedCard}
            isOpen={isImagePopupOpen}
            onClose={closeAllPopups}
          />
        </CurrentUserContext.Provider>
      </div>
    </div>
  ));
}

export default App;