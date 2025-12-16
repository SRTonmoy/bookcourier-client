import axiosPublic from "../api/axiosPublic";

export const getBooks = async () => {
  const res = await axiosPublic.get("/api/books");
  return res.data;
};
