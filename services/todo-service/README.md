# Todo Service

A microservice for managing todos built with Ktor, MongoDB, and Kafka following hexagonal architecture.

## Project Organization

This project follows **Hexagonal Architecture** (Ports and Adapters) with clear separation between:
- **Domain layer** - Core business logic and entities (no external dependencies)
- **Application layer** - Use cases orchestrating domain operations
- **Infrastructure layer** - Adapters for external concerns (database, messaging, HTTP)

Dependencies flow inward: Infrastructure → Application → Domain

## Prerequisites

- Java 25+
- Gradle 9.1+
- Docker & Docker Compose (optional)
- MongoDB running on `localhost:27017`
- Kafka running on `localhost:9092`

## Configuration

### Environment Variables

Copy the example environment file and configure your values:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```bash
# Server Configuration
PORT=8080
HOST=0.0.0.0

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017
MONGODB_DATABASE=todo_db
MONGODB_COLLECTION=todos

# Kafka Configuration
KAFKA_BOOTSTRAP_SERVERS=localhost:9092
KAFKA_TOPIC=todo-events
KAFKA_GROUP_ID=todo-service
KAFKA_CLIENT_ID=todo-producer
```

### Application Configuration

The service uses `src/main/resources/application.yaml` for base configuration:
```yaml
ktor:
    application:
        modules:
            - com.meehdi.ApplicationKt.module
    deployment:
        port: ${PORT:8080}
        host: ${HOST:0.0.0.0}

mongodb:
    uri: ${MONGODB_URI:mongodb://localhost:27017}
    database: ${MONGODB_DATABASE:todo_db}
    collection: ${MONGODB_COLLECTION:todos}

kafka:
    bootstrap-servers: ${KAFKA_BOOTSTRAP_SERVERS:localhost:9092}
    topic: ${KAFKA_TOPIC:todo-events}
    group-id: ${KAFKA_GROUP_ID:todo-service}
    client-id: ${KAFKA_CLIENT_ID:todo-producer}
```

## Running the Service

### Local Development
```bash
./gradlew run
```

### Docker

**Build the image:**
```bash
docker build -t todo-service .
```

**Run with environment variables:**
```bash
docker run -p 8080:8080 \
  --env-file .env \
  todo-service
```

**Or with Docker Compose:**
```bash
docker-compose up
```

Service will start on port `8080`.

## API Endpoints

- `POST /todos` - Create a new todo
- `GET /todos` - Get all todos
- `GET /todos/{id}` - Get todo by ID
- `PUT /todos/{id}` - Update todo
- `PATCH /todos/{id}/complete` - Mark todo as completed
- `DELETE /todos/{id}` - Delete todo
- `GET /health` - Health check

## Kafka Events

The service publishes events to the configured Kafka topic:
- `todo.created` - When a new todo is created
- `todo.updated` - When a todo is updated
- `todo.completed` - When a todo is marked as completed
- `todo.deleted` - When a todo is deleted

## Example Requests

**Create Todo:**
```bash
curl -X POST http://localhost:8080/todos \
  -H "Content-Type: application/json" \
  -d '{"title": "Learn Ktor", "description": "Build microservices"}'
```

**Get All Todos:**
```bash
curl http://localhost:8080/todos
```

**Get Todo by ID:**
```bash
curl http://localhost:8080/todos/{id}
```

**Update Todo:**
```bash
curl -X PUT http://localhost:8080/todos/{id} \
  -H "Content-Type: application/json" \
  -d '{"title": "Learn Ktor Advanced", "description": "Build production-ready microservices"}'
```

**Complete Todo:**
```bash
curl -X PATCH http://localhost:8080/todos/{id}/complete
```

**Delete Todo:**
```bash
curl -X DELETE http://localhost:8080/todos/{id}
```

**Health Check:**
```bash
curl http://localhost:8080/health
```

## Development

### Technology Stack

- **Ktor 3.3.1** - Web framework
- **Kotlin 2.2.20** - Programming language
- **MongoDB 5.6.1** - Database (Kotlin Coroutine Driver)
- **Kafka 4.1.0** - Event streaming
- **Gradle 9.1** - Build tool

### Project Structure
```
src/
├── main/
│   ├── kotlin/com/meehdi/
│   │   ├── domain/          # Domain entities and ports
│   │   ├── application/     # Use cases
│   │   ├── infrastructure/  # Adapters (HTTP, MongoDB, Kafka)
│   │   └── Application.kt   # Main application
│   └── resources/
│       └── application.yaml # Configuration
└── test/                    # Tests
```

## Security Notes

- Never commit `.env` file to version control
- Use `.env.example` as a template
- In production, use proper secrets management (Vault, AWS Secrets Manager, etc.)