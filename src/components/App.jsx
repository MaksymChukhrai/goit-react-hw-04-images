import React, { useState, useEffect, useCallback } from 'react';
import { fetchGallery } from '../services/api';
import Searchbar from './Searchbar/Searchbar';
import ImageGallery from './ImageGallery/ImageGallery';
import Loader from './Loader/Loader';
import Button from './Button/Button';
import Modal from './Modal/Modal';

const App = () => {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const fetchImages = useCallback(() => {
    setIsLoading(true);

    fetchGallery(searchQuery, page)
      .then(({ data }) => {
        const newImages = data.hits.map(image => ({
          id: image.id,
          webformatURL: image.webformatURL,
          largeImageURL: image.largeImageURL,
        }));

        setImages(prevImages => [...prevImages, ...newImages]);
        setError(null);
      })
      .catch(error => {
        setError(error.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [searchQuery, page]);

  useEffect(() => {
    if (!searchQuery) return;
    fetchImages();
  }, [searchQuery, fetchImages]);

  const handleSearchSubmit = query => {
    setImages([]);
    setSearchQuery(query);
    setPage(1);
  };

  const handleLoadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  const handleOpenModal = useCallback(imageUrl => {
    setSelectedImage(imageUrl);
    setShowModal(true);
  }, []);

  const handleCloseModal = () => {
    setSelectedImage(null);
    setShowModal(false);
  };

  return (
    <div>
      <Searchbar onSubmit={handleSearchSubmit} />
      <ImageGallery images={images} onImageClick={handleOpenModal} />
      {isLoading && <Loader />}
      {!isLoading && images.length > 0 && (
        <Button
          onLoadMoreClick={handleLoadMore}
          hasImages={images.length > 0}
        />
      )}
      {showModal && (
        <Modal imageUrl={selectedImage} onClose={handleCloseModal} />
      )}
      {error && <p>Error: {error}</p>}
    </div>
  );
};

export default App;
