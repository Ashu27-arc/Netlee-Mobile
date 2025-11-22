import { View, TextInput, StyleSheet } from "react-native";

export default function SearchBar({ value, onChange }: any) {
    return (
        <View style={styles.container}>
            <TextInput
                placeholder="Search movies..."
                placeholderTextColor="#888"
                style={styles.input}
                value={value}
                onChangeText={onChange}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { marginVertical: 10 },
    input: {
        backgroundColor: "#111",
        padding: 12,
        borderRadius: 8,
        fontSize: 16,
        color: "#fff",
    },
});
