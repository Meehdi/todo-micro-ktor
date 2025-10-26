package com.meehdi.infrastructure.adapter.persistence

import com.mongodb.client.model.Filters
import com.mongodb.client.model.ReplaceOptions
import com.mongodb.kotlin.client.coroutine.MongoDatabase
import com.meehdi.domain.model.Todo
import com.meehdi.domain.port.TodoRepository
import kotlinx.coroutines.flow.firstOrNull
import kotlinx.coroutines.flow.toList
import org.bson.types.ObjectId

class MongoTodoRepository(
    database: MongoDatabase
) : TodoRepository {

    private val collection = database.getCollection<Todo>("todos")

    override suspend fun save(todo: Todo): Todo {
        collection.insertOne(todo)
        return todo
    }

    override suspend fun findById(id: ObjectId): Todo? {
        return collection.find(Filters.eq("id", id)).firstOrNull()
    }

    override suspend fun findAll(): List<Todo> {
        return collection.find().toList()
    }

    override suspend fun update(todo: Todo): Todo? {
        val result = collection.replaceOne(
            Filters.eq("id", todo.id),
            todo,
            ReplaceOptions().upsert(false)
        )

        return if (result.matchedCount > 0) todo else null
    }

    override suspend fun deleteById(id: ObjectId): Boolean {
        val result = collection.deleteOne(Filters.eq("id", id))
        return result.deletedCount > 0
    }
}