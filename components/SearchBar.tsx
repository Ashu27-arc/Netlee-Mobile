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
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="search"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { 
        marginVertical: 10,
        marginHorizontal: 0,
        width: "100%",
    },
    input: {
        backgroundColor: "#1a1a1a",
        padding: 15,
        borderRadius: 10,
        fontSize: 16,
        color: "#fff",
        borderWidth: 1,
        borderColor: "#333",
        width: "100%",
    },
});
