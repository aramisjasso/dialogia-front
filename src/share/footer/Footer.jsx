import { Box, Text, Flex } from "@chakra-ui/react";
import { LuInfo, LuFile } from "react-icons/lu";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <Box bg="blackAlpha.900" color="white" py={1} px={2} textAlign="center">
      <Text fontSize="xs" color="gray.300" mb={2}>
        © {new Date().getFullYear()} Dialogia.
      </Text>
      
      <Flex justify={"center"} gap={2} mt={{ base: 1, md: 0 }}>
        <Flex align="center" cursor="pointer" onClick={() => navigate('/aboutus')}
          _hover={{ color: "teal.300" }} color="gray.300" fontSize="xs">
          <LuInfo size={10 } />
          <Text ml={1}>ACERCA DE NOSOTROS</Text>
        </Flex>
        
        <Flex align="center" cursor="pointer" onClick={() => navigate('/policies')}
          _hover={{ color: "teal.300" }} color="gray.300" fontSize="xs">
          <LuFile size={10 } />
          <Text ml={1}>POLÍTICAS DE USO</Text>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Footer;