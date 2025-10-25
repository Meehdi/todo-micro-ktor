package com.meehdi

import com.meehdi.application.service.NotificationService
import com.meehdi.infrastructure.adapter.http.route.configureNotificationRoutes
import com.meehdi.infrastructure.adapter.messaging.KafkaEventConsumer
import com.meehdi.infrastructure.adapter.notification.EmailNotificationSender
import com.meehdi.infrastructure.adapter.persistence.MongoNotificationRepository
import com.meehdi.infrastructure.config.*
import com.mongodb.kotlin.client.coroutine.MongoClient
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.application.*
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.server.plugins.cors.routing.*
import io.ktor.server.plugins.defaultheaders.*
import io.ktor.server.plugins.statuspages.*
import io.ktor.http.*
import io.ktor.server.response.*

fun main(args: Array<String>) {
    io.ktor.server.netty.EngineMain.main(args)
}

fun Application.module() {
    println("=== Application Starting ===")

    val mongoConfig = environment.getMongoConfig()
    val kafkaConfig = environment.getKafkaConfig()
    val emailConfig = environment.getEmailConfig()

    println("=== Configuration Loaded ===")
    println("MongoDB URI: ${mongoConfig.uri}")
    println("MongoDB Database: ${mongoConfig.database}")
    println("MongoDB Collection: ${mongoConfig.collection}")
    println("Kafka Bootstrap Servers: ${kafkaConfig.bootstrapServers}")
    println("Kafka Topic: ${kafkaConfig.topic}")
    println("Kafka Group ID: ${kafkaConfig.groupId}")
    println("Kafka Client ID: ${kafkaConfig.clientId}")
    println("===========================")

    val mongoClient = MongoClient.create(mongoConfig.uri)
    val database = mongoClient.getDatabase(mongoConfig.database)

    val notificationRepository = MongoNotificationRepository(database, mongoConfig.collection)
    val emailSender = EmailNotificationSender(emailConfig)

    val notificationService = NotificationService(notificationRepository, emailSender)

    println("Creating Kafka consumer...")
    val kafkaConsumer = KafkaEventConsumer(kafkaConfig, notificationService)

    println("Starting Kafka consumer...")
    kafkaConsumer.start()
    println("Kafka consumer start() method called")

    install(ContentNegotiation) {
        json()
    }

    install(CORS) {
        anyHost()
        allowHeader(HttpHeaders.ContentType)
        allowMethod(HttpMethod.Get)
        allowMethod(HttpMethod.Post)
        allowMethod(HttpMethod.Put)
        allowMethod(HttpMethod.Patch)
        allowMethod(HttpMethod.Delete)
    }

    install(DefaultHeaders) {
        header("X-Service", "Notification-Service")
    }

    install(StatusPages) {
        exception<Throwable> { call, cause ->
            call.respond(HttpStatusCode.InternalServerError, mapOf("error" to (cause.message ?: "Unknown error")))
        }
    }

    configureNotificationRoutes(notificationService)

    monitor.subscribe(ApplicationStopped) {
        kafkaConsumer.stop()
        mongoClient.close()
    }

    println("=== Application Started Successfully ===")
}