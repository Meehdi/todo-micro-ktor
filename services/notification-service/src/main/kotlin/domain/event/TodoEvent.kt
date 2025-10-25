package com.meehdi.domain.event

import kotlinx.serialization.Serializable

@Serializable
data class TodoEvent(
    val eventType: String,
    val todoId: String,
    val userId: String,
    val title: String,
    val description: String? = null,
    val timestamp: Long = System.currentTimeMillis()
)
