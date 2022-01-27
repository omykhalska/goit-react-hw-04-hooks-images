import React from 'react';
import PropTypes from 'prop-types';
import { GalleryBox } from './ImageGallery.styled';
import ImageGalleryItem from '../ImageGalleryItem';

function ImageGallery({ images, onClick }) {
  return (
    <GalleryBox>
      {images.map(({ webformatURL, tags }, index) => (
        <ImageGalleryItem
          key={index}
          imageUrl={webformatURL}
          imageTags={tags}
          onClick={() => onClick(index)}
        />
      ))}
    </GalleryBox>
  );
}

ImageGallery.propTypes = {
  images: PropTypes.arrayOf(PropTypes.object).isRequired,
  onClick: PropTypes.func,
};

export default ImageGallery;
