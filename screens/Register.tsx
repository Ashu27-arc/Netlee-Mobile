import { useContext, useState } from "react";
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

export default function Register() {
  const router = useRouter();
  const { login } = useContext(AuthContext);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const submit = async () => {
    try {
      const { data } = await API.post("/auth/register", form);
      login(data);
      router.replace("/");
    } catch (err: any) {
      Alert.alert("Registration Failed", err?.response?.data?.message || "Try again!");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      <TextInput
        placeholder="Name"
        placeholderTextColor="#777"
        style={styles.input}
        onChangeText={(v) => setForm({ ...form, name: v })}
      />

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
        <Text style={styles.btnText}>Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.link}>Already have an account? Sign in</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: "#000", flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 28, fontWeight: "700", color: "#fff", marginBottom: 24 },
  input: {
    width: "80%",
    backgroundColor: "#222",
    padding: 14,
    borderRadius: 8,
    color: "#fff",
    marginBottom: 14,
  },
  primaryBtn: { width: "80%", backgroundColor: "#E50914", padding: 14, borderRadius: 8 },
  btnText: { color: "#fff", fontWeight: "700", textAlign: "center" },
  link: { marginTop: 20, color: "#aaa" },
});
