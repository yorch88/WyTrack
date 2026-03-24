import { API_URL } from "../shared/apiConfig";
import { getAuthHeaders } from "../shared/authHeaders";


export async function searchUsers(query) {
  const res = await fetch(`${API_URL}/users/users?search=${query}`, {
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    throw new Error("Failed to fetch users");
  }

  return await res.json();
}