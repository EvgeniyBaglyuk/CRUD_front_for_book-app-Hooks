import React, {useEffect, useState} from "react";
import Header from "./components/header";
import {useDispatch, useSelector} from "react-redux";
import {GetAllBooks} from "./actions/books-actions";
import _ from 'lodash';
import ListItem from "./components/item-list";
import {projectImages} from "./assets/image";
import Modal from "./components/modal";
import './App.scss';

function App() {
  const dispatch = useDispatch();
  const booksState = useSelector(state => state.allBooks);
  const [openModal, setOpenModal] = useState({
    add: false,
    edit: false,
    delete: false
  });
  const [currentItem, setCurrentItem] = useState();

  useEffect(() => {
    dispatch(GetAllBooks())
  }, [dispatch])

  const showData = () => {
    if (!_.isEmpty(booksState?.data)) {
      return (
        booksState?.data.map(item => {
          return (
            <ListItem
              key={item.id}
              idBook={item.id}
              title={item.title}
              author={item.author}
              openModalFunc={openModalFunc}
            />
          )
        })
      )
    }
  }

  const openModalFunc = (sign, data) => {
    if (sign !== 'add') {
      setCurrentItem(data)
    }
    setOpenModal(prevState => {
      return {
        ...prevState,
        [sign]: !prevState[sign]
      }
    })
  }

  return (
    <div style={{position: "relative"}}>
      <Header />
      <main className='main-container'>
        <div className="add-book">
          <span>Add book</span>
          <button onClick={() => openModalFunc('add')}>
            {projectImages.add}
          </button>
        </div>
        {booksState?.loading ? <span>Loading...</span> : showData()}
        {booksState?.errorMessage && <span>{booksState?.errorMessage}</span>}
      </main>
      <Modal
        openModal={openModal}
        currentItem={currentItem}
        openModalFunc={openModalFunc}
      />
    </div>
  );
}

export default App;
