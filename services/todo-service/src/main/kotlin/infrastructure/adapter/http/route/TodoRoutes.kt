package com.meehdi.infrastructure.adapter.http.route

import com.meehdi.application.usecase.*
import com.meehdi.infrastructure.adapter.http.dto.CreateTodoRequest
import com.meehdi.infrastructure.adapter.http.dto.UpdateTodoRequest
import com.meehdi.infrastructure.adapter.http.mapper.TodoMapper
import com.meehdi.infrastructure.adapter.http.dto.ErrorResponse
import io.ktor.http.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

fun Route.todoRoutes(
    createTodoUseCase: CreateTodoUseCase,
    getAllTodosUseCase: GetAllTodosUseCase,
    getTodoByIdUseCase: GetTodoByIdUseCase,
    updateTodoUseCase: UpdateTodoUseCase,
    completeTodoUseCase: CompleteTodoUseCase,
    deleteTodoUseCase: DeleteTodoUseCase
) {
    route("/todos") {

        post {
            val request = call.receive<CreateTodoRequest>()

            if (request.title.isBlank()) {
                call.respond(HttpStatusCode.BadRequest, ErrorResponse("Title cannot be empty"))
                return@post
            }

            val userId = "default-user"
            val todo = createTodoUseCase.execute(request.title, request.description, userId)
            call.respond(HttpStatusCode.Created, TodoMapper.toResponse(todo))
        }

        get {
            val todos = getAllTodosUseCase.execute()
            call.respond(todos.map { TodoMapper.toResponse(it) })
        }

        get("/{id}") {
            val id = call.parameters["id"] ?: run {
                call.respond(HttpStatusCode.BadRequest, ErrorResponse("Missing id parameter"))
                return@get
            }

            val todo = getTodoByIdUseCase.execute(id)
            if (todo != null) {
                call.respond(TodoMapper.toResponse(todo))
            } else {
                call.respond(HttpStatusCode.NotFound, ErrorResponse("Todo not found"))
            }
        }

        put("/{id}") {
            val id = call.parameters["id"] ?: run {
                call.respond(HttpStatusCode.BadRequest, ErrorResponse("Missing id parameter"))
                return@put
            }

            val request = call.receive<UpdateTodoRequest>()
            val userId = "default-user"

            val todo = updateTodoUseCase.execute(id, request.title, request.description, userId)
            if (todo != null) {
                call.respond(TodoMapper.toResponse(todo))
            } else {
                call.respond(HttpStatusCode.NotFound, ErrorResponse("Todo not found"))
            }
        }

        patch("/{id}/complete") {
            val id = call.parameters["id"] ?: run {
                call.respond(HttpStatusCode.BadRequest, ErrorResponse("Missing id parameter"))
                return@patch
            }

            val userId = "default-user"
            val todo = completeTodoUseCase.execute(id, userId)
            if (todo != null) {
                call.respond(TodoMapper.toResponse(todo))
            } else {
                call.respond(HttpStatusCode.NotFound, ErrorResponse("Todo not found"))
            }
        }

        delete("/{id}") {
            val id = call.parameters["id"] ?: run {
                call.respond(HttpStatusCode.BadRequest, ErrorResponse("Missing id parameter"))
                return@delete
            }

            val userId = "default-user"
            val deleted = deleteTodoUseCase.execute(id, userId)
            if (deleted) {
                call.respond(HttpStatusCode.NoContent)
            } else {
                call.respond(HttpStatusCode.NotFound, ErrorResponse("Todo not found"))
            }
        }
    }
}