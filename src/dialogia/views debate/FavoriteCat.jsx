import React, { useState, useEffect } from "react";
import {
  Box,
  Heading,
  Text,
  Spinner,
  Flex,
  Badge,
  Button,
  HStack,
  Image,
  Avatar
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import { useAuth } from "../../contexts/hooks/useAuth";
import axios from "axios";
import { FaUser, FaStar } from 'react-icons/fa';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Flecha previa personalizada
function PrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <Box
      className={className}
      /* 2) Posición absoluta sobre la imagen */
      style={{
        ...style,
        position: "absolute",
        top: "20%",
        left: "10px",
        transform: "translateY(-50%)",
        display: "block",
        color: "white",
        fontSize: "24px",
        zIndex: 2,
      }}
      onClick={onClick}
    ></Box>
  );
}

// Flecha siguiente personalizada
function NextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <Box
      className={className}
      style={{
        ...style,
        position: "absolute",
        top: "20%",
        right: "10px",
        transform: "translateY(-50%)",
        display: "block",
        color: "white",
        fontSize: "24px",
        zIndex: 2,
      }}
      onClick={onClick}
    ></Box>
  );
}

const FavoriteDebatesSlider = ({ censored }) => {
  const [debates, setDebates] = useState([]);
  const [categoriesMap, setCategoriesMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
const [userRanking, setUserRanking] = useState([]);
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const interests = currentUser?.interests || [];

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/category`)
      .then((res) => {
        const map = {};
        res.data.forEach((cat) => {
          map[cat.name] = cat.image;
        });
        setCategoriesMap(map);
      })
      .catch(console.error);
  }, []);


 useEffect(() => {
    axios
      .get("http://localhost:3020/api/v1/user/ranking")
      .then((res) => {
        setUserRanking(res.data);
      })
      .catch((err) => {
        console.error("Error fetching ranking:", err);
      });
  }, []);


  useEffect(() => {
    if (!interests.length) {
      setLoading(false);
      return;
    }
    const fetchRec = async () => {
      try {
        const { data } = await axios.post(
          `${
            import.meta.env.VITE_API_URL
          }/debates/recommend?censored=${censored}`,
          { interests },
          { headers: { "Content-Type": "application/json" } }
        );
        setDebates(data);
      } catch (e) {
        console.error(e);
        setError("Error al cargar debates recomendados");
      } finally {
        setLoading(false);
      }
    };
    fetchRec();
  }, [interests, censored]);

  if (loading)
    return (
      <Box textAlign="center" mt={10}>
        <Spinner size="xl" />
      </Box>
    );
  if (error)
    return (
      <Box textAlign="center" mt={10} color="red.500">
        <Text>{error}</Text>
      </Box>
    );
  if (!debates.length)
    return (
      <Box textAlign="center" mt={10}>
        <Text>No hay recomendaciones disponibles.</Text>
      </Box>
    );

  const settings = {
    dots: true,
    arrows: true,
    infinite: debates.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
  };

  return (
    <Box maxW="800px" mx="auto" py={6} position="relative">
      <Heading as="h1" size="2xl" textAlign="center" mb={6} fontWeight="bold">
        Tus favoritos
      </Heading>
      <Slider {...settings}>
        {debates.map((deb) => {
          const imgSrc =
            deb.image?.trim() ||
            categoriesMap[deb.category] ||
            "/default-category.jpg";
          const userObj = userRanking.find((u) => u.username === deb.username);
          deb.userTitle = userObj?.title || "Novato";
          return (
            <Box
              key={deb.idDebate}
              borderWidth="0.5px"
              borderStyle="solid"
              borderColor="gray.300"
              borderRadius="md"
            >
              <Box mb={4} position="relative">
                <Image
                  src={imgSrc}
                  alt={deb.nameDebate}
                  w="100%"
                  h="200px"
                roundedTop="md"
                  objectFit="cover"
                />
                <Box
                  position="absolute"
                  top={0}
                  left={0}
                  w="100%"
                  h="100%"
                  bg="black"
                  opacity={0}
                  _hover={{ opacity: 0.3 }}
                  transition="opacity 0.3s"
                />
              </Box>
              <Box p={3}>
                {/* 1) Fila con categoría a la izquierda y fecha a la derecha */}
                <Flex align="center" justify="space-between" mb={2}>
                    {/* Grupo izquierdo: badge + fecha */}
                    <HStack spacing={2}>
                    <Badge colorScheme="blue">{deb.category}</Badge>
                    <Text fontSize="sm" color="gray.500">
                        {new Date(deb.datareg).toLocaleDateString("es-ES", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        })}
                    </Text>
                    </HStack>

                    {/* Grupo derecho: iconos y contadores */}
                    <HStack spacing={1} align="center">
                    <FaUser color="rgb(0, 150, 200" />
                    <Text fontSize="sm" color="gray.600">{deb.peopleInFavor.length} A Favor</Text>
                    <FaUser color="red" />
                    <Text fontSize="sm" color="gray.600">{deb.peopleAgaist.length} En Contra</Text>
                    </HStack>
                </Flex>
                <Flex mb={4} mt={6}>
                                <Avatar.Root style={{ width: 100, height: 100, borderRadius: '9999px', overflow: 'hidden' }} mr={3}>
                                  <Avatar.Fallback delayMs={600}>{`A${deb.user?.id}`}</Avatar.Fallback>
                                  <Avatar.Image src={`/avatar_${deb.user?.avatarId || "1" }.jpg`} alt={`Avatar ${deb.user?.id}`} />
                                </Avatar.Root>
                              <Box>
                              <Text fontWeight={500} fontSize="2xl">{deb.username}</Text>
                              <Flex gap={2}>
                                    <FaStar pt={2} color="rgb(71, 71, 71)" size={20}/>
                                  <Text fontWeight={600} fontSize="lg" color="gray.600">{deb.userTitle}</Text>
                              </Flex>
                              </Box>
                </Flex>
                <Heading size="xl" mb={2}>
                  {deb.nameDebate}
                </Heading>
                <Text noOfLines={3} color="gray.600" mb={4}>
                  {deb.argument}
                </Text>
                <Flex justify="center">
                  <Button size="sm" variant="outline" onClick={() => navigate(`/debate/${deb.idDebate}`)}>
                    Ver más
                  </Button>
                </Flex>
              </Box>
            </Box>
          );
        })}
      </Slider>
    </Box>
  );
};

export default FavoriteDebatesSlider;
