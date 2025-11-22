import { useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { AuthContext } from "../context/AuthContext";
import { useRouter } from "expo-router";

export default function Profile() {
  const router = useRouter();
  const { user, logout } = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>

      <Text style={styles.label}>Name: {user?.name}</Text>
      <Text style={styles.label}>Email: {user?.email}</Text>

      <TouchableOpacity
        onPress={() => router.push("/mylist")}
        style={styles.myListBtn}
      >
        <Text style={styles.btnText}>My List ❤️</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.logoutBtn}
        onPress={() => {
          logout();
          router.replace("/login");
        }}
      >
        <Text style={styles.btnText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: "#000", flex: 1, padding: 20 },
  title: { color: "#fff", fontSize: 26, fontWeight: "700", marginBottom: 20 },
  label: { color: "#bbb", fontSize: 16, marginVertical: 4 },
  myListBtn: {
    backgroundColor: "#E50914",
    padding: 12,
    marginTop: 20,
    borderRadius: 8,
  },
  logoutBtn: {
    backgroundColor: "#111",
    padding: 12,
    marginTop: 20,
    borderRadius: 8,
  },
  btnText: { textAlign: "center", color: "#fff", fontSize: 16, fontWeight: "700" },
});
