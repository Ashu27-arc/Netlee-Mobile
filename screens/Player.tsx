import { useEffect, useRef, useState } from "react";
import { Video, AVPlaybackStatus } from "expo-av";
import { View, Text, ActivityIndicator, StyleSheet, Dimensions } from "react-native";
import { API } from "../api/api";
import { useLocalSearchParams } from "expo-router";

const { width } = Dimensions.get("window");

export default function Player() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const videoRef = useRef<Video>(null);
  const [movie, setMovie] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("Movie ID is missing");
      setLoading(false);
      return;
    }

    API.get(`/movies/local/${id}`)
      .then((res) => {
        setMovie(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching movie:", err);
        setError("Failed to load movie. Please try again.");
        setLoading(false);
      });
  }, [id]);

  const handlePlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      if (status.error) {
        console.error("Video playback error:", status.error);
        setError("Video playback error. Trying fallback...");
        // Try fallback to videoUrl if hlsUrl fails
        if (movie?.videoUrl && movie?.hlsUrl) {
          videoRef.current?.loadAsync({ uri: movie.videoUrl });
        }
      }
    }
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="red" />
      </View>
    );
  }

  if (error && !movie) {
    return (
      <View style={styles.loader}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  // Use hlsUrl if available, otherwise fallback to videoUrl
  const videoUri = movie?.hlsUrl || movie?.videoUrl;

  if (!videoUri) {
    return (
      <View style={styles.loader}>
        <Text style={styles.errorText}>No video URL available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Video
        ref={videoRef}
        style={styles.video}
        source={{ uri: videoUri }}
        useNativeControls
        shouldPlay
        resizeMode="contain"
        onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
        onError={(error) => {
          console.error("Video error:", error);
          if (movie?.videoUrl && movie?.hlsUrl && videoUri === movie.hlsUrl) {
            // Try fallback to videoUrl
            videoRef.current?.loadAsync({ uri: movie.videoUrl });
          } else {
            setError("Failed to play video");
          }
        }}
      />

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <Text style={styles.title}>{movie?.title}</Text>
      <Text style={styles.desc}>{movie?.description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: "#000", flex: 1, paddingTop: 45 },
  video: { width: width, height: 240, backgroundColor: "#111" },
  title: { color: "#fff", fontSize: 20, fontWeight: "700", marginTop: 10, paddingHorizontal: 10 },
  desc: { color: "#aaa", fontSize: 14, marginTop: 5, paddingHorizontal: 10 },
  loader: { flex: 1, backgroundColor: "#000", justifyContent: "center", alignItems: "center" },
  errorText: { color: "#fff", fontSize: 16, textAlign: "center", marginTop: 10 },
  errorContainer: { paddingHorizontal: 10, marginTop: 10 },
});
