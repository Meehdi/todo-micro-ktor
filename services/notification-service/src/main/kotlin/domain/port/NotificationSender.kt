package com.meehdi.domain.port

import com.meehdi.domain.model.Notification

interface NotificationSender {
    suspend fun send(notification: Notification): Boolean
}