import React, { useState, useEffect } from "react";
import { Box, Grid, Heading, Text, Image, Flex } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { toaster } from "../../../components/ui/toaster";

// Datos de ejemplo para 10 categorías
const categoriesData = [
  {
    id: 1,
    name: "Filosofía",
    description:
      "Foro para todos los debates relacionados a la filosofía, el cuestionamiento del pensamiento humano y el razonamiento profundo. Un espacio para analizar grandes preguntas existenciales y explorar las diversas corrientes filosóficas a lo largo de la historia.",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Sanzio_01_Plato_Aristotle.jpg/800px-Sanzio_01_Plato_Aristotle.jpg",
  },
  {
    id: 2,
    name: "Ciencia",
    description:
      "Espacio dedicado a debatir los avances científicos más innovadores y sus implicaciones en nuestra sociedad. Aquí se promueve el pensamiento crítico y se exploran teorías que desafían el entendimiento convencional del mundo natural.",
    image:
      "https://i.pinimg.com/736x/9f/75/0d/9f750d6d963c942dba53bbaa102d3d28.jpg",
  },
  {
    id: 3,
    name: "Religión",
    description:
      "Un lugar para el diálogo interreligioso y el análisis profundo de las creencias que han moldeado culturas y civilizaciones. Se abordan temas de espiritualidad, dogmas y la influencia de la fe en la vida moderna con respeto y rigor.",
    image:
      "https://e0.pxfuel.com/wallpapers/491/377/desktop-wallpaper-xavier-raghunanan-on-phone-aesthetic-painting-aesthetic-art-renaissance-paintings.jpg",
  },
  {
    id: 4,
    name: "Deportes",
    description:
      "Foro para debatir y analizar el mundo deportivo, donde se discuten tácticas, rivalidades y el impacto social y cultural de las competiciones. Un espacio ideal para fanáticos que desean profundizar en cada jugada y estrategia.",
    image:
      "https://i.pinimg.com/474x/1f/91/a0/1f91a0e4a7c43bfddd4510006878c4be.jpg",
  },
  {
    id: 5,
    name: "Cultura Pop",
    description:
      "Un vibrante espacio para debatir sobre tendencias del entretenimiento, música, cine, series y fenómenos virales. Se fomenta la crítica y el análisis de cómo la cultura pop influye y refleja la sociedad actual.",
    image: "https://wallpapercave.com/wp/wp5283166.jpg",
  },
  {
    id: 6,
    name: "Economía",
    description:
      "Foro para discutir políticas económicas, el funcionamiento de los mercados financieros y su impacto en la sociedad. Se abordan temas de globalización, inversión y estrategias económicas desde un enfoque crítico y analítico.",
    image: "https://wallpapercave.com/wp/wp13280932.jpg",
  },
  {
    id: 7,
    name: "Social",
    description:
      "Un espacio dedicado a los debates sobre temas sociales, la evolución de las dinámicas humanas y los desafíos en la construcción de una sociedad más equitativa e inclusiva. Se promueve el intercambio de ideas y el análisis de los cambios culturales.",
    image:
      "https://i.pinimg.com/236x/69/d6/da/69d6da0601f28f58ff96ee1ad3c6f7d6.jpg",
  },
  {
    id: 8,
    name: "Tecnología",
    description:
      "Lugar para debatir las innovaciones tecnológicas, el impacto de la digitalización y el futuro de la inteligencia artificial. Se exploran desde gadgets y redes sociales hasta desarrollos que transforman la manera en que vivimos y nos comunicamos.",
    image:
      "https://w0.peakpx.com/wallpaper/80/546/HD-wallpaper-robot-abstract-art-design-graphic-green-illustration-texture-vector.jpg",
  },
  {
    id: 9,
    name: "Política",
    description:
      "Foro abierto para el análisis y la discusión sobre estrategias políticas, decisiones gubernamentales y dinámicas de poder. Se fomenta un debate informado y el intercambio de ideas para comprender mejor la gestión pública y los desafíos del liderazgo.",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPuBDcX7TwlIaQTThv9bABzXcbNZyPVnaPP2aLZOfnJAuBNudcG39NOkAOkhy1-HPKPPs&usqp=CAU",
  },
  {
    id: 10,
    name: "Conspiración",
    description:
      "Espacio para explorar y debatir teorías conspirativas, cuestionar narrativas oficiales y analizar misterios sin resolver. Se promueve un enfoque crítico y escéptico que invita a investigar y dialogar sobre hechos controvertidos.",
    image:
      "https://w0.peakpx.com/wallpaper/40/525/HD-wallpaper-illuminati-funny.jpg",
  },
  {
    id: 11,
    name: "Historia",
    description:
      "Espacio para analizar eventos históricos y debatir su relevancia e impacto en el mundo moderno.",
    image: "https://wallpapers.com/images/hd/dark-ages-ds9jqq5tmlsj963n.jpg",
  },
  {
    id: 12,
    name: "Otros",
    description:
      "Espacio para todos los temas que no encajan con las categorías que hemos definido para ti.",
    image: "https://i.pinimg.com/564x/80/05/94/80059433996fbf827fcae5826b7bbfce.jpg",
  }
];

