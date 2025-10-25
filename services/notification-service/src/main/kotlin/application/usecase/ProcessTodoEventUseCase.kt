package com.meehdi.application.usecase

import com.meehdi.application.service.NotificationService
import com.meehdi.domain.event.TodoEvent

class ProcessTodoEventUseCase(
    private val notificationService: NotificationService
) {
    suspend fun execute(event: TodoEvent): Result<Unit> {
        return try {
            notificationService.processEvent(event)
            Result.success(Unit)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}