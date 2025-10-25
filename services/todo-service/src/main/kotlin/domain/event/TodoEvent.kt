package com.meehdi.domain.event

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
sealed interface TodoEvent {
    val todoId: String
    val timestamp: Long
}

@Serializable
@SerialName("TodoCreated")
data class TodoCreated(
    override val todoId: String,
    val userId: String,
    val title: String,
    val description: String?,
    override val timestamp: Long = System.currentTimeMillis()
) : TodoEvent

@Serializable
@SerialName("TodoUpdated")
data class TodoUpdated(
    override val todoId: String,
    val userId: String,
    val title: String,
    val description: String?,
    override val timestamp: Long = System.currentTimeMillis()
) : TodoEvent

@Serializable
@SerialName("TodoCompleted")
data class TodoCompleted(
    override val todoId: String,
    val userId: String,
    override val timestamp: Long = System.currentTimeMillis()
) : TodoEvent

@Serializable
@SerialName("TodoDeleted")
data class TodoDeleted(
    override val todoId: String,
    val userId: String,
    override val timestamp: Long = System.currentTimeMillis()
) : TodoEvent