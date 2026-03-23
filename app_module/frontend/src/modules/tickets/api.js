import { API_URL } from "../shared/apiConfig";
import { getAuthHeaders } from "../shared/authHeaders";

export async function createTicket(payload) {
  const res = await fetch(`${API_URL}/tickets/`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Failed to create ticket");
  }

  return await res.json();
}

export async function getTickets() {
  const res = await fetch(`${API_URL}/tickets`, {
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    throw new Error("Failed to fetch tickets");
  }

  return await res.json();
}