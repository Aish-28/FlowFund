export const getToken = () => {
    return localStorage.getItem("token");
};


export const getUserId = () => {
    return localStorage.getItem("userId");
};


export const getName = () => {
    return localStorage.getItem("name");
};


export const getRole = () => {
    return localStorage.getItem("role");
};


export const isAuthenticated = () => {
    return Boolean(getToken());
};


export const saveAuth = (data) => {

    if (data.token) {
        localStorage.setItem(
            "token",
            data.token
        );
    }

    if (data.userId) {
        localStorage.setItem(
            "userId",
            data.userId
        );
    }

    if (data.name) {
        localStorage.setItem(
            "name",
            data.name
        );
    }

    if (data.role) {
        localStorage.setItem(
            "role",
            data.role
        );
    }
};


export const clearAuth = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("name");
    localStorage.removeItem("role");
};


export const logout = () => {
    clearAuth();
};