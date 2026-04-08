import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TaskForm } from './components/TaskForm';

describe('TaskForm', () => {
    it('renders new task form correctly', () => {
        render(<TaskForm onSubmit={vi.fn()} onClose={vi.fn()} />);
        expect(screen.getByText('New Task')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('What needs to be done?')).toBeInTheDocument();
    });

    it('requires title fields and restricts blank submission', async () => {
        const mockSubmit = vi.fn();
        render(<TaskForm onSubmit={mockSubmit} onClose={vi.fn()} />);
        
        fireEvent.click(screen.getByText('Save Task'));
        
        await waitFor(() => {
            expect(screen.getByText('Title is required')).toBeInTheDocument();
        });
        expect(mockSubmit).not.toHaveBeenCalled();
    });

    it('calls onSubmit with correct data on successful fill', async () => {
        const mockSubmit = vi.fn();
        render(<TaskForm onSubmit={mockSubmit} onClose={vi.fn()} />);
        
        fireEvent.change(screen.getByPlaceholderText('What needs to be done?'), { target: { value: 'Buy groceries' } });
        fireEvent.change(screen.getByPlaceholderText('Add some details...'), { target: { value: 'Milk and eggs' } });
        
        fireEvent.click(screen.getByText('Save Task'));
        
        await waitFor(() => {
            expect(mockSubmit).toHaveBeenCalledTimes(1);
        });
        
        expect(mockSubmit).toHaveBeenCalledWith(expect.objectContaining({
            title: 'Buy groceries',
            description: 'Milk and eggs'
        }));
    });
});
