package com.meehdi.domain.model

import kotlinx.serialization.Serializable
import org.bson.types.ObjectId

@Serializable
data class Notification(
    val id: String = ObjectId().toHexString(),
    val userId: String,
    val type: NotificationType,
    val title: String,
    val message: String,
    val todoId: String? = null,
    val read: Boolean = false,
    val sentAt: Long = System.currentTimeMillis()
)

@Serializable
enum class NotificationType {
    TODO_CREATED,
    TODO_UPDATED,
    TODO_COMPLETED,
    TODO_DELETED,
    EMAIL,
    PUSH
}