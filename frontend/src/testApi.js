import axios from "axios";

const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export async function testBackendConnection() {
  try {
    const response = await axios.get(`${API}/api/test`);
    console.log("✅ Backend connection successful:", response.data);
  } catch (error) {
    console.error("❌ Backend connection failed:", error.message);
  }
}
