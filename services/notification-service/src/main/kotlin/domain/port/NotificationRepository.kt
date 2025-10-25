package com.meehdi.domain.port

import com.meehdi.domain.model.Notification

interface NotificationRepository {
    suspend fun save(notification: Notification): Notification
    suspend fun findById(id: String): Notification?
    suspend fun findByUserId(userId: String): List<Notification>
    suspend fun markAsRead(id: String): Boolean
    suspend fun deleteById(id: String): Boolean
}
