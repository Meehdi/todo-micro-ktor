package com.meehdi.infrastructure.adapter.persistence

import com.meehdi.domain.model.Notification
import com.meehdi.domain.port.NotificationRepository
import com.mongodb.client.model.Filters
import com.mongodb.client.model.Updates
import com.mongodb.kotlin.client.coroutine.MongoCollection
import com.mongodb.kotlin.client.coroutine.MongoDatabase
import kotlinx.coroutines.flow.firstOrNull
import kotlinx.coroutines.flow.toList

class MongoNotificationRepository(
    database: MongoDatabase,
    collectionName: String
) : NotificationRepository {

    private val collection: MongoCollection<Notification> =
        database.getCollection(collectionName)

    override suspend fun save(notification: Notification): Notification {
        collection.insertOne(notification)
        return notification
    }

    override suspend fun findById(id: String): Notification? {
        return collection.find(Filters.eq("_id", id)).firstOrNull()
    }

    override suspend fun findByUserId(userId: String): List<Notification> {
        return collection.find(Filters.eq("userId", userId)).toList()
    }

    override suspend fun markAsRead(id: String): Boolean {
        val result = collection.updateOne(
            Filters.eq("_id", id),
            Updates.set("read", true)
        )
        return result.modifiedCount > 0
    }

    override suspend fun deleteById(id: String): Boolean {
        val result = collection.deleteOne(Filters.eq("_id", id))
        return result.deletedCount > 0
    }
}