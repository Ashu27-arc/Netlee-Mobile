import { useEffect, useRef, useState } from "react";
import { Video, AVPlaybackStatus, ResizeMode } from "expo-av";
import { View, Text, ActivityIndicator, StyleSheet, Dimensions, TouchableOpacity, ScrollView, Image } from "react-native";
import { WebView } from "react-native-webview";
import { API } from "../api/api";
import { useLocalSearchParams, useRouter } from "expo-router";

const { width } = Dimensions.get("window");

export default function Player() {
  const { id, type } = useLocalSearchParams<{ id: string; type?: string }>();
  const router = useRouter();
  const videoRef = useRef<Video>(null);
  const [movie, setMovie] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isLocal = type === "local" || !type; // Default to local if type not specified

  useEffect(() => {
    if (!id) {
      setError("Movie ID is missing");
      setLoading(false);
      return;
    }

    const fetchMovie = async () => {
      try {
        if (isLocal) {
          // Fetch local movie
          const res = await API.get(`/movies/local/${id}`);
          setMovie(res.data);
        } else {
          // Fetch TMDB movie
          const res = await API.get(`/movies/tmdb/${id}`);
          setMovie(res.data);
        }
        setLoading(false);
      } catch (err: any) {
        console.error("Error fetching movie:", err);
        setError("Failed to load movie. Please try again.");
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id, isLocal]);

  const handlePlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (!status.isLoaded) {
      // Error status - handle playback errors
      console.error("Video playback error:", status.error);
      setError("Video playback error. Trying fallback...");
      // Try fallback to videoUrl if hlsUrl fails
      if (movie?.videoUrl && movie?.hlsUrl) {
        videoRef.current?.loadAsync({ uri: movie.videoUrl });
      }
    }
    // Success status - playback is working fine
  };

  const [showTrailer, setShowTrailer] = useState(false);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="red" />
        <Text style={styles.loadingText}>Loading movie...</Text>
      </View>
    );
  }

  if (error && !movie) {
    return (
      <View style={styles.loader}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // TMDB Movie - Show video player with full movie or trailer
  if (!isLocal && movie) {
    const trailerVideo = movie?.videos?.results?.find(
      (v: any) => v.type === "Trailer" && v.site === "YouTube"
    );
    const backdropUrl = movie.backdrop_path
      ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
      : null;

    // Check if full movie is available
    const fullMovieUrl = movie?.fullMovieHlsUrl || movie?.fullMovieUrl;
    const hasFullMovie = !!(fullMovieUrl && fullMovieUrl.trim() !== "");
    
    // Debug logging
    console.log("🎬 Movie Player Debug:", {
      movieId: id,
      movieTitle: movie?.title,
      hasFullMovieFlag: movie?.hasFullMovie,
      fullMovieUrl: fullMovieUrl || "NOT FOUND",
      fullMovieHlsUrl: movie?.fullMovieHlsUrl || "NOT FOUND",
      fullMovieUrlDirect: movie?.fullMovieUrl || "NOT FOUND",
      calculatedHasFullMovie: hasFullMovie,
      trailerAvailable: !!trailerVideo
    });

    // If full movie is available and user wants to watch, show video player
    if (showTrailer && hasFullMovie) {
      return (
        <View style={styles.container}>
          <TouchableOpacity 
            style={styles.closeButton} 
            onPress={() => setShowTrailer(false)}
          >
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>

          <Video
            ref={videoRef}
            style={styles.video}
            source={{ uri: fullMovieUrl }}
            useNativeControls
            shouldPlay
            resizeMode={ResizeMode.CONTAIN}
            onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
            onError={(error) => {
              console.error("Video error:", error);
              setError("Failed to play video");
            }}
          />

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <View style={styles.videoInfo}>
            <Text style={styles.videoTitle}>{movie.title}</Text>
            <TouchableOpacity 
              style={styles.infoButton} 
              onPress={() => setShowTrailer(false)}
            >
              <Text style={styles.infoButtonText}>View Details</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    // If trailer is available and user wants to watch, show YouTube player
    if (showTrailer && trailerVideo) {
      const youtubeEmbedUrl = `https://www.youtube.com/embed/${trailerVideo.key}?autoplay=1&playsinline=1&controls=1&rel=0`;
      
      return (
        <View style={styles.container}>
          <TouchableOpacity 
            style={styles.closeButton} 
            onPress={() => setShowTrailer(false)}
          >
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>

          <WebView
            source={{ uri: youtubeEmbedUrl }}
            style={styles.webView}
            allowsFullscreenVideo={true}
            mediaPlaybackRequiresUserAction={false}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={true}
            renderLoading={() => (
              <View style={styles.webViewLoader}>
                <ActivityIndicator size="large" color="red" />
              </View>
            )}
          />

          <View style={styles.videoInfo}>
            <Text style={styles.videoTitle}>{movie.title}</Text>
            <TouchableOpacity 
              style={styles.infoButton} 
              onPress={() => setShowTrailer(false)}
            >
              <Text style={styles.infoButtonText}>View Details</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    // Show movie details with play button
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>

        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          {backdropUrl && (
            <Image source={{ uri: backdropUrl }} style={styles.backdrop} />
          )}

          <View style={styles.tmdbContent}>
            <Text style={styles.title}>{movie.title}</Text>

            <View style={styles.metaInfo}>
              {movie.release_date && (
                <Text style={styles.metaText}>
                  📅 {new Date(movie.release_date).getFullYear()}
                </Text>
              )}
              {movie.runtime && (
                <Text style={styles.metaText}>⏱️ {movie.runtime} min</Text>
              )}
              {movie.vote_average && (
                <Text style={styles.metaText}>
                  ⭐ {movie.vote_average.toFixed(1)}/10
                </Text>
              )}
            </View>

            {movie.genres && movie.genres.length > 0 && (
              <View style={styles.genresContainer}>
                {movie.genres.map((genre: any) => (
                  <View key={genre.id} style={styles.genreTag}>
                    <Text style={styles.genreText}>{genre.name}</Text>
                  </View>
                ))}
              </View>
            )}

            {movie.overview && (
              <Text style={styles.desc}>{movie.overview}</Text>
            )}

            {/* Show Play Full Movie button if available, otherwise Play Trailer */}
            <View style={styles.buttonContainer}>
              {hasFullMovie ? (
                <TouchableOpacity 
                  style={styles.fullMovieButton} 
                  onPress={() => {
                    console.log("✅ Play Full Movie pressed, URL:", fullMovieUrl);
                    setShowTrailer(true);
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={styles.fullMovieButtonText}>▶️ Play Full Movie</Text>
                </TouchableOpacity>
              ) : trailerVideo ? (
                <TouchableOpacity 
                  style={styles.trailerButton} 
                  onPress={() => setShowTrailer(true)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.trailerButtonText}>▶️ Play Trailer</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.noTrailerContainer}>
                  <Text style={styles.noTrailerText}>Video not available</Text>
                </View>
              )}
            </View>
            
            {/* Debug info - remove in production */}
            {__DEV__ && (
              <View style={styles.debugContainer}>
                <Text style={styles.debugText}>
                  Debug: hasFullMovie={hasFullMovie ? "YES" : "NO"} | 
                  URL={fullMovieUrl ? "EXISTS" : "MISSING"}
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    );
  }

  // Local Movie - Video Player
  const videoUri = movie?.hlsUrl || movie?.videoUrl;

  if (!videoUri) {
    return (
      <View style={styles.loader}>
        <Text style={styles.errorText}>No video URL available</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
        <Text style={styles.closeButtonText}>✕</Text>
      </TouchableOpacity>

      <Video
        ref={videoRef}
        style={styles.video}
        source={{ uri: videoUri }}
        useNativeControls
        shouldPlay
        resizeMode={ResizeMode.CONTAIN}
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

      <ScrollView style={styles.movieInfo}>
        <Text style={styles.title}>{movie?.title}</Text>
        {movie?.description && (
          <Text style={styles.desc}>{movie?.description}</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    backgroundColor: "#000", 
    flex: 1,
    paddingTop: 45,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  closeButton: {
    position: "absolute",
    top: 45,
    right: 15,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  video: { 
    width: width, 
    height: width * 0.5625, // 16:9 aspect ratio
    backgroundColor: "#111" 
  },
  webView: {
    flex: 1,
    backgroundColor: "#000",
  },
  webViewLoader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  videoInfo: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.8)",
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  videoTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
    marginRight: 10,
  },
  infoButton: {
    backgroundColor: "#e50914",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  infoButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  backdrop: {
    width: width,
    height: 250,
    resizeMode: "cover",
  },
  tmdbContent: {
    padding: 15,
  },
  title: { 
    color: "#fff", 
    fontSize: 24, 
    fontWeight: "700", 
    marginTop: 10,
    marginBottom: 10,
  },
  metaInfo: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 15,
    marginBottom: 15,
  },
  metaText: {
    color: "#aaa",
    fontSize: 14,
  },
  genresContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 15,
  },
  genreTag: {
    backgroundColor: "#e50914",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  genreText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  desc: { 
    color: "#aaa", 
    fontSize: 14, 
    marginTop: 5,
    lineHeight: 22,
  },
  trailerButton: {
    backgroundColor: "#e50914",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 20,
    alignItems: "center",
  },
  trailerButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  fullMovieButton: {
    backgroundColor: "#28a745",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 20,
    alignItems: "center",
  },
  fullMovieButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  noTrailerContainer: {
    backgroundColor: "#333",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 20,
    alignItems: "center",
  },
  noTrailerText: {
    color: "#aaa",
    fontSize: 16,
  },
  movieInfo: {
    maxHeight: 200,
    paddingHorizontal: 10,
  },
  loader: { 
    flex: 1, 
    backgroundColor: "#000", 
    justifyContent: "center", 
    alignItems: "center" 
  },
  loadingText: {
    color: "#fff",
    marginTop: 10,
    fontSize: 16,
  },
  errorText: { 
    color: "#fff", 
    fontSize: 16, 
    textAlign: "center", 
    marginTop: 10,
    paddingHorizontal: 20,
  },
  errorContainer: { 
    paddingHorizontal: 10, 
    marginTop: 10 
  },
  backButton: {
    backgroundColor: "#e50914",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 20,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  debugContainer: {
    backgroundColor: "rgba(255, 255, 0, 0.1)",
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
    marginHorizontal: 15,
  },
  debugText: {
    color: "#ff0",
    fontSize: 12,
    fontFamily: "monospace",
  },
});
