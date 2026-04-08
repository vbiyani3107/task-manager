package com.example.taskmanager_backend.service;

import com.example.taskmanager_backend.entity.Task;
import com.example.taskmanager_backend.entity.TaskStatus;
import com.example.taskmanager_backend.exception.ResourceNotFoundException;
import com.example.taskmanager_backend.repository.TaskRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class TaskServiceTest {

    @Mock
    private TaskRepository taskRepository;

    @InjectMocks
    private TaskService taskService;

    private Task task1;
    private Task task2;

    @BeforeEach
    void setUp() {
        task1 = new Task("Test Task 1", "Description 1", TaskStatus.TODO, LocalDate.now());
        task1.setId(1L);

        task2 = new Task("Test Task 2", "Description 2", TaskStatus.IN_PROGRESS, LocalDate.now().plusDays(1));
        task2.setId(2L);
    }

    @Test
    void testGetAllTasks() {
        when(taskRepository.findAll()).thenReturn(Arrays.asList(task1, task2));

        List<Task> tasks = taskService.getAllTasks();

        assertEquals(2, tasks.size());
        assertEquals("Test Task 1", tasks.get(0).getTitle());
        assertEquals(TaskStatus.TODO, tasks.get(0).getStatus());
        assertEquals("Test Task 2", tasks.get(1).getTitle());
        assertEquals(TaskStatus.IN_PROGRESS, tasks.get(1).getStatus());
        verify(taskRepository, times(1)).findAll();
    }

    @Test
    void testGetTaskById_Success() {
        when(taskRepository.findById(1L)).thenReturn(Optional.of(task1));

        Task found = taskService.getTaskById(1L);

        assertNotNull(found);
        assertEquals("Test Task 1", found.getTitle());
    }

    @Test
    void testGetTaskById_NotFound() {
        when(taskRepository.findById(3L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> taskService.getTaskById(3L));
    }

    @Test
    void testCreateTask() {
        when(taskRepository.save(any(Task.class))).thenReturn(task1);

        Task created = taskService.createTask(task1);

        assertNotNull(created);
        assertEquals(1L, created.getId());
        assertEquals("Test Task 1", created.getTitle());
        assertEquals("Description 1", created.getDescription());
        assertEquals(TaskStatus.TODO, created.getStatus());
        verify(taskRepository, times(1)).save(task1);
    }

    @Test
    void testUpdateTask() {
        when(taskRepository.findById(1L)).thenReturn(Optional.of(task1));
        when(taskRepository.save(any(Task.class))).thenReturn(task1);

        Task updateDetails = new Task("Updated Title", "Updated Desc", TaskStatus.DONE, LocalDate.now());
        Task updatedTask = taskService.updateTask(1L, updateDetails);

        assertEquals("Updated Title", updatedTask.getTitle());
        assertEquals(TaskStatus.DONE, updatedTask.getStatus());
        verify(taskRepository, times(1)).save(task1);
    }

    @Test
    void testDeleteTask() {
        when(taskRepository.findById(1L)).thenReturn(Optional.of(task1));
        doNothing().when(taskRepository).delete(task1);

        taskService.deleteTask(1L);

        verify(taskRepository, times(1)).delete(task1);
    }
}
