import { 
  Box, Text, Grid, GridItem, Heading
} from "@chakra-ui/react";
import RecommendView from '../../views debate/RecommendView';
import PopularView from '../../views debate/PopularView';
import Ranking from '../components/Ranking';
import { useAuth } from '../../../contexts/hooks/useAuth';
import CategoriesBar from '../components/CategoriesBar';

const Home = () => {
  const user = useAuth();

  return (
    <Box maxW="100vw" overflowX="hidden">
      <CategoriesBar />

      <Box p={{ base: 2, md: 4 }}>
        <Grid
          templateColumns={{
            base: "1fr",
            sm: "repeat(2, 1fr)",
            md: "45% 35% 20%"
          }}
          gap={{ base: 4, md: 6 }}
        >
          <GridItem>
            <RecommendView
              interests={user.currentUser.interests}
              censored={user.currentUser.censorship} 
            />
          </GridItem>
          <GridItem>
            <PopularView
              censored={user.currentUser.censorship} />
          </GridItem>
          <GridItem>
            <Ranking />
          </GridItem>
        </Grid>
      </Box>
    </Box>
  );
};

export default Home;