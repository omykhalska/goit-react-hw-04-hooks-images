import React, { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import Searchbar from '../Searchbar/';
import ImageGallery from '../ImageGallery';
import Button from '../Button/';
import Loader from '../Loader';
import Modal from '../Modal';
import { Container, ErrorText } from './App.styled';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import { getImages } from '../../services/searchImagesApi';

const ON_ERROR_TEXT = 'Something went wrong... Try again later!';
const WARNING_TEXT = 'No images found! Try  another search keyword';
const FIRST_PAGE = 1;
const STATUS = {
  IDLE: 'idle',
  PENDING: 'pending',
  REJECTED: 'rejected',
  RESOLVED: 'resolved',
};

const toastOptions = {
  style: {
    padding: '18px',
    color: '#D8000C',
    background: '#FFBABA',
  },
};

export default function App() {
  const [query, setQuery] = useState('');
  const [images, setImages] = useState([]);
  const [totalImages, setTotalImages] = useState(0);
  const [activeImage, setActiveImage] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [status, setStatus] = useState(STATUS.IDLE);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!query || loaded) {
      return;
    }

    FIRST_PAGE === currentPage && setImages([]);
    setStatus(STATUS.PENDING);
    setShowModal(true);

    getImages(query, currentPage)
      .then(({ data: { hits, totalHits } }) => {
        if (hits.length === 0) {
          toast.error(WARNING_TEXT);
          setShowModal(false);
          setStatus(STATUS.IDLE);
          return;
        }

        const filteredImages = [];
        hits.forEach(({ tags, webformatURL, largeImageURL }) => {
          let imageData = {
            tags,
            webformatURL,
            largeImageURL,
          };
          filteredImages.push(imageData);
        });

        FIRST_PAGE === currentPage
          ? setImages(filteredImages)
          : setImages([...images, ...filteredImages]);
        setTotalImages(totalHits);
        setShowModal(false);
        setStatus(STATUS.RESOLVED);
      })
      .catch(({ message }) => {
        console.log(message);
        setStatus(STATUS.REJECTED);
      });

    setLoaded(true);
  }, [currentPage, images, loaded, query]);

  const handleLoadMoreBtn = () => {
    setCurrentPage(currentPage => currentPage + 1);
    setLoaded(false);
  };

  const handleFormSubmit = query => {
    setQuery(query);
    setCurrentPage(1);
    setLoaded(false);
  };

  const toggleModal = () => {
    setShowModal(showModal => !showModal);
  };

  const handleImageClick = index => {
    setActiveImage(index);
    toggleModal();
  };

  const renderPending = currentPage => (
    <>
      {currentPage > 1 && <ImageGallery images={images} />}
      {showModal && (
        <Modal>
          <Loader />
        </Modal>
      )}
    </>
  );

  const renderResolved = () => (
    <>
      <ImageGallery images={images} onClick={handleImageClick} />;
      {totalImages !== images.length && <Button onClick={handleLoadMoreBtn} />}
      {showModal && (
        <Modal onClose={toggleModal}>
          <img
            src={images[activeImage].largeImageURL}
            alt={images[activeImage].tags}
          />
        </Modal>
      )}
    </>
  );

  return (
    <Container>
      <Toaster toastOptions={toastOptions} />
      <Searchbar onSubmit={handleFormSubmit} />
      {status === STATUS.PENDING && renderPending(currentPage)}
      {status === STATUS.REJECTED && <ErrorText>{ON_ERROR_TEXT}</ErrorText>}
      {status === STATUS.RESOLVED && renderResolved()}
    </Container>
  );
}
