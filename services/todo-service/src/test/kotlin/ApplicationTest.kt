package com.meehdi

import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.http.*
import io.ktor.server.config.*
import io.ktor.server.testing.*
import kotlin.test.Test
import kotlin.test.assertEquals

class ApplicationTest {

    @Test
    fun testHealthEndpoint() = testApplication {
        environment {
            config = MapApplicationConfig(
                "mongodb.uri" to "mongodb://localhost:27017",
                "mongodb.database" to "test_db",
                "mongodb.collection" to "todos",
                "kafka.bootstrap-servers" to "localhost:9092",
                "kafka.topic" to "todo-events-test",
                "kafka.group-id" to "todo-service-test",
                "kafka.client-id" to "todo-producer-test"
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