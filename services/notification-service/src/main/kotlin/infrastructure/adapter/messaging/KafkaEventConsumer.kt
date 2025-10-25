package com.meehdi.infrastructure.adapter.messaging

import com.meehdi.application.service.NotificationService
import com.meehdi.infrastructure.config.KafkaConfig
import kotlinx.coroutines.*
import org.apache.kafka.clients.consumer.KafkaConsumer
import org.apache.kafka.clients.consumer.OffsetAndMetadata
import org.apache.kafka.common.TopicPartition
import org.apache.kafka.common.errors.WakeupException
import org.slf4j.LoggerFactory
import java.time.Duration
import java.util.concurrent.atomic.AtomicBoolean

class KafkaEventConsumer(
    private val config: KafkaConfig,
    private val notificationService: NotificationService
) {
    private val consumer: KafkaConsumer<String, String>
    private val running = AtomicBoolean(false)
    private var consumerJob: Job? = null
    private val logger = LoggerFactory.getLogger(KafkaEventConsumer::class.java)

    private val recordProcessor = RecordProcessor(
        notificationService,
        EventDeserializer()
    )
    private val topics = TopicConfiguration.ALL_TOPICS

    init {
        consumer = KafkaConsumerFactory.create(config)
        consumer.subscribe(topics)
        logger.info("Kafka consumer initialized and subscribed to topics: $topics")
    }

    fun start() {
        if (!running.compareAndSet(false, true)) {
            logger.warn("Consumer already running")
            return
        }

        consumerJob = CoroutineScope(Dispatchers.IO).launch {
            try {
                consumeMessages()
            } catch (e: WakeupException) {
                logger.info("Consumer wakeup requested")
            } catch (e: Exception) {
                logger.error("Unexpected error in consumer", e)
            } finally {
                closeConsumer()
            }
        }
    }

    private suspend fun consumeMessages() {
        while (running.get()) {
            try {
                val records = consumer.poll(Duration.ofMillis(1000))

                if (records.isEmpty) {
                    continue
                }

                val processedOffsets = recordProcessor.processRecords(records)
                commitOffsets(processedOffsets)

            } catch (e: Exception) {
                logger.error("Error polling Kafka", e)
                delay(5000)
            }
        }
    }

    private fun commitOffsets(offsets: Map<TopicPartition, OffsetAndMetadata>) {
        if (offsets.isNotEmpty()) {
            consumer.commitSync(offsets)
            logger.debug("Committed ${offsets.size} partitions")
        }
    }

    fun stop() {
        logger.info("Stopping Kafka consumer...")
        running.set(false)
        consumer.wakeup()

        runBlocking {
            consumerJob?.join()
        }
        logger.info("Kafka consumer stopped")
    }

    private fun closeConsumer() {
        try {
            // Use close() with timeout parameter (non-deprecated version)
            consumer.close(java.time.Duration.ofSeconds(10))
            logger.info("Kafka consumer closed")
        } catch (e: Exception) {
            logger.error("Error closing consumer", e)
        }
    }
}