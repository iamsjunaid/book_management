// useBooks.ts

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchBooks, addBook, updateBook, deleteBook } from "../api/books";
import type { Book } from "../types/book";

export const useBooks = () => {
  const queryClient = useQueryClient();

  // ✅ 1. Query for fetching books
  const booksQuery = useQuery<Book[]>({
    queryKey: ["books"],
    queryFn: fetchBooks,
  });

  // ✅ 2. Mutation for adding a book
  const addBookMutation = useMutation({
    mutationFn: (newBook: Omit<Book, "id">) => addBook(newBook),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
  });

  // ✅ 3. Mutation for updating a book
  const updateBookMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Book> }) =>
      updateBook(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
  });

  // ✅ 4. Mutation for deleting a book
  const deleteBookMutation = useMutation({
    mutationFn: (id: string) => deleteBook(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
  });

  return {
    booksQuery,
    addBookMutation,
    updateBookMutation,
    deleteBookMutation,
  };
};
