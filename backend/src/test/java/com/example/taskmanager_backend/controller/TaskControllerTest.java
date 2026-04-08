package com.example.taskmanager_backend.controller;

import com.example.taskmanager_backend.entity.Task;
import com.example.taskmanager_backend.entity.TaskStatus;
import com.example.taskmanager_backend.exception.ResourceNotFoundException;
import com.example.taskmanager_backend.service.TaskService;
import tools.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.Arrays;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(TaskController.class)
public class TaskControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private TaskService taskService;

    @Autowired
    private ObjectMapper objectMapper;

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
    void testGetAllTasks() throws Exception {
        when(taskService.getAllTasks()).thenReturn(Arrays.asList(task1, task2));

        mockMvc.perform(get("/api/tasks"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].title", is("Test Task 1")))
                .andExpect(jsonPath("$[1].title", is("Test Task 2")));
                
        verify(taskService, times(1)).getAllTasks();
    }

    @Test
    void testGetTaskById_Success() throws Exception {
        when(taskService.getTaskById(1L)).thenReturn(task1);

        mockMvc.perform(get("/api/tasks/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title", is("Test Task 1")));
                
        verify(taskService, times(1)).getTaskById(1L);
    }

    @Test
    void testGetTaskById_NotFound() throws Exception {
        when(taskService.getTaskById(3L)).thenThrow(new ResourceNotFoundException("Task not found with id 3"));

        mockMvc.perform(get("/api/tasks/3"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message", is("Task not found with id 3")));
                
        verify(taskService, times(1)).getTaskById(3L);
    }

    @Test
    void testCreateTask_Success() throws Exception {
        when(taskService.createTask(any(Task.class))).thenReturn(task1);

        mockMvc.perform(post("/api/tasks")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(task1)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.title", is("Test Task 1")));
                
        verify(taskService, times(1)).createTask(any(Task.class));
    }

    @Test
    void testCreateTask_ValidationFailure_BlankTitle() throws Exception {
        Task invalidTask = new Task("", "Description", TaskStatus.TODO, null);

        mockMvc.perform(post("/api/tasks")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidTask)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.title", is("Title is required")));
                
        verify(taskService, never()).createTask(any(Task.class));
    }

    @Test
    void testCreateTask_ValidationFailure_SizeExceeded() throws Exception {
        String longTitle = "a".repeat(101);
        Task invalidTask = new Task(longTitle, "Description", TaskStatus.TODO, null);

        mockMvc.perform(post("/api/tasks")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidTask)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.title").exists());
                
        verify(taskService, never()).createTask(any(Task.class));
    }

    @Test
    void testUpdateTask() throws Exception {
        Task updateDetails = new Task("Updated Title", "Updated Desc", TaskStatus.DONE, LocalDate.now());
        Task updatedTask = new Task("Updated Title", "Updated Desc", TaskStatus.DONE, LocalDate.now());
        updatedTask.setId(1L);

        when(taskService.updateTask(eq(1L), any(Task.class))).thenReturn(updatedTask);

        mockMvc.perform(put("/api/tasks/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateDetails)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title", is("Updated Title")))
                .andExpect(jsonPath("$.status", is("DONE")));
                
        verify(taskService, times(1)).updateTask(eq(1L), any(Task.class));
    }

    @Test
    void testDeleteTask() throws Exception {
        doNothing().when(taskService).deleteTask(1L);

        mockMvc.perform(delete("/api/tasks/1"))
                .andExpect(status().isNoContent());
                
        verify(taskService, times(1)).deleteTask(1L);
    }
}
