import { TouchableOpacity, Image, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function MovieCard({ movie, local }: any) {
    const router = useRouter();

    return (
        <TouchableOpacity
            onPress={() => local && router.push(`/player?id=${movie._id}`)}
        >
            <Image
                style={styles.img}
                source={{
                    uri: local
                        ? movie.thumbnail
                        : `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
                }}
            />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    img: {
        width: 130,
        height: 190,
        borderRadius: 10,
        marginRight: 10,
    },
});
