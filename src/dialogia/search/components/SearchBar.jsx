import { Input, InputGroup, IconButton, Box } from "@chakra-ui/react";
import { LuSearch } from "react-icons/lu";
import { useState } from "react";

const SearchBar = ({ search }) => {
    const [inputValue, setInputValue] = useState('');
     
    return (
        <Box position="relative" flex="1">
            <InputGroup>
                <Input
                    placeholder="Buscar debates"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && inputValue.trim() && search(inputValue)}
                    pr="40px" // Espacio para el botón
                />
            </InputGroup>
            
            {/* Botón de búsqueda a la derecha */}
            <IconButton
                icon={<LuSearch />}
                onClick={() => inputValue.trim() && search(inputValue)}
                variant="ghost"
                aria-label="Buscar"
                size="sm"
                position="absolute"
                right="1"
                top="50%"
                transform="translateY(-50%)"
                isDisabled={!inputValue.trim()}
            />
        </Box>
    );
};

export default SearchBar;