import React, { useState } from 'react';
import { fetchBooks, addBook, updateBook, deleteBook } from '../api/books';
import type { Book } from '../types/book';

const TestApi = () => {
  const [result, setResult] = useState<Book[] | null>(null);

  const handleTest = async () => {
    try {
      const books = await fetchBooks();
      setResult(books); // display on UI
      console.log('Books:', books);

      const newBook = await addBook({
        title: '1984',
        author: 'George Orwell',
        genre: 'Dystopian',
        publishedYear: 1949,
        status: 'Available',
      });
      console.log('Added Book:', newBook);

      const updatedBook = await updateBook(newBook.id, { status: 'Issued' });
      console.log('Updated Book:', updatedBook);

      await deleteBook(newBook.id);
      console.log('Deleted Book:', newBook.id);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-4">
      <button
        onClick={handleTest}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
      >
        Run API Test
      </button>

      <pre className="bg-gray-100 p-4 rounded overflow-x-auto">
        {result ? JSON.stringify(result, null, 2) : 'Click to run test'}
      </pre>
    </div>
  );
};

export default TestApi;
