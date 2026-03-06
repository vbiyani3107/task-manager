import axios from 'axios';
import { Task, TaskInput } from '../types/task';

const API_URL = 'http://localhost:8081/api/tasks';

export const taskApi = {
    getAll: async (): Promise<Task[]> => {
        const response = await axios.get(API_URL);
        return response.data;
    },

    getById: async (id: number): Promise<Task> => {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    },

    create: async (task: TaskInput): Promise<Task> => {
        const response = await axios.post(API_URL, task);
        return response.data;
    },

    update: async (id: number, task: TaskInput): Promise<Task> => {
        const response = await axios.put(`${API_URL}/${id}`, task);
        return response.data;
    },

    delete: async (id: number): Promise<void> => {
        await axios.delete(`${API_URL}/${id}`);
    }
};
