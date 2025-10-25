package com.meehdi.infrastructure.adapter.http.mapper

import com.meehdi.domain.model.Todo
import com.meehdi.infrastructure.adapter.http.dto.TodoResponse

object TodoMapper {
    fun toResponse(todo: Todo): TodoResponse {
        return TodoResponse(
            id = todo.id.toHexString(),
            title = todo.title,
            description = todo.description,
            completed = todo.completed,
            createdAt = todo.createdAt.toString(),
            updatedAt = todo.updatedAt.toString()
        )
    }
}
