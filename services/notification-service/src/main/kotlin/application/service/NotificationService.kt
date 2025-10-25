package com.meehdi.application.service

import com.meehdi.domain.event.TodoEvent
import com.meehdi.domain.model.Notification
import com.meehdi.domain.model.NotificationType
import com.meehdi.domain.port.NotificationRepository
import com.meehdi.domain.port.NotificationSender

class NotificationService(
    private val repository: NotificationRepository,
    private val emailSender: NotificationSender
) {
    suspend fun processEvent(event: TodoEvent) {
        val notification = createNotificationFromEvent(event)

        // Save notification
        repository.save(notification)

        // Send email notification
        emailSender.send(notification)
    }

    suspend fun getNotificationsByUserId(userId: String): List<Notification> {
        return repository.findByUserId(userId)
    }

    suspend fun markAsRead(id: String): Boolean {
        return repository.markAsRead(id)
    }

    private fun createNotificationFromEvent(event: TodoEvent): Notification {
        val type = when (event.eventType) {
            "TODO_CREATED" -> NotificationType.TODO_CREATED
            "TODO_UPDATED" -> NotificationType.TODO_UPDATED
            "TODO_COMPLETED" -> NotificationType.TODO_COMPLETED
            "TODO_DELETED" -> NotificationType.TODO_DELETED
            else -> NotificationType.EMAIL
        }

        val message = when (event.eventType) {
            "TODO_CREATED" -> "New todo created: ${event.title}"
            "TODO_UPDATED" -> "Todo updated: ${event.title}"
            "TODO_COMPLETED" -> "Todo completed: ${event.title}"
            "TODO_DELETED" -> "Todo deleted: ${event.title}"
            else -> "Todo event: ${event.title}"
        }

        return Notification(
            userId = event.userId,
            type = type,
            title = "Todo ${event.eventType.lowercase().replace("_", " ")}",
            message = message,
            todoId = event.todoId
        )
    }
}