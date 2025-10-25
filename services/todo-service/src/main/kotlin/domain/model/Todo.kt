package com.meehdi.domain.model

import kotlinx.datetime.Clock
import kotlinx.datetime.Instant
import kotlinx.serialization.Contextual
import kotlinx.serialization.Serializable
import org.bson.types.ObjectId

@Serializable
data class Todo(
    @Contextual val id: ObjectId = ObjectId(),
    val title: String,
    val description: String? = null,
    val completed: Boolean = false,
    @Contextual val createdAt: Instant = Clock.System.now(),
    @Contextual val updatedAt: Instant = Clock.System.now()
) {
    fun markAsCompleted(): Todo = copy(
        completed = true,
        updatedAt = Clock.System.now()
    )

    fun update(title: String? = null, description: String? = null): Todo = copy(
        title = title ?: this.title,
        description = description ?: this.description,
        updatedAt = Clock.System.now()
    )
}
