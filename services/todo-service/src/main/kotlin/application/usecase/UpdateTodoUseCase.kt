package com.meehdi.application.usecase

import com.meehdi.domain.event.TodoUpdated
import com.meehdi.domain.model.Todo
import com.meehdi.domain.port.EventPublisher
import com.meehdi.domain.port.TodoRepository
import org.bson.types.ObjectId

class UpdateTodoUseCase(
    private val repository: TodoRepository,
    private val eventPublisher: EventPublisher
) {
    suspend fun execute(id: String, title: String?, description: String?, userId: String): Todo? {
        val objectId = try {
            ObjectId(id)
        } catch (e: IllegalArgumentException) {
            return null
        }

        val existingTodo = repository.findById(objectId) ?: return null
        val updatedTodo = existingTodo.update(title, description)

        val savedTodo = repository.update(updatedTodo) ?: return null

        eventPublisher.publish(
            TodoUpdated(
                todoId = savedTodo.id.toHexString(),
                userId = userId,
                title = savedTodo.title,
                description = savedTodo.description
            )
        )

        return savedTodo
    }
}