import { getToken } from "../utils/auth";

export const API_URL = "http://localhost:8080/api";

export const apiRequest = async (
    endpoint,
    options = {}
) => {

    const token = getToken();

    const headers = {
        ...(options.body instanceof FormData
            ? {}
            : {
                "Content-Type": "application/json"
            }),
        ...(options.headers || {})
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(
        `${API_URL}${endpoint}`,
        {
            ...options,
            headers
        }
    );

    const text = await response.text();

    let data = null;

    try {
        data = text ? JSON.parse(text) : null;
    } catch {
        data = text;
    }

    if (!response.ok) {

        const message =
            data &&
            typeof data === "object" &&
            (data.message || data.error)
                ? data.message || data.error
                : typeof data === "string" && data
                ? data
                : `Request failed with status ${response.status}`;

        const error = new Error(message);

        error.status = response.status;
        error.data = data;

        throw error;
    }

    return data;
};