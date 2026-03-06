import React, { useState, useEffect } from 'react';
import { TaskList } from './components/TaskList';
import { TaskForm } from './components/TaskForm';
import { Task, TaskInput, TaskStatus } from './types/task';
import { taskApi } from './api/api';
import { Plus, LayoutList, AlertCircle } from 'lucide-react';

function App() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const data = await taskApi.getAll();
            setTasks(data);
            setError(null);
        } catch (err) {
            setError('Failed to load tasks. Please ensure the backend is running.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const handleCreateTask = async (taskInput: TaskInput) => {
        try {
            const newTask = await taskApi.create(taskInput);
            setTasks((prev) => [...prev, newTask]);
            setIsFormOpen(false);
            setError(null);
        } catch (err: any) {
            console.error(err);
            throw new Error(err.response?.data?.message || 'Failed to create task');
        }
    };

    const handleUpdateTask = async (taskInput: TaskInput) => {
        if (!editingTask) return;
        try {
            const updatedTask = await taskApi.update(editingTask.id, taskInput);
            setTasks((prev) => prev.map((t) => t.id === updatedTask.id ? updatedTask : t));
            setEditingTask(null);
            setIsFormOpen(false);
            setError(null);
        } catch (err: any) {
            console.error(err);
            throw new Error(err.response?.data?.message || 'Failed to update task');
        }
    };

    const handleDeleteTask = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this task?')) return;
        try {
            await taskApi.delete(id);
            setTasks((prev) => prev.filter((t) => t.id !== id));
            setError(null);
        } catch (err) {
            setError('Failed to delete task.');
            console.error(err);
        }
    };

    const handleStatusChange = async (id: number, status: TaskStatus) => {
        const task = tasks.find(t => t.id === id);
        if (!task) return;

        try {
            const updatedTask = await taskApi.update(id, { ...task, status });
            setTasks((prev) => prev.map((t) => t.id === updatedTask.id ? updatedTask : t));
            setError(null);
        } catch (err) {
            setError('Failed to update task status.');
            console.error(err);
        }
    };

    const openNewTaskForm = () => {
        setEditingTask(null);
        setIsFormOpen(true);
    };

    const openEditTaskForm = (task: Task) => {
        setEditingTask(task);
        setIsFormOpen(true);
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] text-gray-800 font-sans selection:bg-indigo-100 selection:text-indigo-900 pb-20">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm shadow-indigo-900/5">
                <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-indigo-600 text-white p-2.5 rounded-xl shadow-md shadow-indigo-600/30">
                            <LayoutList size={24} strokeWidth={2.5} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">TaskFlow</h1>
                            <p className="text-xs font-semibold tracking-wider text-indigo-600 uppercase">Agentic AI Project</p>
                        </div>
                    </div>
                    <button
                        onClick={openNewTaskForm}
                        className="bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-md shadow-indigo-600/20 hover:shadow-lg hover:-translate-y-0.5"
                    >
                        <Plus size={20} strokeWidth={3} />
                        <span className="hidden sm:inline">New Task</span>
                    </button>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-6 mt-10">
                <div className="mb-10 flex flex-col items-center text-center">
                    <h2 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Stay organized, <span className="text-indigo-600">stay focused.</span></h2>
                    <p className="text-gray-500 max-w-xl text-lg">Manage your daily tasks and productivity seamlessly. Grouped, filtered, and intuitively designed.</p>
                </div>

                {error && (
                    <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 text-red-800 shadow-sm animate-in fade-in slide-in-from-top-4">
                        <AlertCircle className="shrink-0 mt-0.5" size={20} />
                        <div>
                            <h4 className="font-bold">Error</h4>
                            <p className="text-sm opacity-90">{error}</p>
                        </div>
                    </div>
                )}

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                        <p className="text-gray-500 font-medium animate-pulse">Loading your tasks...</p>
                    </div>
                ) : (
                    <TaskList
                        tasks={tasks}
                        onEdit={openEditTaskForm}
                        onDelete={handleDeleteTask}
                        onStatusChange={handleStatusChange}
                    />
                )}
            </main>

            {isFormOpen && (
                <TaskForm
                    task={editingTask}
                    onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
                    onClose={() => setIsFormOpen(false)}
                />
            )}
        </div>
    );
}

export default App;
