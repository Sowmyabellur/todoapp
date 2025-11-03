'use client';

import { AddTodoForm } from './components/AddTodoForm'; 
import { ErrorMessage } from './components/ErrorMessage';
import { Header } from './components/Header';
import { LoadingSpinner } from './components/LoadingSpinner';
import { TodoList } from './components/TodoList';
import { authClient } from '@/lib/auth-client';
import { addTodo,deleteTodo,updateTodo,getTodos } from '../services/api';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

const App = () => {
    const router = useRouter();
    const { isPending, data: session } = authClient.useSession();
    const [todos, setTodos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchTodos = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const fetchedTodos = await getTodos();
            setTodos(fetchedTodos);
        } catch (err) {
            setError(
                'Failed to fetch todos. Please make sure the backend server is running.'
            );
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!isPending && session) {
            fetchTodos();
        }
    }, [fetchTodos, isPending, session]);

    const handleAddTodo = useCallback(async title => {
        try {
            const newTodo = await addTodo(title);
            setTodos(prevTodos => [...prevTodos, newTodo]);
        } catch (err) {
            setError('Failed to add todo.');
            console.error(err);
        }
    }, []);

    const handleToggleComplete = useCallback(async (id, completed) => {
        try {
            const updatedTodo = await updateTodo(id, { completed });
            setTodos(prevTodos =>
                prevTodos.map(todo => (todo.id === id ? updatedTodo : todo))
            );
        } catch (err) {
            setError('Failed to update todo status.');
            console.error(err);
        }
    }, []);

    const handleUpdateTitle = useCallback(async (id, title) => {
        try {
            const updatedTodo = await updateTodo(id, { title });
            setTodos(prevTodos =>
                prevTodos.map(todo => (todo.id === id ? updatedTodo : todo))
            );
        } catch (err) {
            setError('Failed to update todo title.');
            console.error(err);
        }
    }, []);

    const handleDeleteTodo = useCallback(async id => {
        try {
            await deleteTodo(id);
            setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
        } catch (err) {
            setError('Failed to delete todo.');
            console.error(err);
        }
    }, []);

    const handleLogout = async () => {
        try {
            await authClient.signOut({ callbackURL: '/login' });
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    if (isPending) return <LoadingSpinner />;

    if (!session)
        return (
            <div className='min-h-screen flex items-center justify-center'>
                <button
                    onClick={() => router.push('/login')}
                    className='bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700'
                >
                    Login
                </button>
            </div>
        );

    return (
        <div className='min-h-screen font-sans text-gray-800'>
            <main className='container mx-auto px-4 py-8 md:py-12'>
                <div className='max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl shadow-gray-200/50 overflow-hidden'>
                    <div className='p-6 md:p-8'>
                        <Header />
                        <div className='flex justify-between items-center mb-4'>
                            <div>
                                <p className='font-medium'>
                                    User: {session?.user?.name ?? 'Unknown'}
                                </p>
                                <p className='text-sm text-gray-600'>
                                    Email: {session?.user?.email ?? 'Unknown'}
                                </p>
                            </div>
                            <button
                                onClick={handleLogout}
                                className='bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700'
                            >
                                Logout
                            </button>
                        </div>
                        <AddTodoForm onAdd={handleAddTodo} />
                        <div className='mt-6'>
                            {loading && <LoadingSpinner />}
                            {error && <ErrorMessage message={error} />}
                            {!loading && !error && (
                                <TodoList
                                    todos={todos}
                                    onToggleComplete={handleToggleComplete}
                                    onUpdateTitle={handleUpdateTitle}
                                    onDelete={handleDeleteTodo}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default App;