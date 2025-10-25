package com.meehdi.infrastructure.adapter.messaging

import com.meehdi.application.service.NotificationService
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.async
import kotlinx.coroutines.awaitAll
import kotlinx.coroutines.withContext
import org.apache.kafka.clients.consumer.ConsumerRecord
import org.apache.kafka.clients.consumer.OffsetAndMetadata
import org.apache.kafka.common.TopicPartition
import org.slf4j.LoggerFactory

class RecordProcessor(
    private val notificationService: NotificationService,
    private val eventDeserializer: EventDeserializer
) {
    private val logger = LoggerFactory.getLogger(RecordProcessor::class.java)

    suspend fun processRecords(
        records: Iterable<ConsumerRecord<String, String>>
    ): Map<TopicPartition, OffsetAndMetadata> {
        val processedOffsets = mutableMapOf<TopicPartition, OffsetAndMetadata>()

        // Option 1: Sequential processing (safer for order-dependent logic)
        records.forEach { record ->
            val result = processRecord(record)
            if (result != null) {
                processedOffsets[result.first] = result.second
            }
        }

        return processedOffsets
    }

    // Alternative: Parallel processing (faster but may lose order guarantees)
    suspend fun processRecordsParallel(
        records: Iterable<ConsumerRecord<String, String>>
    ): Map<TopicPartition, OffsetAndMetadata> = withContext(Dispatchers.IO) {
        val processedOffsets = mutableMapOf<TopicPartition, OffsetAndMetadata>()

        val results = records.map { record ->
            async {
                processRecord(record)
            }
        }.awaitAll()

        results.filterNotNull().forEach { (partition, offset) ->
            processedOffsets[partition] = offset
        }

        processedOffsets
    }

    private suspend fun processRecord(
        record: ConsumerRecord<String, String>
    ): Pair<TopicPartition, OffsetAndMetadata>? {
        return try {
            val event = eventDeserializer.deserialize(record.value())
            notificationService.processEvent(event)

            val partition = TopicPartition(record.topic(), record.partition())
            val offset = OffsetAndMetadata(record.offset() + 1)

            logger.debug("Processed event from topic: ${record.topic()}, offset: ${record.offset()}")
            partition to offset

        } catch (e: Exception) {
            logger.error(
                "Error processing event from topic: ${record.topic()}, offset: ${record.offset()}, key: ${record.key()}",
                e
            )
            // TODO: Implement DLQ strategy here
            null // Don't include failed records in offset commits
        }
    }
}