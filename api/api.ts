import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Live Backend URL (Deployed on Render)
const API = axios.create({
    baseURL: "https://netlee-backend.onrender.com/api",
    timeout: 10000,
});

// Auto attach Auth Token
API.interceptors.request.use(async (config) => {
    const token = await AsyncStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// Add response interceptor for better error handling
API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.code === 'ECONNABORTED' || error.code === 'ECONNRESET') {
            console.error('❌ Connection Error: Cannot reach backend server');
            console.error('Make sure:');
            console.error('1. Backend server is running (npm start in Netlee-Backend)');
            console.error('2. Your phone and computer are on the same WiFi network');
            console.error('3. The IP address in api.ts matches your computer IP');
        } else if (error.response) {
            console.error('API Error:', error.response.data);
        } else {
            console.error('Network Error:', error.message);
        }
        return Promise.reject(error);
    }
);

export { API };
