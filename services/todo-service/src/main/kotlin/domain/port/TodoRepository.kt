package com.meehdi.domain.port

import com.meehdi.domain.model.Todo
import org.bson.types.ObjectId

interface TodoRepository {
    suspend fun save(todo: Todo): Todo
    suspend fun findById(id: ObjectId): Todo?
    suspend fun findAll(): List<Todo>
    suspend fun update(todo: Todo): Todo?
    suspend fun deleteById(id: ObjectId): Boolean
}
