const API_BASE_URL = "http://localhost:5000/api";

export const submitSupportRequest = async (data) => {
  const response = await fetch(`${API_BASE_URL}/support`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response.json();
};

export const registerVolunteer = async (data) => {
  const response = await fetch(`${API_BASE_URL}/volunteer`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response.json();
};
