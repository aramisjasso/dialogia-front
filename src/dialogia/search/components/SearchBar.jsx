import { Input, IconButton, Box } from "@chakra-ui/react";
import { LuSearch } from "react-icons/lu";

const SearchBar = ({ onInputChange, onSearch, inputValue }) => {
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            onSearch();
        }
    };

    return (
        <Box display="flex" alignItems="stretch" width="100%">
        {/* Input con altura personalizada */}
        <Input
            placeholder="Buscar debates por título o argumento"
            value={inputValue}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            size="lg" // Base "lg" (48px)
            height="48px" // Altura personalizada (+8px)
            borderRadius="0"
            borderWidth="1px"
            borderRight="none"
            flex="1"
            fontSize="lg" // Asegura proporción texto/altura
        />
        
        {/* Botón con MISMA altura */}
        <Box
            as="button"
            onClick={onSearch}
            bg="black"
            px={4}
            display="flex"
            alignItems="center"
            justifyContent="center"
            border="1px solid gray.300"
            borderLeft="none"
            _hover={{ bg: "gray.800" }}
            _active={{ bg: "gray.700" }}
            height="48px" // Misma altura que el Input
            minWidth="48px" // Cuadrado perfecto
        >
            <LuSearch color="white" size="24px" /> {/* Icono más grande */}
        </Box>
        </Box>
        
    );
};

export default SearchBar;