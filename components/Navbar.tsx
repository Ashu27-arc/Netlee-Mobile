import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
    const router = useRouter();
    const { logout } = useContext(AuthContext);

    const handleLogout = async () => {
        await logout();
        router.replace("/login");
    };

    return (
        <View style={styles.nav}>
            <TouchableOpacity onPress={() => router.push("/")}>
                <Text style={styles.logo}>STREAMNOVA</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleLogout}>
                <Text style={styles.logout}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    nav: {
        width: "100%",
        paddingTop: 50,
        paddingHorizontal: 20,
        position: "absolute",
        top: 0,
        zIndex: 10,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    logo: {
        color: "#E50914",
        fontSize: 28,
        fontWeight: "900",
    },
    logout: {
        color: "#fff",
        fontSize: 16,
        backgroundColor: "#E50914",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
    },
});
