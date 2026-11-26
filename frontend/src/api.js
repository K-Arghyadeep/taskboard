const BASE_URL = "http://localhost:8000/api/tasks/";

async function request(path = "", options = {}) {
  const response = await fetch(BASE_URL + path, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  if (response.status === 204) {
    return null;
  }
  return response.json();
}

export const getTasks = () => request();

export const createTask = (title) =>
  request("", { method: "POST", body: JSON.stringify({ title }) });

export const updateTask = (id, changes) =>
  request(`${id}/`, { method: "PATCH", body: JSON.stringify(changes) });

export const deleteTask = (id) => request(`${id}/`, { method: "DELETE" });