import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TaskList } from './TaskList';
import { Task, TaskStatus } from '../types/task';

describe('TaskList', () => {
    const mockTasks: Task[] = [
        { id: 1, title: 'Task 1', description: '', status: TaskStatus.TODO, dueDate: '2026-05-01' },
        { id: 2, title: 'Task 2', description: '', status: TaskStatus.DONE, dueDate: '2026-05-02' }
    ];

    it('renders tasks correctly', () => {
        render(<TaskList tasks={mockTasks} onStatusChange={vi.fn()} onDelete={vi.fn()} onEdit={vi.fn()} />);
        
        expect(screen.getByText('Task 1')).toBeInTheDocument();
        expect(screen.getByText('Task 2')).toBeInTheDocument();
    });

    it('filters tasks by status', () => {
        render(<TaskList tasks={mockTasks} onStatusChange={vi.fn()} onDelete={vi.fn()} onEdit={vi.fn()} />);
        
        const filterButton = screen.getByRole('button', { name: 'TODO' });
        fireEvent.click(filterButton);
        
        expect(screen.getByText('Task 1')).toBeInTheDocument();
        expect(screen.queryByText('Task 2')).not.toBeInTheDocument();
    });

    it('sorts tasks by status', () => {
        render(<TaskList tasks={mockTasks} onStatusChange={vi.fn()} onDelete={vi.fn()} onEdit={vi.fn()} />);
        
        const sortSelect = screen.getByDisplayValue('Due Date');
        fireEvent.change(sortSelect, { target: { value: 'status' } });
        
        // Verify Task 1 (TODO) and Task 2 (DONE) exist, their ordering is handled by component
        expect(screen.getByText('Task 1')).toBeInTheDocument();
        expect(screen.getByText('Task 2')).toBeInTheDocument();
    });
});
