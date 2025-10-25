package com.meehdi

import com.meehdi.infrastructure.adapter.http.dto.ErrorResponse
import com.meehdi.infrastructure.adapter.http.route.todoRoutes
import com.meehdi.infrastructure.di.DependencyContainer
import io.ktor.http.*
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.application.*
import io.ktor.server.engine.*
import io.ktor.server.netty.*
import io.ktor.server.plugins.callid.*
import io.ktor.server.plugins.calllogging.*
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.server.plugins.cors.routing.*
import io.ktor.server.plugins.defaultheaders.*
import io.ktor.server.plugins.statuspages.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import kotlinx.serialization.json.Json
import org.slf4j.event.Level

fun main() {
    embeddedServer(
        Netty,
        port = System.getenv("PORT")?.toIntOrNull() ?: 8080,
        host = "0.0.0.0",
        module = Application::module
    ).start(wait = true)
}

fun Application.module() {
    val mongoUri = environment.config.property("mongodb.uri").getString()
    val mongoDatabase = environment.config.property("mongodb.database").getString()
    val kafkaBootstrapServers = environment.config.property("kafka.bootstrap-servers").getString()

    val container = DependencyContainer(mongoUri, mongoDatabase, kafkaBootstrapServers)

    // Shutdown hook
    monitor.subscribe(ApplicationStopped) {
        container.close()
    }

    configurePlugins()
    configureRouting(container)
}

fun Application.configurePlugins() {
    install(ContentNegotiation) {
        json(Json {
            prettyPrint = true
            isLenient = true
            ignoreUnknownKeys = true
        })
    }

    install(StatusPages) {
        exception<Throwable> { call, cause ->
            call.application.log.error("Unhandled exception", cause)
            call.respond(
                HttpStatusCode.InternalServerError,
                ErrorResponse("Internal server error: ${cause.message}")
            )
        }
    }

    install(CallLogging) {
        level = Level.INFO
        filter { call -> call.request.path().startsWith("/") }
    }

    install(CallId) {
        header(HttpHeaders.XRequestId)
        generate {
            java.util.UUID.randomUUID().toString()
        }
        verify { callId: String ->
            callId.isNotEmpty()
        }
    }

    install(DefaultHeaders) {
        header("X-Service", "todo-service")
    }

    install(CORS) {
        anyHost()
        allowHeader(HttpHeaders.ContentType)
        allowMethod(HttpMethod.Get)
        allowMethod(HttpMethod.Post)
        allowMethod(HttpMethod.Put)
        allowMethod(HttpMethod.Delete)
        allowMethod(HttpMethod.Patch)
    }
}

fun Application.configureRouting(container: DependencyContainer) {
    routing {
        get("/health") {
            call.respond(mapOf("status" to "UP"))
        }

        todoRoutes(
            createTodoUseCase = container.createTodoUseCase,
            getAllTodosUseCase = container.getAllTodosUseCase,
            getTodoByIdUseCase = container.getTodoByIdUseCase,
            updateTodoUseCase = container.updateTodoUseCase,
            completeTodoUseCase = container.completeTodoUseCase,
            deleteTodoUseCase = container.deleteTodoUseCase
        )
    }
}