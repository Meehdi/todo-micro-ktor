package com.meehdi.infrastructure.adapter.http.dto

import kotlinx.serialization.Serializable

@Serializable
data class CreateTodoRequest(
    val title: String,
    val description: String? = null
)

@Serializable
data class UpdateTodoRequest(
    val title: String? = null,
    val description: String? = null
)

@Serializable
data class TodoResponse(
    val id: String,
    val title: String,
    val description: String?,
    val completed: Boolean,
    val createdAt: String,
    val updatedAt: String
)

@Serializable
data class ErrorResponse(
    val message: String
)
