import axiosPublic from "../api/axiosPublic";

export const getBooks = async () => {
  const res = await axiosPublic.get("/books");
  return res.data;
};
