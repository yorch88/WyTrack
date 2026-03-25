import { API_URL } from "../shared/apiConfig";
import { getAuthHeaders } from "../shared/authHeaders";

export async function getTickets({ page = 1, limit = 10, ...filters } = {}) {
  const query = new URLSearchParams({
    ...filters,
    page,
    limit,
  }).toString();

  const res = await fetch(`${API_URL}/tickets?${query}`, {
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    throw new Error("Failed to fetch tickets");
  }

  return await res.json();
}

export async function createTicket(payload) {
  const res = await fetch(`${API_URL}/tickets/`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.detail || "Failed to create ticket");
  }

  return data;
}