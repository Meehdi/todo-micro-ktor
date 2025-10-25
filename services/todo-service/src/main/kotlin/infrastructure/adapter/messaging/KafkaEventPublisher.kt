package com.meehdi.infrastructure.adapter.messaging

import com.meehdi.domain.event.*
import com.meehdi.domain.port.EventPublisher
import kotlinx.serialization.json.Json
import kotlinx.serialization.modules.SerializersModule
import kotlinx.serialization.modules.polymorphic
import kotlinx.serialization.modules.subclass
import org.apache.kafka.clients.producer.KafkaProducer
import org.apache.kafka.clients.producer.ProducerRecord
import org.slf4j.LoggerFactory

class KafkaEventPublisher(
    private val producer: KafkaProducer<String, String>
) : EventPublisher {

    private val logger = LoggerFactory.getLogger(KafkaEventPublisher::class.java)

    private val json = Json {
        serializersModule = SerializersModule {
            polymorphic(TodoEvent::class) {
                subclass(TodoCreated::class)
                subclass(TodoUpdated::class)
                subclass(TodoCompleted::class)
                subclass(TodoDeleted::class)
            }
        }
        classDiscriminator = "type"
    }

    override suspend fun publish(event: TodoEvent) {
        val topic = when (event) {
            is TodoCreated -> "todo.created"
            is TodoUpdated -> "todo.updated"
            is TodoCompleted -> "todo.completed"
            is TodoDeleted -> "todo.deleted"
        }

        val message = json.encodeToString(TodoEvent.serializer(), event)
        val record = ProducerRecord(topic, event.todoId, message)

        try {
            producer.send(record) { metadata, exception ->
                if (exception != null) {
                    logger.error("Failed to publish event to topic: $topic", exception)
                } else {
                    logger.info("Event published to topic: ${metadata.topic()}, partition: ${metadata.partition()}, offset: ${metadata.offset()}")
                }
            }
        } catch (e: Exception) {
            logger.error("Error publishing event", e)
        }
    }

    fun close() {
        producer.close()
    }
}