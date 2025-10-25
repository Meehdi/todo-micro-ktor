package com.meehdi.infrastructure.adapter.messaging

import com.meehdi.application.service.NotificationService
import com.meehdi.domain.event.TodoEvent
import com.meehdi.infrastructure.config.KafkaConfig
import kotlinx.coroutines.*
import kotlinx.serialization.json.Json
import org.apache.kafka.clients.consumer.ConsumerConfig
import org.apache.kafka.clients.consumer.KafkaConsumer
import org.apache.kafka.common.serialization.StringDeserializer
import java.time.Duration
import java.util.*

class KafkaEventConsumer(
    private val config: KafkaConfig,
    private val notificationService: NotificationService
) {
    private val consumer: KafkaConsumer<String, String>
    private var running = false

    init {
        val props = Properties().apply {
            put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, config.bootstrapServers)
            put(ConsumerConfig.GROUP_ID_CONFIG, config.groupId)
            put(ConsumerConfig.CLIENT_ID_CONFIG, config.clientId)
            put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer::class.java.name)
            put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, StringDeserializer::class.java.name)
            put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "earliest")
            put(ConsumerConfig.ENABLE_AUTO_COMMIT_CONFIG, "true")
        }

        consumer = KafkaConsumer(props)
        consumer.subscribe(listOf(config.topic))
    }

    fun start() {
        running = true
        CoroutineScope(Dispatchers.IO).launch {
            while (running) {
                try {
                    val records = consumer.poll(Duration.ofMillis(1000))
                    records.forEach { record ->
                        try {
                            val event = Json.decodeFromString<TodoEvent>(record.value())
                            notificationService.processEvent(event)
                            println("Processed event: ${event.eventType} for todo: ${event.todoId}")
                        } catch (e: Exception) {
                            println("Error processing event: ${e.message}")
                        }
                    }
                } catch (e: Exception) {
                    println("Error polling Kafka: ${e.message}")
                }
            }
        }
    }

    fun stop() {
        running = false
        consumer.close()
    }
}