import { useContext, useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  ImageBackground,
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import { API } from "../api/api";
import MovieRow from "../components/MovieRow";
import Navbar from "../components/Navbar";

export default function Home() {
  const { user } = useContext(AuthContext);
  const [data, setData] = useState<{ 
    local: any[]; 
    trending: any[];
    popular: any[];
    topRated: any[];
    upcoming: any[];
  }>({ 
    local: [], 
    trending: [],
    popular: [],
    topRated: [],
    upcoming: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await API.get("/movies/home");
        setData(res.data || {
          local: [],
          trending: [],
          popular: [],
          topRated: [],
          upcoming: []
        });
      } catch (err) {
        console.error("Error loading movies:", err);
        // Set empty data on error to prevent crashes
        setData({
          local: [],
          trending: [],
          popular: [],
          topRated: [],
          upcoming: []
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const hero = data.trending && data.trending.length > 0 
    ? data.trending[0] 
    : data.popular && data.popular.length > 0 
    ? data.popular[0] 
    : data.local && data.local.length > 0 
    ? data.local[0] 
    : null;

  if (loading) {
    return (
      <View style={styles.container}>
        <Navbar />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading movies...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Navbar />

      <ScrollView>
        {hero && (
          <ImageBackground
            source={{
              uri: `https://image.tmdb.org/t/p/original${hero.backdrop_path}`,
            }}
            style={styles.hero}
          >
            <View style={styles.heroBottom}>
              <Text style={styles.heroTitle}>{hero.title}</Text>
            </View>
          </ImageBackground>
        )}

        <View style={styles.content}>
          <Text style={styles.greet}>
            Hello, {user?.name || "Guest"} 👋
          </Text>

          {data.local && data.local.length > 0 && (
            <MovieRow title="Your Uploaded Movies" movies={data.local} local />
          )}
          {data.trending && data.trending.length > 0 && (
            <MovieRow title="Trending Now" movies={data.trending} />
          )}
          {data.popular && data.popular.length > 0 && (
            <MovieRow title="Popular Movies" movies={data.popular} />
          )}
          {data.topRated && data.topRated.length > 0 && (
            <MovieRow title="Top Rated" movies={data.topRated} />
          )}
          {data.upcoming && data.upcoming.length > 0 && (
            <MovieRow title="Upcoming" movies={data.upcoming} />
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },

  // HERO BANNER
  hero: {
    height: 340,
    justifyContent: "flex-end",
  },
  heroBottom: {
    backgroundColor: "rgba(0,0,0,0.4)",
    padding: 15,
  },
  heroTitle: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
  },

  // CONTENT
  content: {
    padding: 12,
  },
  greet: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    marginVertical: 10,
  },

  // LOADING
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#fff",
    fontSize: 18,
  },
});
