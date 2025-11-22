import { useContext, useEffect, useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import { API } from "../api/api";
import { useRouter } from "expo-router";
import * as Linking from "expo-linking";

export default function Login() {
    const router = useRouter();
    const { login } = useContext(AuthContext);

    const [form, setForm] = useState({ email: "", password: "" });

    const submit = async () => {
        try {
            const { data } = await API.post("/auth/login", form);
            login(data);
            router.replace("/");
        } catch (err: any) {
            Alert.alert("Login Failed", err?.response?.data?.message || "Try again!");
        }
    };

    const googleLogin = () => {
        Linking.openURL("http://localhost:5000/api/auth/google");
    };

    useEffect(() => {
        const sub = Linking.addEventListener("url", (event) => {
            const token = event.url.split("token=")[1];
            if (!token) return;

            API.get("/auth/profile", {
                headers: { Authorization: `Bearer ${token}` },
            }).then((res) => {
                login({ token, user: res.data });
                router.replace("/");
            });
        });

        return () => {
            sub.remove();
        };
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sign In</Text>

            <TextInput
                placeholder="Email"
                placeholderTextColor="#777"
                style={styles.input}
                onChangeText={(v) => setForm({ ...form, email: v })}
            />

            <TextInput
                placeholder="Password"
                placeholderTextColor="#777"
                secureTextEntry
                style={styles.input}
                onChangeText={(v) => setForm({ ...form, password: v })}
            />

            <TouchableOpacity style={styles.primaryBtn} onPress={submit}>
                <Text style={styles.btnText}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.googleBtn} onPress={googleLogin}>
                <Text style={styles.btnText}>Login with Google</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push("/register")}>
                <Text style={styles.link}>New here? Create account</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { backgroundColor: "#000", flex: 1, justifyContent: "center", alignItems: "center" },
    title: { fontSize: 32, fontWeight: "700", color: "#fff", marginBottom: 30 },
    input: {
        width: "80%",
        backgroundColor: "#222",
        padding: 14,
        borderRadius: 8,
        color: "#fff",
        marginBottom: 14,
    },
    primaryBtn: { width: "80%", backgroundColor: "#E50914", padding: 14, borderRadius: 8 },
    googleBtn: { width: "80%", backgroundColor: "#0077FF", padding: 14, borderRadius: 8, marginTop: 10 },
    btnText: { color: "#fff", fontWeight: "700", textAlign: "center" },
    link: { marginTop: 20, color: "#aaa" },
});
