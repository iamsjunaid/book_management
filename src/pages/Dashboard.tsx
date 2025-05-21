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

    const [currentPage, setCurrentPage] = useState(1);
    const booksPerPage = 10;

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

    // ⬇️ Pagination logic
    const indexOfLastBook = currentPage * booksPerPage;
    const indexOfFirstBook = indexOfLastBook - booksPerPage;
    const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);

    const totalPages = Math.ceil(filteredBooks.length / booksPerPage);


    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold mb-4">Book Dashboard</h1>
                <div className="ml-auto">
                    <button
                        onClick={() => setShowModal(true)}
                        className="px-2 py-1 bg-blue-400 text-white rounded"
                    >
                       Add a new Book
                    </button>
                </div>
            </div>

            {/* 🔍 Search & Filters */}
            <div className="flex flex-wrap gap-4 mb-4">
                <input
                    type="text"
                    placeholder="Search by title or author"
                    className="border border-gray-200 rounded w-full px-2 py-1 md:w-1/3 bg-white"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="border border-gray-200 px-2 rounded sm:w-64 py-1 bg-white"
                >
                    <option value="">All Status</option>
                    <option value="Available">Available</option>
                    <option value="Issued">Issued</option>
                </select>

                <select
                    value={genreFilter}
                    onChange={(e) => setGenreFilter(e.target.value)}
                    className="border border-gray-200 px-2 rounded sm:w-64 bg-white"
                >
                    <option value="">All Genres</option>
                    {[...new Set(books.map((b) => b.genre).filter((g) => g))].map((genre, i) => (
                        <option key={genre + i} value={genre}>
                            {genre}
                        </option>
                    ))}
                </select>
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
            <div className="overflow-x-auto w-full">
                <table className="min-w-full border border-gray-200 rounded-xl shadow-lg">
                    <thead>
                        <tr className=" text-left bg-white">
                            <th className="p-2 font-semibold">Title</th>
                            <th className="p-2 font-semibold">Author</th>
                            <th className="p-2 font-semibold">Genre</th>
                            <th className="p-2 font-semibold">Published</th>
                            <th className="p-2 font-semibold">Status</th>
                            <th className="p-2 font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentBooks.map((book) => (
                            <tr key={book.id} className="border-t border-gray-200 bg-white hover:bg-gray-100 ">
                                <td className="p-2">{book.title}</td>
                                <td className="p-2 cursor-pointer">{book.author}</td>
                                <td className="p-2">{book.genre}</td>
                                <td className="p-2">{book.publishedYear}</td>
                                <td className="p-2">{book.status}</td>
                                <td className="flex justify-around items-center mt-2">
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

            {/* 📄 Pagination */}
            <div className="flex justify-center mt-4 space-x-2">
                <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                    className="px-3 py-1 border border-gray-200 rounded disabled:opacity-50"
                >
                    Prev
                </button>

                {[...Array(totalPages)].map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`px-3 py-1 border border-gray-200 rounded ${currentPage === i + 1 ? 'bg-blue-600 text-white' : ''
                            }`}
                    >
                        {i + 1}
                    </button>
                ))}

                <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                    className="px-3 py-1 border border-gray-200 rounded disabled:opacity-50"
                >
                    Next
                </button>
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
                                className="px-4 py-1 border rounded"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-4 py-1 bg-red-600 text-white rounded"
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
