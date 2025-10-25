package com.meehdi.infrastructure.adapter.http.route

import com.meehdi.application.service.NotificationService
import com.meehdi.infrastructure.adapter.http.dto.toDto
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

fun Application.configureNotificationRoutes(notificationService: NotificationService) {
    routing {
        route("/notifications") {

            // Get all notifications for a user
            get("/user/{userId}") {
                val userId = call.parameters["userId"]
                    ?: return@get call.respond(HttpStatusCode.BadRequest, "Missing userId")

                val notifications = notificationService.getNotificationsByUserId(userId)
                call.respond(notifications.map { it.toDto() })
            }

            // Mark notification as read
            patch("/{id}/read") {
                val id = call.parameters["id"]
                    ?: return@patch call.respond(HttpStatusCode.BadRequest, "Missing id")

                val success = notificationService.markAsRead(id)
                if (success) {
                    call.respond(HttpStatusCode.OK, mapOf("message" to "Notification marked as read"))
                } else {
                    call.respond(HttpStatusCode.NotFound, "Notification not found")
                }
            }
        }

        // Health check
        get("/health") {
            call.respond(HttpStatusCode.OK, mapOf("status" to "UP"))
        }
    }
}