package nl.juraji.ocManager.configuration

import nl.juraji.ocManager.configuration.converters.Neo4jInstantConverter
import nl.juraji.ocManager.configuration.converters.Neo4jNioPathConverter
import org.neo4j.driver.Driver
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.Primary
import org.springframework.data.neo4j.core.ReactiveDatabaseSelectionProvider
import org.springframework.data.neo4j.core.ReactiveNeo4jClient
import org.springframework.data.neo4j.core.convert.Neo4jConversions
import org.springframework.data.neo4j.core.transaction.ReactiveNeo4jTransactionManager
import org.springframework.data.neo4j.repository.config.EnableReactiveNeo4jRepositories
import org.springframework.transaction.TransactionManager

@Configuration
@EnableReactiveNeo4jRepositories("nl.juraji.ocManager.domain")
class Neo4jDataConfiguration {

    @Bean
    @Primary
    fun reactiveTransactionManager(
        driver: Driver,
        databaseSelectionProvider: ReactiveDatabaseSelectionProvider
    ): TransactionManager = ReactiveNeo4jTransactionManager(driver, databaseSelectionProvider)

    @Bean
    fun neo4jConversions(): Neo4jConversions {
        val converters = setOf(
            Neo4jNioPathConverter(),
            Neo4jInstantConverter()
        )
        return Neo4jConversions(converters)
    }
}