package com.meehdi.infrastructure.di

import com.meehdi.application.usecase.*
import com.meehdi.domain.port.EventPublisher
import com.meehdi.domain.port.TodoRepository
import com.meehdi.infrastructure.adapter.messaging.KafkaEventPublisher
import com.meehdi.infrastructure.adapter.persistence.MongoTodoRepository
import com.meehdi.infrastructure.config.KafkaConfig
import com.meehdi.infrastructure.config.MongoConfig

class DependencyContainer(
    mongoUri: String,
    mongoDatabase: String,
    kafkaBootstrapServers: String
) {
    // Infrastructure
    private val mongoClient = MongoConfig.createClient(mongoUri)
    private val database = MongoConfig.getDatabase(mongoClient, mongoDatabase)
    private val kafkaProducer = KafkaConfig.createProducer(kafkaBootstrapServers)

    // Adapters
    val todoRepository: TodoRepository = MongoTodoRepository(database)
    val eventPublisher: EventPublisher = KafkaEventPublisher(kafkaProducer)

    // Use Cases
    val createTodoUseCase = CreateTodoUseCase(todoRepository, eventPublisher)
    val getAllTodosUseCase = GetAllTodosUseCase(todoRepository)
    val getTodoByIdUseCase = GetTodoByIdUseCase(todoRepository)
    val updateTodoUseCase = UpdateTodoUseCase(todoRepository, eventPublisher)
    val completeTodoUseCase = CompleteTodoUseCase(todoRepository, eventPublisher)
    val deleteTodoUseCase = DeleteTodoUseCase(todoRepository, eventPublisher)

    fun close() {
        mongoClient.close()
        (eventPublisher as KafkaEventPublisher).close()
    }
}
