package com.meehdi.infrastructure.adapter.messaging

object TopicConfiguration {
    const val TODO_CREATED = "todo.created"
    const val TODO_UPDATED = "todo.updated"
    const val TODO_COMPLETED = "todo.completed"
    const val TODO_DELETED = "todo.deleted"

    val ALL_TOPICS = listOf(
        TODO_CREATED,
        TODO_UPDATED,
        TODO_COMPLETED,
        TODO_DELETED
    )
}
