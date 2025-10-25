package com.meehdi.application.usecase

import com.meehdi.domain.model.Todo
import com.meehdi.domain.port.TodoRepository
import org.bson.types.ObjectId

class GetTodoByIdUseCase(
    private val repository: TodoRepository
) {
    suspend fun execute(id: String): Todo? {
        val objectId = try {
            ObjectId(id)
        } catch (e: IllegalArgumentException) {
            return null
        }

        return repository.findById(objectId)
    }
}
