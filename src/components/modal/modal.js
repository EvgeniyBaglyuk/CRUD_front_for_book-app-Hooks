import React, {useState} from 'react';
import './modal.scss';
import _ from 'lodash';
import {useDispatch, useSelector} from "react-redux";
import {AddBook, DeleteBook, EditBook, GetAllBooks} from "../../actions/books-actions";
import ModalForm from "../modal-form/modal-form";
import ModalActionAnswer from "../modal-action-answer/modal-action-answer";

const Modal = ({openModal, currentItem, openModalFunc}) => {
  const [showPopup, setShowPopup] = useState(false);
  const lastAddedBook = useSelector(state => state.lastAddedBook);
  const lastDeletedBook = useSelector(state => state.lastDeletedBook);
  const lastEditBook = useSelector(state => state.lastEditBook);
  const dispatch = useDispatch();
  console.log('lastDeletedBook - ', lastDeletedBook)
  const showData = (openModal, openModalFunc) => {
    const modalSubmit = (e) => {
      e.preventDefault()
    }
    const submitForm = (e, modalName, idBook = null) => {
      openModalFunc(modalName);
      if (modalName === 'add') {
        dispatch(AddBook(
          {
            titleOfNewBook: e.target.form[0].value,
            authorOfNewBook: e.target.form[1].value
          }
        )).then(()=> {
          setShowPopup(prevState => !prevState);
          setTimeout(() => {
            return setShowPopup(prevState => !prevState)
          }, 2000);

          dispatch(GetAllBooks());
        });
      }
      if (modalName === 'delete') {
        dispatch(DeleteBook({idBook})).then(()=> {
          setShowPopup(prevState => !prevState);
          setTimeout(() => {
            return setShowPopup(prevState => !prevState)
          }, 2000);
          dispatch(GetAllBooks());
        });
      }
      if (modalName === 'edit') {
        dispatch(EditBook({
          idBook: idBook,
          titleOfNewBook: e.target.form[0].value,
          authorOfNewBook: e.target.form[1].value
        })).then(()=> {
          setShowPopup(prevState => !prevState);
          setTimeout(() => {
            return setShowPopup(prevState => !prevState)
          }, 2000);
          return dispatch(GetAllBooks())
        });
      }
    }

    if (openModal.add) {
        return (
          <ModalForm
            modalName='add'
            modalSubmitFunc={modalSubmit}
            modalCloseFunc={() => openModalFunc('add')}
            modalSubmitFormFunc={(e) => submitForm(e,'add')}
          />
        )
    }
    if (openModal.edit) {
        return (
          <ModalForm
            modalName='edit'
            modalSubmitFunc={modalSubmit}
            modalCloseFunc={() => openModalFunc('edit')}
            modalSubmitFormFunc={(e) => submitForm(e,'edit', currentItem.idBook)}
            currentItem={currentItem}
          />
        )
    }
    if (openModal.delete) {
      return (
        <ModalForm
          modalName='delete'
          modalSubmitFunc={modalSubmit}
          modalCloseFunc={() => openModalFunc('delete')}
          modalSubmitFormFunc={(e) => submitForm(e, 'delete', currentItem.idBook)}
          currentItem={currentItem}
        />
      )
    }
  }
  const showModal = _.values(openModal).some(el => el === true)

  return (
    <>
      {showModal && (
        <div className='modal-container'>
          <div className='modal-window'>
            {showData(openModal, openModalFunc)}
          </div>
        </div>
      )}
      <ModalActionAnswer
        lastAddedBook={lastAddedBook}
        lastDeletedBook={lastDeletedBook}
        lastEditBook={lastEditBook}
        showPopup={showPopup}
      />
    </>
  );
};

export default Modal;