import api from "./api";

export const createUserInDB = (user) => {
  return api.post("/api/users", user);
};

export const getUserRole = (token) => {
  return api.get("/api/users/role", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
