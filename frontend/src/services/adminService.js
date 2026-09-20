const API_URL = "http://localhost:8080/api";

export const loginAdmin = async (email, password) => {
    const response = await fetch(`${API_URL}/admins/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Admin login failed");
    }

    return data;
};