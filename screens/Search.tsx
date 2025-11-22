import { useState, useCallback } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { API } from "../api/api";
import SearchBar from "../components/SearchBar";
import MovieRow from "../components/MovieRow";

export default function Search() {
  const [query, setQuery] = useState("");
  const [local, setLocal] = useState<any[]>([]);
  const [tmdb, setTmdb] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchMovies = useCallback(async (text: string) => {
    setQuery(text);

    if (text.length < 2) {
      setLocal([]);
      setTmdb([]);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Search local movies (if backend has local search endpoint)
      // For now, fetch all local movies and filter client-side
      // Or use TMDB search for both
      
      // Search TMDB movies
      const tmdbRes = await API.get(`/movies/search?q=${encodeURIComponent(text)}`);
      setTmdb(tmdbRes.data || []);

      // Try to search local movies (if endpoint exists)
      try {
        const localRes = await API.get(`/movies/local`);
        const allLocal = localRes.data || [];
        // Filter local movies by title
        const filteredLocal = allLocal.filter((movie: any) =>
          movie.title?.toLowerCase().includes(text.toLowerCase())
        );
        setLocal(filteredLocal);
      } catch (localErr) {
        // If local search fails, just set empty array
        setLocal([]);
      }

      console.log("✅ Search completed:", {
        query: text,
        local: local.length,
        tmdb: tmdbRes.data?.length || 0,
      });
    } catch (err: any) {
      console.error("❌ Error searching movies:", err);
      setError("Failed to search movies. Please try again.");
      setLocal([]);
      setTmdb([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const hasResults = (local.length > 0 || tmdb.length > 0);

  return (
    <View style={styles.container}>
      <View style={styles.searchBarContainer}>
        <SearchBar value={query} onChange={searchMovies} />
      </View>

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#e50914" />
          <Text style={styles.loadingText}>Searching...</Text>
        </View>
      )}

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <ScrollView>
        {!loading && query.length >= 2 && !hasResults && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No movies found</Text>
            <Text style={styles.emptySubtext}>Try a different search term</Text>
          </View>
        )}

        {local.length > 0 && (
          <MovieRow title="Your Uploaded Movies" movies={local} local />
        )}

        {tmdb.length > 0 && (
          <MovieRow title="Search Results" movies={tmdb} />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#000", 
    paddingTop: 10,
  },
  searchBarContainer: {
    paddingHorizontal: 10,
    paddingBottom: 10,
    backgroundColor: "#000",
  },
  loadingContainer: {
    padding: 20,
    alignItems: "center",
  },
  loadingText: {
    color: "#fff",
    marginTop: 10,
    fontSize: 16,
  },
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
