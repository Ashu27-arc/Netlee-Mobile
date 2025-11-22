import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { API } from "../api/api";
import SearchBar from "../components/SearchBar";
import MovieRow from "../components/MovieRow";

export default function Search() {
  const [query, setQuery] = useState("");
  const [local, setLocal] = useState([]);
  const [tmdb, setTmdb] = useState([]);

  const searchMovies = async (text: string) => {
    setQuery(text);

    if (text.length < 2) return;

    const localRes = await API.get(`/movies/search?q=${text}`);
    setLocal(localRes.data);

    const tmdbRes = await API.get(`/movies/search?q=${text}`);
    setTmdb(tmdbRes.data);
  };

  return (
    <View style={styles.container}>
      <SearchBar value={query} onChange={searchMovies} />

      <ScrollView>
        {local.length > 0 && (
          <MovieRow title="Your Movies" movies={local} local />
        )}

        {tmdb.length > 0 && (
          <MovieRow title="More Results" movies={tmdb} />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", padding: 10 },
});
