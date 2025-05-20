import axios from "axios";
import type { Book } from "../types/book";

const API_URL = "http://localhost:3001/books"; // replace with actual URL

export const fetchBooks = async (): Promise<Book[]> => {
  const res = await axios.get(API_URL);
  return res.data;
};

export const addBook = async (book: Omit<Book, "id">): Promise<Book> => {
  const res = await axios.post(API_URL, book);
  return res.data;
};

export const updateBook = async (
  id: string,
  book: Partial<Book>
): Promise<Book> => {
  const res = await axios.put(`${API_URL}/${id}`, book);
  return res.data;
};

export const deleteBook = async (id: string): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};
