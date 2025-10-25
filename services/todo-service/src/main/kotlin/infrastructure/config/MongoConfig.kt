package com.meehdi.infrastructure.config

import com.mongodb.kotlin.client.coroutine.MongoClient
import com.mongodb.kotlin.client.coroutine.MongoDatabase


object MongoConfig {

    fun createClient(uri: String): MongoClient {
        return MongoClient.create(uri)
    }

    fun getDatabase(client: MongoClient, databaseName: String): MongoDatabase {
        return client.getDatabase(databaseName)
    }
}
