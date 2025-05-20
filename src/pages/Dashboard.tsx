import { useState } from 'react';
import { useBooks } from '../hooks/useBooks';

const Dashboard = () => {
    const { booksQuery } = useBooks();
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [genreFilter, setGenreFilter] = useState('');

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
                    className="border p-2 rounded w-full md:w-1/3"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="border p-2 rounded"
                >
                    <option value="">All Status</option>
                    <option value="Available">Available</option>
                    <option value="Issued">Issued</option>
                </select>

                <select
                    value={genreFilter}
                    onChange={(e) => setGenreFilter(e.target.value)}
                    className="border p-2 rounded"
                >
                    <option value="">All Genres</option>
                    {[...new Set(books.map((b) => b.genre).filter((g) => g))].map((genre, i) => (
                        <option key={genre+i} value={genre}>
                            {genre}
                        </option>
                    ))}
                </select>

            </div>

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
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {booksQuery.isLoading && <p>Loading...</p>}
            {booksQuery.isError && <p>Error loading books.</p>}
        </div>
    );
};

export default Dashboard;
