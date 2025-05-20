import { useForm } from 'react-hook-form';
import type { Book } from '../types/book';

interface BookModalProps {
    initialData?: Partial<Book>;
    onSubmit: (data: Omit<Book, 'id'>) => void;
    onClose: () => void;
}

const BookModal: React.FC<BookModalProps> = ({ initialData, onSubmit, onClose }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Omit<Book, 'id'>>({
        defaultValues: {
            title: initialData?.title || '',
            author: initialData?.author || '',
            genre: initialData?.genre || '',
            publishedYear: initialData?.publishedYear || new Date().getFullYear(),
            status: initialData?.status || 'Available',
        },
    });

    const submitForm = (data: Omit<Book, 'id'>) => {
        onSubmit(data);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded w-full max-w-md shadow-lg">
                <h2 className="text-xl font-bold mb-4">{initialData ? 'Edit Book' : 'Add Book'}</h2>

                <form onSubmit={handleSubmit(submitForm)} className="space-y-4">
                    <div>
                        <label>Title</label>
                        <input
                            {...register('title', { required: true })}
                            className="border p-2 w-full rounded"
                        />
                        {errors.title && <span className="text-red-500 text-sm">Title is required</span>}
                    </div>

                    <div>
                        <label>Author</label>
                        <input
                            {...register('author', { required: true })}
                            className="border p-2 w-full rounded"
                        />
                        {errors.author && <span className="text-red-500 text-sm">Author is required</span>}
                    </div>

                    <div>
                        <label>Genre</label>
                        <input
                            {...register('genre', { required: true })}
                            className="border p-2 w-full rounded"
                        />
                        {errors.genre && <span className="text-red-500 text-sm">Genre is required</span>}
                    </div>

                    <div>
                        <label>Published Year</label>
                        <input
                            type="number"
                            {...register('publishedYear', { required: true })}
                            className="border p-2 w-full rounded"
                        />
                        {errors.publishedYear && (
                            <span className="text-red-500 text-sm">Year is required</span>
                        )}
                    </div>

                    <div>
                        <label>Status</label>
                        <select {...register('status')} className="border p-2 w-full rounded">
                            <option value="Available">Available</option>
                            <option value="Issued">Issued</option>
                        </select>
                    </div>

                    <div className="flex justify-end gap-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded border">
                            Cancel
                        </button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
                            {initialData ? 'Update' : 'Add'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BookModal;
