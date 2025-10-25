package com.meehdi.application.usecase

import com.meehdi.domain.event.TodoCompleted
import com.meehdi.domain.model.Todo
import com.meehdi.domain.port.EventPublisher
import com.meehdi.domain.port.TodoRepository
import org.bson.types.ObjectId

class CompleteTodoUseCase(
    private val repository: TodoRepository,
    private val eventPublisher: EventPublisher
) {
    suspend fun execute(id: String, userId: String): Todo? {
        val objectId = try {
            ObjectId(id)
        } catch (e: IllegalArgumentException) {
            return null
        }

        val existingTodo = repository.findById(objectId) ?: return null
        val completedTodo = existingTodo.markAsCompleted()

        val savedTodo = repository.update(completedTodo) ?: return null

        eventPublisher.publish(
            TodoCompleted(
                todoId = savedTodo.id.toHexString(),
                userId = userId
            )
        )

        return savedTodo
    }
}