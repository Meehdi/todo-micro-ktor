package com.meehdi.infrastructure.adapter.messaging

import com.meehdi.infrastructure.config.KafkaConfig
import org.apache.kafka.clients.consumer.ConsumerConfig
import org.apache.kafka.clients.consumer.KafkaConsumer
import org.apache.kafka.common.serialization.StringDeserializer
import java.util.*

object KafkaConsumerFactory {

    fun create(config: KafkaConfig): KafkaConsumer<String, String> {
        val props = buildConsumerProperties(config)
        return KafkaConsumer(props)
    }

    private fun buildConsumerProperties(config: KafkaConfig): Properties {
        return Properties().apply {
            // Connection settings
            put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, config.bootstrapServers)
            put(ConsumerConfig.GROUP_ID_CONFIG, config.groupId)
            put(ConsumerConfig.CLIENT_ID_CONFIG, config.clientId)

            // Deserializers
            put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer::class.java.name)
            put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, StringDeserializer::class.java.name)

            // Offset management
            put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "earliest")
            put(ConsumerConfig.ENABLE_AUTO_COMMIT_CONFIG, "false") // Manual commit

            // Session and heartbeat
            put(ConsumerConfig.SESSION_TIMEOUT_MS_CONFIG, "30000")
            put(ConsumerConfig.HEARTBEAT_INTERVAL_MS_CONFIG, "3000") // 1/3 of session timeout
            put(ConsumerConfig.MAX_POLL_INTERVAL_MS_CONFIG, "300000")
            put(ConsumerConfig.REQUEST_TIMEOUT_MS_CONFIG, "40000")

            // Performance tuning
            put(ConsumerConfig.MAX_POLL_RECORDS_CONFIG, "500")
            put(ConsumerConfig.FETCH_MIN_BYTES_CONFIG, "1024")
            put(ConsumerConfig.FETCH_MAX_WAIT_MS_CONFIG, "500")
        }
    }
}