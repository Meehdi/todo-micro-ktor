package com.meehdi.infrastructure.adapter.notification

import com.meehdi.domain.model.Notification
import com.meehdi.domain.port.NotificationSender
import com.meehdi.infrastructure.config.EmailConfig
import jakarta.mail.*
import jakarta.mail.internet.InternetAddress
import jakarta.mail.internet.MimeMessage
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.util.*

class EmailNotificationSender(
    private val config: EmailConfig
) : NotificationSender {

    private val session: Session by lazy {
        val props = Properties().apply {
            put("mail.smtp.host", config.host)
            put("mail.smtp.port", config.port)

            // Only enable auth if credentials are provided
            if (config.username.isNotBlank() && config.password.isNotBlank()) {
                put("mail.smtp.auth", "true")
                put("mail.smtp.starttls.enable", "true")
            } else {
                put("mail.smtp.auth", "false")
            }
        }

        if (config.username.isNotBlank() && config.password.isNotBlank()) {
            Session.getInstance(props, object : Authenticator() {
                override fun getPasswordAuthentication(): PasswordAuthentication {
                    return PasswordAuthentication(config.username, config.password)
                }
            })
        } else {
            Session.getInstance(props)
        }
    }

    override suspend fun send(notification: Notification): Boolean {
        return withContext(Dispatchers.IO) {
            try {
                val message = MimeMessage(session).apply {
                    setFrom(InternetAddress(config.from))
                    setRecipients(
                        Message.RecipientType.TO,
                        InternetAddress.parse(getEmailForUser(notification.userId))
                    )
                    subject = notification.title
                    setText(notification.message)
                }

                Transport.send(message)
                println("Email sent successfully to user: ${notification.userId}")
                true
            } catch (e: Exception) {
                println("Failed to send email: ${e.message}")
                e.printStackTrace()
                false
            }
        }
    }

    private fun getEmailForUser(userId: String): String {
        // TODO: Implement user email lookup
        // For now, return a placeholder
        return "$userId@example.com"
    }
}