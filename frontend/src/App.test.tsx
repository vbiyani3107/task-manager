import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import App from './App';
import { taskApi } from './api/api';
import { Task } from './types/task';
import { TaskStatus } from './types/task';

vi.mock('./api/api', () => ({
    taskApi: {
        getAll: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn()
    }
}));

describe('App', () => {
    it('renders header and fetches tasks', async () => {
        const mockTasks: Task[] = [
            { id: 1, title: 'Test Task', description: 'Test Desc', status: TaskStatus.TODO, dueDate: '2026-05-01' }
        ];
        
        // Setup mock return
        vi.mocked(taskApi.getAll).mockResolvedValue(mockTasks);

        render(<App />);

        expect(screen.getByText('TaskFlow')).toBeInTheDocument();
        expect(screen.getByText('Loading your tasks...')).toBeInTheDocument();

        // Wait for tasks to load
        await waitFor(() => {
            expect(screen.getByText('Test Task')).toBeInTheDocument();
        });
    });
});
