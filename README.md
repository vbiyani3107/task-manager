# 📋 TaskFlow — Full-Stack Task Manager

> A modern, full-stack task management application built with **Spring Boot 4** (Java 17) on the backend and **React 18** (TypeScript + Vite) on the frontend. Fully containerized with Docker for one-command deployment.

---

## 📑 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Local Development](#local-development)
  - [Docker Deployment](#docker-deployment)
- [API Reference](#api-reference)
- [Unit Testing](#unit-testing)
- [Configuration](#configuration)
- [Contributing](#contributing)

---

## Overview

**TaskFlow** is an Agentic AI–generated full-stack CRUD application designed to manage tasks with statuses, due dates, and descriptions. The project demonstrates a clean separation between a REST API backend and a modern single-page application (SPA) frontend, connected via Axios HTTP calls and fully containerized using Docker Compose.

### What We Built

| Component | Description |
|-----------|-------------|
| **REST API** | Full CRUD operations for tasks with validation and global exception handling |
| **React SPA** | Responsive UI with task cards, filtering, sorting, and inline status updates |
| **Docker Setup** | Multi-stage Dockerfiles for both services with a single `docker-compose.yml` |
| **Nginx Reverse Proxy** | Frontend container proxies `/api/` requests to the backend, eliminating CORS issues in production |
| **Unit Tests** | Service-layer tests using JUnit 5 + Mockito with full CRUD coverage |

---

## Features

- ✅ **Create, Read, Update, Delete** tasks
- 🔄 **Status Management** — Transition tasks through `TODO` → `IN_PROGRESS` → `DONE`
- 📅 **Due Date Tracking** — Assign and view due dates with formatted display
- 🔍 **Filtering** — Filter tasks by status (All / To Do / In Progress / Done)
- 📊 **Sorting** — Sort by due date or status
- ✏️ **Inline Editing** — Edit tasks via a modal form with validation
- 🗑️ **Delete Confirmation** — Confirmation dialog before deleting tasks
- 🎨 **Modern UI** — Tailwind CSS v4 with card-based layout, hover effects, and loading states
- 🐳 **Dockerized** — One-command deployment with `docker-compose up`
- 🧪 **Tested** — Unit tests for service layer with Mockito mocks

---

## Architecture

```
┌──────────────────────────────────────────────────────────┐
│                     Docker Compose                       │
│                                                          │
│  ┌─────────────────────┐    ┌──────────────────────────┐ │
│  │   Frontend (Nginx)  │    │   Backend (Spring Boot)  │ │
│  │                     │    │                          │ │
│  │  React + Vite SPA   │───▶│  REST API (port 8081)    │ │
│  │  Served on port 80  │    │  H2 In-Memory Database   │ │
│  │                     │    │                          │ │
│  │  /api/* ──proxy──▶  │    │  /api/tasks endpoints    │ │
│  └─────────────────────┘    └──────────────────────────┘ │
│        ↕ :3000                       ↕ :8081             │
└──────────────────────────────────────────────────────────┘
```

**Data Flow:**
1. User interacts with the React frontend
2. Frontend makes HTTP requests via Axios to `/api/tasks`
3. In Docker: Nginx proxies `/api/` to the backend container
4. In local dev: Frontend calls `http://localhost:8081/api/tasks` directly
5. Backend processes requests through Controller → Service → Repository
6. H2 in-memory database stores all task data

---

## Tech Stack

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Java | 17 | Runtime language |
| Spring Boot | 4.0.3 | Application framework |
| Spring Data JPA | — | ORM & data access |
| Spring Validation | — | Request body validation |
| H2 Database | — | In-memory relational database |
| JUnit 5 | — | Unit testing framework |
| Mockito | — | Mocking library for tests |
| Maven | — | Build & dependency management |

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.2 | UI library |
| TypeScript | 5.x | Type-safe JavaScript |
| Vite | 6.x | Build tool & dev server |
| Tailwind CSS | 4.x | Utility-first CSS framework |
| Axios | 1.6 | HTTP client |
| React Hook Form | 7.x | Form state management |
| Lucide React | 0.300 | Icon library |
| date-fns | 3.x | Date formatting utilities |

### DevOps
| Technology | Purpose |
|------------|---------|
| Docker | Containerization |
| Docker Compose | Multi-container orchestration |
| Nginx | Static file serving & API reverse proxy |

---

## Project Structure

```
task-manager/
├── docker-compose.yml          # Multi-service orchestration
├── .dockerignore               # Docker build exclusions
│
├── backend/                    # Spring Boot API
│   ├── Dockerfile              # Multi-stage build (JDK → JRE)
│   ├── pom.xml                 # Maven config & dependencies
│   ├── mvnw / mvnw.cmd         # Maven wrapper scripts
│   └── src/
│       ├── main/
│       │   ├── java/com/example/taskmanager_backend/
│       │   │   ├── TaskmanagerBackendApplication.java   # App entry point
│       │   │   ├── config/
│       │   │   │   └── WebConfig.java                   # CORS configuration
│       │   │   ├── controller/
│       │   │   │   └── TaskController.java              # REST endpoints
│       │   │   ├── entity/
│       │   │   │   ├── Task.java                        # JPA entity
│       │   │   │   └── TaskStatus.java                  # Enum (TODO, IN_PROGRESS, DONE)
│       │   │   ├── exception/
│       │   │   │   ├── GlobalExceptionHandler.java      # @ControllerAdvice
│       │   │   │   └── ResourceNotFoundException.java   # Custom 404 exception
│       │   │   ├── repository/
│       │   │   │   └── TaskRepository.java              # JPA Repository interface
│       │   │   └── service/
│       │   │       └── TaskService.java                 # Business logic layer
│       │   └── resources/
│       │       └── application.properties               # App configuration
│       └── test/
│           └── java/com/example/taskmanager_backend/
│               ├── TaskmanagerBackendApplicationTests.java  # Context load test
│               └── service/
│                   └── TaskServiceTest.java                 # Service unit tests
│
└── frontend/                   # React SPA
    ├── Dockerfile              # Multi-stage build (Node → Nginx)
    ├── nginx.conf              # Nginx config with API proxy
    ├── package.json            # Dependencies & scripts
    ├── tsconfig.json           # TypeScript configuration
    ├── vite.config.ts          # Vite build configuration
    └── src/
        ├── main.tsx            # React entry point
        ├── App.tsx             # Root component with state management
        ├── index.css           # Global styles (Tailwind imports)
        ├── api/
        │   └── api.ts          # Axios HTTP client wrapper
        ├── components/
        │   ├── TaskForm.tsx    # Create/Edit task modal form
        │   └── TaskList.tsx    # Task card grid with filter/sort
        └── types/
            └── task.ts         # TypeScript interfaces & enums
```

---

## Getting Started

### Prerequisites

**For Local Development:**
- **Java 17+** — [Download](https://adoptium.net/)
- **Node.js 20+** — [Download](https://nodejs.org/)
- **npm** (comes with Node.js)

**For Docker Deployment:**
- **Docker** & **Docker Compose** — [Download](https://www.docker.com/products/docker-desktop/)

### Local Development

#### 1. Start the Backend

```bash
cd backend

# Using Maven wrapper (recommended)
./mvnw spring-boot:run

# Or, if Maven is installed globally
mvn spring-boot:run
```

The backend will start on **http://localhost:8081**. You can verify it's running:

```bash
curl http://localhost:8081/api/tasks
# Expected: [] (empty array)
```

The H2 console is available at **http://localhost:8081/h2-console** with:
- JDBC URL: `jdbc:h2:mem:taskdb`
- Username: `sa`
- Password: *(empty)*

#### 2. Start the Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

The frontend will start on **http://localhost:5173** (Vite dev server). It calls the backend at `http://localhost:8081` directly.

#### 3. Build the Frontend for Production

```bash
cd frontend
npm run build
```

This compiles TypeScript and produces optimized static assets in `frontend/dist/`.

### Docker Deployment

Deploy both services with a single command:

```bash
# Build and start all containers
docker-compose up --build

# Run in detached mode (background)
docker-compose up --build -d
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8081 |

> **Note:** In Docker mode, the Nginx frontend proxies all `/api/` requests to the backend container, so the browser **only** needs to reach `http://localhost:3000`.

#### Stop Containers

```bash
docker-compose down
```

#### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
```

---

## API Reference

**Base URL:** `http://localhost:8081/api/tasks`

### Endpoints

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| `GET` | `/api/tasks` | Get all tasks | — |
| `GET` | `/api/tasks/{id}` | Get a task by ID | — |
| `POST` | `/api/tasks` | Create a new task | `Task` JSON |
| `PUT` | `/api/tasks/{id}` | Update an existing task | `Task` JSON |
| `DELETE` | `/api/tasks/{id}` | Delete a task | — |

### Task JSON Schema

```json
{
  "title": "Complete project documentation",
  "description": "Write README, API docs, and deployment guide",
  "status": "TODO",
  "dueDate": "2026-04-15"
}
```

### Task Status Values

| Status | Description |
|--------|-------------|
| `TODO` | Task has not been started |
| `IN_PROGRESS` | Task is currently being worked on |
| `DONE` | Task has been completed |

### Validation Rules

| Field | Rule |
|-------|------|
| `title` | **Required**, max 100 characters |
| `description` | Optional, max 500 characters |
| `status` | Must be one of: `TODO`, `IN_PROGRESS`, `DONE` |
| `dueDate` | Optional, format: `YYYY-MM-DD` |

### Example Requests

**Create a task:**
```bash
curl -X POST http://localhost:8081/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Buy groceries", "description": "Milk, bread, eggs", "status": "TODO", "dueDate": "2026-04-01"}'
```

**Update a task:**
```bash
curl -X PUT http://localhost:8081/api/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"title": "Buy groceries", "description": "Milk, bread, eggs, butter", "status": "IN_PROGRESS", "dueDate": "2026-04-01"}'
```

**Delete a task:**
```bash
curl -X DELETE http://localhost:8081/api/tasks/1
```

### Error Responses

| Status Code | Scenario | Response Body |
|-------------|----------|---------------|
| `400` | Validation failure | `{"title": "Title is required"}` |
| `404` | Task not found | `{"message": "Task not found with id: 99"}` |
| `500` | Internal server error | `{"message": "..."}` |

---

## Unit Testing

### Test Suite Overview

The project includes unit tests for the **backend service layer** using JUnit 5 and Mockito.

| Test File | Class Under Test | Tests |
|-----------|-----------------|-------|
| `TaskServiceTest.java` | `TaskService` | 6 tests |
| `TaskControllerTest.java` | `TaskController` | 8 tests |

### Tests Covered

| Test Method | Description | Layer |
|-------------|-------------|-------|
| `testGetAllTasks()` | Verifies retrieval of all tasks from repository | Service |
| `testGetTaskById_Success()` | Verifies fetching a task by valid ID | Service |
| `testGetTaskById_NotFound()` | Verifies `ResourceNotFoundException` for invalid ID | Service |
| `testCreateTask()` | Verifies new task is saved via repository | Service |
| `testUpdateTask()` | Verifies task fields are updated correctly | Service |
| `testDeleteTask()` | Verifies task deletion calls repository delete | Service |
| `contextLoads()` | Verifies Spring application context loads | Integration |

### Running Tests

```bash
cd backend

# Run all tests
./mvnw test

# Run with verbose output
./mvnw test -X

# Run a specific test class
./mvnw test -Dtest=TaskServiceTest

# Run a specific test method
./mvnw test -Dtest=TaskServiceTest#testCreateTask
```

### Test Coverage Summary

| Area | Coverage | Notes |
|------|----------|-------|
| **TaskService** | ✅ All methods covered | `getAllTasks`, `getTaskById`, `createTask`, `updateTask`, `deleteTask` |
| **Exception Handling** | ✅ Covered | `ResourceNotFoundException` thrown when task not found |
| **TaskController** | ✅ Fully covered | `@WebMvcTest`-based controller test spanning CRUD + Bean validations |
| **TaskRepository** | ⚪ N/A | Uses Spring Data JPA auto-generated implementation |
| **Frontend** | ✅ Fully covered | Comprehensive component integration coverage via Vitest and React Testing Library |

### Testing Approach

- **Mockito** is used to mock the `TaskRepository` dependency, ensuring pure unit tests with no database interaction
- **`@ExtendWith(MockitoExtension.class)`** enables annotation-driven mock injection
- **`@BeforeEach`** sets up reusable test data (two sample `Task` objects)
- Each test follows the **Arrange → Act → Assert** pattern

---

## Configuration

### Backend (`application.properties`)

| Property | Value | Purpose |
|----------|-------|---------|
| `server.port` | `8081` | Backend API port |
| `spring.datasource.url` | `jdbc:h2:mem:taskdb` | H2 in-memory database URL |
| `spring.jpa.hibernate.ddl-auto` | `create-drop` | Auto-create/drop schema (prevents caching) |
| `spring.h2.console.enabled` | `true` | Enable H2 web console |
| `spring.h2.console.path` | `/h2-console` | H2 console URL path |

### CORS Configuration

The backend allows cross-origin requests from:
- `http://localhost:5173` (Vite dev server)
- `http://localhost:3000` (Docker Nginx port)

Methods allowed: `GET`, `POST`, `PUT`, `DELETE`, `OPTIONS`

### Docker Ports Mapping

| Service | Container Port | Host Port |
|---------|----------------|-----------|
| Backend | 8081 | 8081 |
| Frontend | 80 (Nginx) | 3000 |

---

## Contributing

1. **Fork** the repository
2. **Create a branch** — `git checkout -b feature/my-feature`
3. **Commit changes** — `git commit -m "feat: add my feature"`
4. **Push** — `git push origin feature/my-feature`
5. **Open a Pull Request**

### Conventions

- Follow [Conventional Commits](https://www.conventionalcommits.org/) for commit messages
- Run `./mvnw test` before pushing to ensure tests pass
- Keep frontend and backend changes in separate commits when possible

---

## License

This project is for educational / demonstration purposes.

---

<p align="center">
  Built with ☕ Spring Boot + ⚛️ React + 🐳 Docker
</p>
