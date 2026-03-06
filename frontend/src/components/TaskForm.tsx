import React, { useEffect } from 'react';
import { useForm } from 'react-form'; // Wait, I meant react-hook-form
import { useForm as useHookForm } from 'react-hook-form';
import { Task, TaskInput, TaskStatus } from '../types/task';
import { X } from 'lucide-react';

interface TaskFormProps {
    task?: Task | null;
    onSubmit: (data: TaskInput) => Promise<void>;
    onClose: () => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({ task, onSubmit, onClose }) => {
    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useHookForm<TaskInput>({
        defaultValues: {
            title: task?.title || '',
            description: task?.description || '',
            status: task?.status || TaskStatus.TODO,
            dueDate: task?.dueDate || ''
        }
    });

    useEffect(() => {
        if (task) {
            reset({
                title: task.title,
                description: task.description,
                status: task.status,
                dueDate: task.dueDate
            });
        }
    }, [task, reset]);

    const handleFormSubmit = async (data: TaskInput) => {
        // Ensure empty string is converted to null for dueDate if needed, or leave it
        if (data.dueDate === '') data.dueDate = null;
        await onSubmit(data);
        reset();
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <h2 className="text-xl font-semibold text-gray-800">
                        {task ? 'Edit Task' : 'New Task'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-100"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                        <input
                            {...register('title', {
                                required: 'Title is required',
                                maxLength: { value: 100, message: 'Max 100 characters' }
                            })}
                            className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all ${errors.title ? 'border-red-500' : 'border-gray-200'}`}
                            placeholder="What needs to be done?"
                        />
                        {errors.title && <span className="text-red-500 text-xs mt-1 block">{errors.title.message}</span>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            {...register('description', {
                                maxLength: { value: 500, message: 'Max 500 characters' }
                            })}
                            className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none h-24 ${errors.description ? 'border-red-500' : 'border-gray-200'}`}
                            placeholder="Add some details..."
                        />
                        {errors.description && <span className="text-red-500 text-xs mt-1 block">{errors.description.message}</span>}
                    </div>

                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <select
                                {...register('status')}
                                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none appearance-none bg-white"
                            >
                                <option value={TaskStatus.TODO}>To Do</option>
                                <option value={TaskStatus.IN_PROGRESS}>In Progress</option>
                                <option value={TaskStatus.DONE}>Done</option>
                            </select>
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                            <input
                                type="date"
                                {...register('dueDate')}
                                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 rounded-xl font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-5 py-2.5 rounded-xl font-medium text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 transition-colors disabled:opacity-70 flex items-center gap-2 shadow-md shadow-indigo-600/20"
                        >
                            {isSubmitting ? 'Saving...' : 'Save Task'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
