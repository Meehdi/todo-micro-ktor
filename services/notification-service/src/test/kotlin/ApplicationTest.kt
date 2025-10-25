package com.meehdi

import io.ktor.client.request.*
import io.ktor.http.*
import io.ktor.server.config.*
import io.ktor.server.testing.*
import kotlin.test.Test
import kotlin.test.assertEquals

class ApplicationTest {

    @Test
    fun testRoot() = testApplication {
        environment {
            config = MapApplicationConfig(
                "mongodb.uri" to "mongodb://localhost:27017",
                "mongodb.database" to "test_db",
                "mongodb.collection" to "notifications",
                "kafka.bootstrap-servers" to "localhost:9092",
                "kafka.topic" to "todo-events-test",
                "kafka.group-id" to "notification-service-test",
                "kafka.client-id" to "notification-consumer-test",
                "email.smtp.host" to "smtp.gmail.com",
                "email.smtp.port" to "587",
                "email.smtp.username" to "test@example.com",
                "email.smtp.password" to "test-password",
                "email.smtp.from" to "test@todoapp.com",
                "notification.push.enabled" to "false",
                "notification.push.fcm-server-key" to ""
            )
        }

        application {
            module()
        }

        client.get("/health").apply {
            assertEquals(HttpStatusCode.OK, status)
        }
    }
}