package com.meehdi.domain.port

import com.meehdi.domain.event.TodoEvent

interface EventPublisher {
    suspend fun publish(event: TodoEvent)
}
