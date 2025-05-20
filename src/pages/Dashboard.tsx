import { useState } from 'react';
import { toast } from 'react-toastify';

import BookModal from '../components/BookModal';
import { useBooks } from '../hooks/useBooks';
import type { Book } from '../types/book';


const Dashboard = () => {
    const { booksQuery } = useBooks();
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [genreFilter, setGenreFilter] = useState('');

    const [showModal, setShowModal] = useState(false);
    const [editBook, setEditBook] = useState<Book | null>(null);
    const [bookToDelete, setBookToDelete] = useState<Book | null>(null);

    const { addBookMutation, updateBookMutation, deleteBookMutation } = useBooks();

    const handleAddBook = (data: Omit<Book, 'id'>) => {
        addBookMutation.mutate(data);
    };

    const handleEditBook = (data: Omit<Book, 'id'>) => {
        if (editBook) {
            updateBookMutation.mutate({ id: editBook.id, data });
            setEditBook(null);
        }
    };

    const confirmDelete = () => {
        if (bookToDelete) {
            deleteBookMutation.mutate(bookToDelete.id, {
                onSuccess: () => toast.success('Book deleted successfully'),
                onError: () => toast.error('Failed to delete book'),
            });
            setBookToDelete(null);
        }
    };

    const books = booksQuery.data || [];

    const filteredBooks = books.filter((book) => {
        const title = book.title || '';
        const author = book.author || '';
        const matchesSearch =
            title.toLowerCase().includes(search.toLowerCase()) ||
            author.toLowerCase().includes(search.toLowerCase());

        const matchesStatus = statusFilter ? book.status === statusFilter : true;
        const matchesGenre = genreFilter ? book.genre === genreFilter : true;

        return matchesSearch && matchesStatus && matchesGenre;
    });


    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Book Dashboard</h1>

            {/* 🔍 Search & Filters */}
            <div className="flex flex-wrap gap-4 mb-4">
                <input
                    type="text"
                    placeholder="Search by title or author"
                    className="border rounded w-full px-2 md:w-1/3"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="border px-2 rounded"
                >
                    <option value="">All Status</option>
                    <option value="Available">Available</option>
                    <option value="Issued">Issued</option>
                </select>

                <select
                    value={genreFilter}
                    onChange={(e) => setGenreFilter(e.target.value)}
                    className="border px-2 rounded"
                >
                    <option value="">All Genres</option>
                    {[...new Set(books.map((b) => b.genre).filter((g) => g))].map((genre, i) => (
                        <option key={genre + i} value={genre}>
                            {genre}
                        </option>
                    ))}
                </select>

                <div className="ml-auto">
                    <button
                        onClick={() => setShowModal(true)}
                        className="p-2 bg-green-600 text-white rounded"
                    >
                        + Add Book
                    </button>
                </div>

            </div>

            {/* 📚 Book Modal */}
            {showModal && (
                <BookModal
                    initialData={editBook || undefined}
                    onSubmit={editBook ? handleEditBook : handleAddBook}
                    onClose={() => {
                        setShowModal(false);
                        setEditBook(null);
                    }}
                />
            )}


            {/* 📋 Book List Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full border rounded">
                    <thead>
                        <tr className="bg-gray-100 text-left">
                            <th className="p-2">Title</th>
                            <th className="p-2">Author</th>
                            <th className="p-2">Genre</th>
                            <th className="p-2">Published</th>
                            <th className="p-2">Status</th>
                            <th className="p-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredBooks.map((book) => (
                            <tr key={book.id} className="border-t">
                                <td className="p-2">{book.title}</td>
                                <td className="p-2">{book.author}</td>
                                <td className="p-2">{book.genre}</td>
                                <td className="p-2">{book.publishedYear}</td>
                                <td className="p-2">{book.status}</td>
                                <td className="p-2">
                                    <button
                                        onClick={() => {
                                            setEditBook(book);
                                            setShowModal(true);
                                        }}
                                        className="text-blue-600 underline"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => setBookToDelete(book)}
                                        className="text-red-600 ml-2 underline"
                                    >
                                        Delete
                                    </button>
                                </td>

                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {bookToDelete && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded shadow-md">
                        <p className="mb-4">
                            Are you sure you want to delete <strong>{bookToDelete.title}</strong>?
                        </p>
                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={() => setBookToDelete(null)}
                                className="px-4 py-2 border rounded"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-4 py-2 bg-red-600 text-white rounded"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {booksQuery.isLoading && (
                <div className="flex justify-center items-center py-10">
                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                </div>
            )}

            {booksQuery.isError && <p>Error loading books.</p>}
        </div>
    );
};

export default Dashboard;
