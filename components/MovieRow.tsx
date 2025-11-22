import { ScrollView, View, Text, StyleSheet } from "react-native";
import MovieCard from "./MovieCard";

export default function MovieRow({ title, movies, local }: any) {
    return (
        <View style={{ marginVertical: 12 }}>
            <Text style={styles.title}>{title}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {movies.map((m: any) => (
                    <MovieCard key={m._id || m.id} movie={m} local={local} />
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    title: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 6,
        paddingLeft: 5,
    },
});
