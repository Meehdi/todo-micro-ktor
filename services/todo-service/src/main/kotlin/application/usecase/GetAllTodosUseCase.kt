package com.meehdi.application.usecase

import com.meehdi.domain.model.Todo
import com.meehdi.domain.port.TodoRepository

class GetAllTodosUseCase(
    private val repository: TodoRepository
) {
    suspend fun execute(): List<Todo> {
        return repository.findAll()
    }
}
