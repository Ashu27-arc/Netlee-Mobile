import { TouchableOpacity, Image, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function MovieCard({ movie, local }: any) {
    const router = useRouter();

    const handlePress = () => {
        if (local) {
            // Local movie - use _id
            router.push(`/player?id=${movie._id}&type=local`);
        } else {
            // TMDB movie - use id
            router.push(`/player?id=${movie.id}&type=tmdb`);
        }
    };

    return (
        <TouchableOpacity onPress={handlePress}>
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