// Componente para cada tarjeta de categoría
const CategoryCard = ({ category }) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/category/${category.id}`);
  };

  return (
    <Box
      position="relative"
      overflow="hidden"
      borderRadius="md"
      boxShadow="md"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      cursor="pointer"
      mb={6}
      height={["400px", "500px", "600px"]} 
      onClick={handleClick}
    >
      <Image
        src={category.image}
        alt={category.name}
        width="100%"
        height="100%"
        objectFit="cover" // Stretch the image to fill the container if necessary
      />

      {/* Capa para oscurecer la imagen */}
      <Box
        position="absolute"
        top="0"
        left="0"
        width="100%"
        height="100%"
        bg="black"
        opacity={isHovered ? 0.5 : 0}
        transition="opacity 0.3s ease-in-out"
      />

      {/* Descripción que aparece desde abajo */}
      <Box
        position="absolute"
        bottom="0"
        left="0"
        right="0"
        bg="rgba(0, 0, 0, 0.6)"
        color="white"
        p={[4, 6, 10]} // Responsive padding
        transform={isHovered ? "translateY(0)" : "translateY(100%)"}
        transition="transform 0.3s ease-in-out"
      >
        <Text fontSize={["14px", "16px", "18px"]}>
          {category.description}
        </Text>
      </Box>
    </Box>
  );
};

const Categories = () => {
  const [categories, setCategories] = useState([]);


  // Obtener categorías desde la API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/category`);
        if (!response.ok) throw new Error("Error al obtener categorías");
        const data = await response.json();
        const sortedData = [...data].sort((a, b) => a.order - b.order);  // Ordenar copia por id
        setCategories(sortedData);
      } catch (error) {
        toaster.create({
          title: "Error",
          description: error.message,
          status: "error",
          type: "error",
        });
      }
    };
    fetchCategories();

  }, []);
  return (
    <Box p={[1, 2, 4]}>
      {/* Sección del título */}
      <Flex justify="center" mb={[1, 2, 4]} mt={[1, 2, 4]}>
        <Heading

          // fontFamily= "Times New Roman, serif"
          fontWeight= {300} // ExtraLight

          fontSize={["xl", "2xl", "6xl"]}
          textAlign="center"
        >
          CATEGORIAS
        </Heading>
      </Flex>

      {/* Divisor personalizado */}
      <Box
        height="1px"
        bg="gray.400"
        width="100%"
        mx="auto"
        mb={[6, 4, 8]}
      />

      {/* Grid de categorías */}
      <Grid
        templateColumns={[
          "repeat(1, 1fr)",
          "repeat(2, 1fr)",
          "repeat(3, 1fr)",
        ]}
        gap={[4, 6, 8]}
      >
        {categories.map((category) => (
          <Box key={category.id}>
            {/* Nombre de la categoría */}
            <Text
              fontSize={["14px", "16px", "18px"]}
              fontWeight="bold"
              mb={2}
            >
              {category.name}
            </Text>
            {/* Divisor personalizado */}
            <Box
              height="1px"
              bg="gray.500"
              width="100%"
              mx="auto"
              mb={2}
            />
            <CategoryCard category={category} />
          </Box>
        ))}
      </Grid>
    </Box>
  );
};

export default Categories;
