import React, { useState } from 'react';
import { Heading, Box, Container } from '@chakra-ui/react';
import SearchBar from '../components/SearchBar';
import DebatesSearch from '../components/DebatesSearch';

const Search = () => {
    const [inputValue, setInputValue] = useState(''); // Valor temporal del input
    const [finalSearch, setFinalSearch] = useState(''); // Término de búsqueda final
    
    const handleInputChange = (value) => {
        setInputValue(value); // Actualiza el valor del input en tiempo real
    };

    const triggerSearch = () => {
        if (inputValue.trim()) {
            setFinalSearch(inputValue.trim()); // Establece el término de búsqueda final
        }
    };

    return (
        <Box as="section" w="full">
        <Container maxW="full" centerContent bg="gray.200" py={14}>
        <Heading mb={6} fontSize="2rem">
        {finalSearch
            ? `Resultados encontrados para "${finalSearch}"`
            : 'Buscar Debates'}
        </Heading>
          <SearchBar
            inputValue    = {inputValue}
            onInputChange = {handleInputChange}
            onSearch      = {triggerSearch}
          />
        </Container>
            {finalSearch && (
                <Box w="100%">
                        <DebatesSearch search={finalSearch} />
                </Box>
        )}   
      </Box>       
    )
}

export default Search;