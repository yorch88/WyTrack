import { API_URL } from "../shared/apiConfig";
export async function login(email, password) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  let data = null;

  try {
    data = await res.json();
  } catch {
    // 👇 evita crash si no hay JSON
    data = null;
  }

  if (!res.ok) {
    throw new Error(data?.detail || "Login failed");
  }

  return data;
}