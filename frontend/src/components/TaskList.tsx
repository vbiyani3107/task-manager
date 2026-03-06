import React, { useState, useMemo } from 'react';
import { Task, TaskStatus } from '../types/task';
import { CheckCircle2, Circle, Clock, MoreVertical, Edit2, Trash2, Calendar } from 'lucide-react';
import { format, parseISO } from 'date-fns';

interface TaskListProps {
    tasks: Task[];
    onEdit: (task: Task) => void;
    onDelete: (id: number) => void;
    onStatusChange: (id: number, status: TaskStatus) => void;
}

export const TaskList: React.FC<TaskListProps> = ({ tasks, onEdit, onDelete, onStatusChange }) => {
    const [filter, setFilter] = useState<TaskStatus | 'ALL'>('ALL');
    const [sortBy, setSortBy] = useState<'DUE_DATE' | 'STATUS'>('DUE_DATE');

    const filteredAndSortedTasks = useMemo(() => {
        let result = tasks;
        if (filter !== 'ALL') {
            result = result.filter(t => t.status === filter);
        }

        return result.sort((a, b) => {
            if (sortBy === 'DUE_DATE') {
                if (!a.dueDate) return 1;
                if (!b.dueDate) return -1;
                return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
            } else {
                const statusOrder = { [TaskStatus.TODO]: 1, [TaskStatus.IN_PROGRESS]: 2, [TaskStatus.DONE]: 3 };
                return statusOrder[a.status] - statusOrder[b.status];
            }
        });
    }, [tasks, filter, sortBy]);

    const getStatusColor = (status: TaskStatus) => {
        switch (status) {
            case TaskStatus.TODO: return 'bg-gray-100 text-gray-700';
            case TaskStatus.IN_PROGRESS: return 'bg-blue-100 text-blue-700';
            case TaskStatus.DONE: return 'bg-green-100 text-green-700';
        }
    };

    const getStatusIcon = (status: TaskStatus) => {
        switch (status) {
            case TaskStatus.TODO: return <Circle size={18} className="text-gray-400" />;
            case TaskStatus.IN_PROGRESS: return <Clock size={18} className="text-blue-500" />;
            case TaskStatus.DONE: return <CheckCircle2 size={18} className="text-green-500" />;
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex gap-2">
                    {(['ALL', TaskStatus.TODO, TaskStatus.IN_PROGRESS, TaskStatus.DONE] as const).map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === f ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
                        >
                            {f === 'ALL' ? 'All Tasks' : f.replace('_', ' ')}
                        </button>
                    ))}
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500 font-medium">Sort by:</span>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        className="bg-gray-50 border-none text-sm rounded-xl px-4 py-2 text-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none font-medium cursor-pointer"
                    >
                        <option value="DUE_DATE">Due Date</option>
                        <option value="STATUS">Status</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAndSortedTasks.map(task => (
                    <div key={task.id} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col group">
                        <div className="flex justify-between items-start mb-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 w-max ${getStatusColor(task.status)}`}>
                                {getStatusIcon(task.status)}
                                {task.status.replace('_', ' ')}
                            </span>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => onEdit(task)} className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                                    <Edit2 size={16} />
                                </button>
                                <button onClick={() => onDelete(task.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>

                        <h3 className={`text-lg font-bold mb-2 line-clamp-2 ${task.status === TaskStatus.DONE ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
                            {task.title}
                        </h3>

                        <p className={`text-sm mb-6 flex-1 line-clamp-3 ${task.status === TaskStatus.DONE ? 'text-gray-400' : 'text-gray-600'}`}>
                            {task.description || <span className="italic opacity-50">No description provided</span>}
                        </p>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-50 mt-auto">
                            <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                                <Calendar size={14} />
                                {task.dueDate ? format(parseISO(task.dueDate), 'MMM d, yyyy') : 'No due date'}
                            </div>

                            {task.status !== TaskStatus.DONE && (
                                <button
                                    onClick={() => onStatusChange(task.id, task.status === TaskStatus.TODO ? TaskStatus.IN_PROGRESS : TaskStatus.DONE)}
                                    className="text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors"
                                >
                                    {task.status === TaskStatus.TODO ? 'START' : 'COMPLETE'}
                                </button>
                            )}
                        </div>
                    </div>
                ))}

                {filteredAndSortedTasks.length === 0 && (
                    <div className="col-span-full py-16 flex flex-col items-center justify-center text-center bg-white rounded-3xl border border-dashed border-gray-300">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-400">
                            <CheckCircle2 size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-800 mb-2">No tasks found</h3>
                        <p className="text-gray-500 text-sm max-w-sm">
                            {filter === 'ALL' ? "You don't have any tasks yet. Keep it up!" : `No tasks found with status ${filter.replace('_', ' ')}.`}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};
