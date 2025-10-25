package com.meehdi.infrastructure.adapter.http.dto

import com.meehdi.domain.model.Notification
import com.meehdi.domain.model.NotificationType
import kotlinx.serialization.Serializable

@Serializable
data class NotificationDto(
    val id: String,
    val userId: String,
    val type: String,
    val title: String,
    val message: String,
    val todoId: String?,
    val read: Boolean,
    val sentAt: Long
)

fun Notification.toDto() = NotificationDto(
    id = id,
    userId = userId,
    type = type.name,
    title = title,
    message = message,
    todoId = todoId,
    read = read,
    sentAt = sentAt
)

@Serializable
data class CreateNotificationRequest(
    val userId: String,
    val type: String,
    val title: String,
    val message: String,
    val todoId: String? = null
)

fun CreateNotificationRequest.toDomain() = Notification(
    userId = userId,
    type = NotificationType.valueOf(type),
    title = title,
    message = message,
    todoId = todoId
)