package com.meehdi.application.service

import com.meehdi.domain.event.*
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

        repository.save(notification)

        emailSender.send(notification)
    }

    suspend fun getNotificationsByUserId(userId: String): List<Notification> {
        return repository.findByUserId(userId)
    }

    suspend fun markAsRead(id: String): Boolean {
        return repository.markAsRead(id)
    }

    private fun createNotificationFromEvent(event: TodoEvent): Notification {
        return when (event) {
            is TodoCreated -> Notification(
                userId = event.userId,
                type = NotificationType.TODO_CREATED,
                title = "Todo created",
                message = "New todo created: ${event.title}",
                todoId = event.todoId
            )
            is TodoUpdated -> Notification(
                userId = event.userId,
                type = NotificationType.TODO_UPDATED,
                title = "Todo updated",
                message = "Todo updated: ${event.title}",
                todoId = event.todoId
            )
            is TodoCompleted -> Notification(
                userId = event.userId,
                type = NotificationType.TODO_COMPLETED,
                title = "Todo completed",
                message = "Todo completed: ${event.todoId}",
                todoId = event.todoId
            )
            is TodoDeleted -> Notification(
                userId = event.userId,
                type = NotificationType.TODO_DELETED,
                title = "Todo deleted",
                message = "Todo deleted: ${event.todoId}",
                todoId = event.todoId
            )
        }
    }

    private data class Tuple4<A, B, C, D>(val a: A, val b: B, val c: C, val d: D)
}