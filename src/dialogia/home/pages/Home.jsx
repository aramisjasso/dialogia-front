import { 
  Box, Text, Grid, GridItem, Heading, Flex, IconButton
} from "@chakra-ui/react";
import RecommendView from '../../views debate/RecommendView';
import PopularView from '../../views debate/PopularView';
import FavoriteDebatesSlider from '../../views debate/FavoriteCat';
import { useAuth } from '../../../contexts/hooks/useAuth';
import CategoriesBar from '../components/CategoriesBar';


const Home = () => {
  const user = useAuth();

  return (
    <Box maxW="100vw" overflowX="hidden">
      <CategoriesBar/>

      <Box p={{ base: 2, md: 4 }}>
<Grid
  templateColumns={{
    base: "1fr",
    sm: "repeat(2, 1fr)",
    md: "35% 35% 25%"
  }}
  gap={{ base: 4, md: 6 }}
>
  <GridItem>
    <FavoriteDebatesSlider/>
  </GridItem>

  {/* entre columna 1 y 2 */}
  <GridItem
    borderLeft={{ md: "1px solid transparent" }}
    borderImage="linear-gradient(to bottom, transparent, #ccc, transparent) 1"
    pl={{ md: 6 }}  // espacio a la izquierda del contenido
    py={{ base: 2, md: 4 }}
  >
    <RecommendView
      interests={user.currentUser.interests}
      censored={user.currentUser.censorship}
    />
  </GridItem>

  {/* entre columna 2 y 3 */}
  <GridItem
    borderLeft={{ md: "1px solid transparent" }}
    borderImage="linear-gradient(to bottom, transparent, #ccc, transparent) 1"
    pl={{ md: 6 }}
    py={{ base: 2, md: 4 }}
  >
    <PopularView censoried={user.currentUser.censorship} />
  </GridItem>
</Grid>
      </Box>
    </Box>
  );
};

export default Home;
