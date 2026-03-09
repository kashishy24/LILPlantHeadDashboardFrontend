const BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;
// console.log("BASE_URL", BASE_URL);

// AUTH ENDPOINTS
export const endpoints = {
  FETCH_USERNAME_API: BASE_URL + "/login/username",
  LOGIN_API: BASE_URL + "/login/Userlogin",
}