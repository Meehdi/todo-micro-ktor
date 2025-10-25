package com.meehdi.infrastructure.adapter.messaging

import com.meehdi.domain.event.*
import kotlinx.serialization.json.Json
import kotlinx.serialization.modules.SerializersModule
import kotlinx.serialization.modules.polymorphic
import kotlinx.serialization.modules.subclass

class EventDeserializer {

    private val json = Json {
        ignoreUnknownKeys = true
        serializersModule = eventSerializersModule()
        classDiscriminator = "type"
    }

    fun deserialize(jsonString: String): TodoEvent {
        return json.decodeFromString(TodoEvent.serializer(), jsonString)
    }

    private fun eventSerializersModule() = SerializersModule {
        polymorphic(TodoEvent::class) {
            subclass(TodoCreated::class)
            subclass(TodoUpdated::class)
            subclass(TodoCompleted::class)
            subclass(TodoDeleted::class)
        }
    }
}