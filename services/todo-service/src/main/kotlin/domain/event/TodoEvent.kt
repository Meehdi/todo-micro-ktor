package com.meehdi.domain.event

import kotlinx.serialization.Serializable

sealed interface TodoEvent {
    val todoId: String
}

@Serializable
data class TodoCreated(
    override val todoId: String,
    val title: String,
    val description: String?
) : TodoEvent

@Serializable
data class TodoUpdated(
    override val todoId: String,
    val title: String,
    val description: String?
) : TodoEvent

@Serializable
data class TodoCompleted(
    override val todoId: String
) : TodoEvent

@Serializable
data class TodoDeleted(
    override val todoId: String
) : TodoEvent
