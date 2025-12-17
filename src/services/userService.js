import api from "./api";

export const getAllUsers = () =>
  api.get("/api/users");

export const updateUserRole = (email, role) =>
  api.patch(`/api/users/role/${email}`, { role });
