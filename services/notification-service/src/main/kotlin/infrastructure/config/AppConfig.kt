package com.meehdi.infrastructure.config

import io.ktor.server.application.*

data class MongoConfig(
    val uri: String,
    val database: String,
    val collection: String
)

data class KafkaConfig(
    val bootstrapServers: String,
    val topic: String,
    val groupId: String,
    val clientId: String
)

data class EmailConfig(
    val host: String,
    val port: Int,
    val username: String,
    val password: String,
    val from: String
)

data class NotificationConfig(
    val pushEnabled: Boolean,
    val fcmServerKey: String
)

fun ApplicationEnvironment.getMongoConfig(): MongoConfig {
    return MongoConfig(
        uri = config.property("mongodb.uri").getString(),
        database = config.property("mongodb.database").getString(),
        collection = config.property("mongodb.collection").getString()
    )
}

fun ApplicationEnvironment.getKafkaConfig(): KafkaConfig {
    return KafkaConfig(
        bootstrapServers = config.property("kafka.bootstrap-servers").getString(),
        topic = config.property("kafka.topic").getString(),
        groupId = config.property("kafka.group-id").getString(),
        clientId = config.property("kafka.client-id").getString()
    )
}

fun ApplicationEnvironment.getEmailConfig(): EmailConfig {
    return EmailConfig(
        host = config.property("email.smtp.host").getString(),
        port = config.property("email.smtp.port").getString().toInt(),
        username = config.property("email.smtp.username").getString(),
        password = config.property("email.smtp.password").getString(),
        from = config.property("email.smtp.from").getString()
    )
}

fun ApplicationEnvironment.getNotificationConfig(): NotificationConfig {
    return NotificationConfig(
        pushEnabled = config.property("notification.push.enabled").getString().toBoolean(),
        fcmServerKey = config.propertyOrNull("notification.push.fcm-server-key")?.getString() ?: ""
    )
}