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
        <Container maxW="container.lg" py={8} centerContent>
            <Box w="100%" mb={8}>
                <Heading as="h1" size="xl" mb={6} textAlign="center">
                    Buscar Debates
                </Heading>
                
                <SearchBar 
                    onInputChange={handleInputChange} 
                    onSearch={triggerSearch} 
                    inputValue={inputValue}
                />
            </Box>

            {finalSearch && (
                <Box w="100%">
                    <DebatesSearch search={finalSearch} />
                </Box>
            )}
        </Container>
    );
};

export default Search;