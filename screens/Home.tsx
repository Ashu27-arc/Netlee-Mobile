import { useContext, useEffect, useState, useCallback } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  ImageBackground,
  RefreshControl,
  ActivityIndicator,
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
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMovies = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const res = await API.get("/movies/home");
      const moviesData = res.data || {
        local: [],
        trending: [],
        popular: [],
        topRated: [],
        upcoming: []
      };
      
      setData(moviesData);
      
      // Log success
      console.log("✅ Movies fetched successfully:", {
        local: moviesData.local?.length || 0,
        trending: moviesData.trending?.length || 0,
        popular: moviesData.popular?.length || 0,
        topRated: moviesData.topRated?.length || 0,
        upcoming: moviesData.upcoming?.length || 0,
      });
    } catch (err: any) {
      console.error("❌ Error loading movies:", err);
      setError("Failed to load movies. Pull down to refresh.");
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
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  const onRefresh = useCallback(() => {
    fetchMovies(true);
  }, [fetchMovies]);

  const hero = data.trending && data.trending.length > 0 
    ? data.trending[0] 
    : data.popular && data.popular.length > 0 
    ? data.popular[0] 
    : data.local && data.local.length > 0 
    ? data.local[0] 
    : null;

  if (loading && !refreshing) {
    return (
      <View style={styles.container}>
        <Navbar />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#e50914" />
          <Text style={styles.loadingText}>Loading movies...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Navbar />

      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#e50914"
            colors={["#e50914"]}
          />
        }
      >
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

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

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

          {!loading && !error && 
           (!data.local || data.local.length === 0) &&
           (!data.trending || data.trending.length === 0) &&
           (!data.popular || data.popular.length === 0) &&
           (!data.topRated || data.topRated.length === 0) &&
           (!data.upcoming || data.upcoming.length === 0) && (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No movies available</Text>
              <Text style={styles.emptySubtext}>Pull down to refresh</Text>
            </View>
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
    marginTop: 10,
  },
  // ERROR
  errorContainer: {
    backgroundColor: "rgba(229, 9, 20, 0.2)",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  errorText: {
    color: "#ff6b6b",
    fontSize: 14,
    textAlign: "center",
  },
  // EMPTY
  emptyContainer: {
    padding: 40,
    alignItems: "center",
  },
  emptyText: {
    color: "#aaa",
    fontSize: 18,
    marginBottom: 8,
  },
  emptySubtext: {
    color: "#666",
    fontSize: 14,
  },
});
