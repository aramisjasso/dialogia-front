import React from 'react';
import { useState } from 'react';
import SearchBar from '../components/SearchBar';
import DebatesSearch from '../components/DebatesSearch'

const Search = () => {
    const [search, setSearch] = useState('');
    const [finalSearch, setFinalSearch] = useState('');
    
    const handleSearch = (value) => {
        setSearch(value); // Actualiza el input en tiempo real
        if (value.trim() !== '' && (event?.key === 'Enter' || event?.type === 'click')) {
            setFinalSearch(value); // Guarda el valor final cuando se presiona Enter
        }
    }

    return (
        <>
            <SearchBar search={handleSearch} />
            {finalSearch && <DebatesSearch search={finalSearch} />}
        </>
    );
};

export default Search;