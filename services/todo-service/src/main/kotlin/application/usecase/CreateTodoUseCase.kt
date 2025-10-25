package com.meehdi.application.usecase

import com.meehdi.domain.event.TodoCreated
import com.meehdi.domain.model.Todo
import com.meehdi.domain.port.EventPublisher
import com.meehdi.domain.port.TodoRepository

class CreateTodoUseCase(
    private val repository: TodoRepository,
    private val eventPublisher: EventPublisher
) {
    suspend fun execute(title: String, description: String?, userId: String): Todo {
        val todo = Todo(
            title = title,
            description = description
        )

        val savedTodo = repository.save(todo)

        eventPublisher.publish(
            TodoCreated(
                todoId = savedTodo.id.toHexString(),
                userId = userId,
                title = savedTodo.title,
                description = savedTodo.description
            )
        )

        return savedTodo
    }
}