package com.meehdi.application.usecase

import com.meehdi.domain.event.TodoDeleted
import com.meehdi.domain.port.EventPublisher
import com.meehdi.domain.port.TodoRepository
import org.bson.types.ObjectId

class DeleteTodoUseCase(
    private val repository: TodoRepository,
    private val eventPublisher: EventPublisher
) {
    suspend fun execute(id: String): Boolean {
        val objectId = try {
            ObjectId(id)
        } catch (e: IllegalArgumentException) {
            return false
        }

        val deleted = repository.deleteById(objectId)

        if (deleted) {
            eventPublisher.publish(
                TodoDeleted(
                    todoId = id
                )
            )
        }

        return deleted
    }
}
