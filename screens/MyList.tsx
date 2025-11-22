import { useEffect, useState } from "react";
import { ScrollView, Text, StyleSheet, View, ActivityIndicator } from "react-native";
import { API } from "../api/api";
import MovieRow from "../components/MovieRow";

export default function MyList() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    API.get("/movies/favorites/me")
      .then((res) => {
        setFavorites(res.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching favorites:", err);
        setError("Failed to load favorites");
        setFavorites([]);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="red" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>My List ❤️</Text>
      {error && (
        <Text style={styles.error}>{error}</Text>
      )}
      {favorites.length > 0 ? (
        <MovieRow title="Saved Movies" movies={favorites} local />
      ) : (
        <Text style={styles.empty}>
          {error ? "Error loading favorites" : "No movies saved"}
        </Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: "#000", flex: 1, padding: 10 },
  heading: { color: "#fff", fontSize: 22, fontWeight: "700", marginBottom: 10 },
  empty: { color: "#666", textAlign: "center", marginTop: 50 },
  error: { color: "#E50914", textAlign: "center", marginTop: 20, fontSize: 14 },
});
