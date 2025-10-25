plugins {
    alias(libs.plugins.kotlin.jvm)
    alias(libs.plugins.ktor)
    alias(libs.plugins.kotlin.plugin.serialization)
}

group = "com.meehdi"
version = "0.0.1"

application {
    mainClass = "io.ktor.server.netty.EngineMain"
}

kotlin {
    jvmToolchain(24)
}

dependencies {
    // Ktor Server
    implementation(libs.ktor.server.core)
    implementation(libs.ktor.server.netty)
    implementation(libs.ktor.server.host.common)

    // Emails
    implementation("org.simplejavamail:simple-java-mail:8.11.2")
    implementation("org.simplejavamail:batch-module:8.11.2")

    // Ktor Plugins
    implementation(libs.ktor.server.call.logging)
    implementation(libs.ktor.server.call.id)
    implementation(libs.ktor.server.default.headers)
    implementation(libs.ktor.server.status.pages)
    implementation(libs.ktor.server.content.negotiation)
    implementation(libs.ktor.serialization.kotlinx.json)

    // CORS
    implementation(libs.ktor.server.cors)

    // MongoDB - COROUTINE driver
    implementation(libs.mongodb.driver.kotlin.coroutine)
    implementation(libs.bson.kotlinx)

    // Kafka
    implementation(libs.kafka.clients)

    // Logging & Config
    implementation(libs.logback.classic)
    implementation(libs.ktor.server.config.yaml)

    // Testing
    testImplementation(libs.ktor.server.test.host)
    testImplementation(libs.kotlin.test.junit)
}