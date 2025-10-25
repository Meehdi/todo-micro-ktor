package com.meehdi.application.usecase

import com.meehdi.domain.model.Notification
import com.meehdi.domain.port.NotificationRepository
import com.meehdi.domain.port.NotificationSender

class SendNotificationUseCase(
    private val repository: NotificationRepository,
    private val notificationSender: NotificationSender
) {
    suspend fun execute(notification: Notification): Result<Notification> {
        return try {
            val saved = repository.save(notification)
            notificationSender.send(saved)
            Result.success(saved)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}