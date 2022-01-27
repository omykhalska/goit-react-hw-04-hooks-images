import React, { useState } from 'react';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import {
  Wrapper,
  SearchForm,
  SearchFormBtn,
  SearchInput,
  BtnIcon,
} from './Searchbar.styled';

function Searchbar({ onSubmit }) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleQueryChange = e => {
    setSearchQuery(e.currentTarget.value.toLowerCase());
  };

  const onSearchBtnClick = e => {
    e.preventDefault();
    if (searchQuery.trim() === '') {
      toast.error('Enter something to search!');
      return;
    }
    onSubmit(searchQuery);
    setSearchQuery('');
  };

  return (
    <Wrapper>
      <SearchForm>
        <SearchFormBtn
          type="submit"
          aria-label="search"
          onClick={onSearchBtnClick}
        >
          <BtnIcon />
        </SearchFormBtn>
        <SearchInput
          type="text"
          autocomplete="off"
          placeholder="Search images and photos"
          value={searchQuery}
          onChange={handleQueryChange}
        />
      </SearchForm>
    </Wrapper>
  );
}

Searchbar.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default Searchbar;
