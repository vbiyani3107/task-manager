export enum TaskStatus {
    TODO = 'TODO',
    IN_PROGRESS = 'IN_PROGRESS',
    DONE = 'DONE'
}

export interface Task {
    id: number;
    title: string;
    description: string;
    status: TaskStatus;
    dueDate: string | null;
}

export interface TaskInput {
    title: string;
    description: string;
    status: TaskStatus;
    dueDate: string | null;
}
