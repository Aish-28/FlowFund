import { API_URL } from "./api";

export const loginUser = async (
    email,
    password
) => {

    const response = await fetch(
        `${API_URL}/users/login`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                email,
                password
            })
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message ||
            data.error ||
            "Login failed"
        );
    }

    return data;
};


export const registerUser = async (
    userData
) => {

    const response = await fetch(
        `${API_URL}/users/register`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(userData)
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message ||
            data.error ||
            "Registration failed"
        );
    }

    return data;
};