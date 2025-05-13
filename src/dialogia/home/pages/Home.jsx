import { 
  Box, Text, Grid, GridItem, Heading
} from "@chakra-ui/react";
import {useState} from "react";
import RecommendView from '../../views debate/RecommendView';
import PopularView from '../../views debate/PopularView';
import FavoriteDebatesSlider from '../../views debate/FavoriteCat';

import Ranking from '../components/Ranking';
import { useAuth } from '../../../contexts/hooks/useAuth';
import CategoriesBar from '../components/CategoriesBar';

const Home = () => {
  const user = useAuth();
  const [showRankingSidebar, setShowRankingSidebar] = useState(false);

  return (
    <Box maxW="100vw" overflowX="hidden">
      <CategoriesBar 
        showRankingSidebar={showRankingSidebar}
        setShowRankingSidebar={setShowRankingSidebar}
        showRankingButton={true}
      />

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


        {/* Sidebar de ranking */}
        {showRankingSidebar && (
          <Box
            position="fixed"
            right="0"
            top="0"
            h="100vh"
            w={{ base: "100%", md: "20%" }}
            bg="white"
            boxShadow="lg"
            zIndex="overlay"
            overflowY="auto"
            transition="all 0.3s ease"
          >
            <Box p={4}>
              <Flex justify="space-between" align="center" mt={2} mb={2}>
                <IconButton
                  icon={<FiX />}
                  variant="ghost"
                  onClick={() => setShowRankingSidebar(false)}
                />
              </Flex>
              <Ranking />
            </Box>
          </Box>
        )}

        {showRankingSidebar && (
        <Box
          position="fixed"
          top="0"
          left="0"
          w={{ base: "0", md: "80%" }} // En móviles no se muestra, en desktop cubre 80%
          h="100vh"
          bg="blackAlpha.400"
          zIndex="overlay"
          onClick={() => setShowRankingSidebar(false)}
        />
      )}
      </Box>
    </Box>
  );
};

export default Home;
