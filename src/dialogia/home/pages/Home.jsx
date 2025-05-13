import { Box, Text, Grid, GridItem, Heading, Flex, IconButton } from "@chakra-ui/react";
import RecommendView from "../../views debate/RecommendView";
import PopularView from "../../views debate/PopularView";
import Ranking from "../components/Ranking";
import { useAuth } from "../../../contexts/hooks/useAuth";
import CategoriesBar from "../components/CategoriesBar";
import { FiX } from "react-icons/fi";
import { useState } from "react";

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
            md: showRankingSidebar ? "45% 35%" : "45% 35% 20%",
          }}
          gap={{ base: 4, md: 6 }}
        >
          <GridItem>
            <RecommendView interests={user.currentUser.interests} />
          </GridItem>
          <GridItem>
            <PopularView />
          </GridItem>
          {!showRankingSidebar && (
            <GridItem>
              <Ranking />
            </GridItem>
          )}
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
