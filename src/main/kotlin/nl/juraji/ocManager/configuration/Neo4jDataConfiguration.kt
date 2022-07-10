package nl.juraji.ocManager.configuration

import nl.juraji.ocManager.configuration.converters.Neo4jInstantConverter
import nl.juraji.ocManager.configuration.converters.Neo4jNioPathConverter
import nl.juraji.ocManager.util.LoggerCompanion
import org.neo4j.configuration.connectors.BoltConnector
import org.neo4j.configuration.connectors.HttpConnector
import org.neo4j.configuration.helpers.SocketAddress
import org.neo4j.dbms.api.DatabaseManagementService
import org.neo4j.dbms.api.DatabaseManagementServiceBuilder
import org.neo4j.driver.Driver
import org.springframework.beans.factory.ObjectProvider
import org.springframework.boot.autoconfigure.neo4j.ConfigBuilderCustomizer
import org.springframework.boot.autoconfigure.neo4j.Neo4jAutoConfiguration
import org.springframework.boot.autoconfigure.neo4j.Neo4jProperties
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.Primary
import org.springframework.core.env.Environment
import org.springframework.data.neo4j.core.ReactiveDatabaseSelectionProvider
import org.springframework.data.neo4j.core.convert.Neo4jConversions
import org.springframework.data.neo4j.core.transaction.ReactiveNeo4jTransactionManager
import org.springframework.data.neo4j.repository.config.EnableReactiveNeo4jRepositories
import org.springframework.data.neo4j.repository.config.ReactiveNeo4jRepositoryConfigurationExtension
import org.springframework.transaction.TransactionManager

@Configuration
@EnableReactiveNeo4jRepositories("nl.juraji.ocManager.domain")
class Neo4jDataConfiguration {

    @Bean(destroyMethod = "shutdown")
    fun neo4jManagementService(
        configuration: OcManagerConfiguration,
        neo4jProperties: Neo4jProperties,
    ): DatabaseManagementService =
        DatabaseManagementServiceBuilder(configuration.getDataDir("neo4j"))
            .setConfig(BoltConnector.enabled, true)
            .setConfig(BoltConnector.listen_address, neo4jProperties.uri.let { SocketAddress(it.host, it.port) })
            .setConfig(HttpConnector.enabled, false)
            .build()

    @Bean
    @Primary
    fun driver(
        databaseManagementService: DatabaseManagementService,
        neo4jProperties: Neo4jProperties,
        environment: Environment,
        configBuilderCustomizers: ObjectProvider<ConfigBuilderCustomizer>
    ): Driver {
        // Do a get on the default database in order to trigger a N4j start
        databaseManagementService.database("neo4j")

        logger.info("Neo4j embedded database started on ${neo4jProperties.uri}")

        return Neo4jAutoConfiguration()
            .neo4jDriver(neo4jProperties, environment, configBuilderCustomizers)
    }

    @Primary
    @Bean(ReactiveNeo4jRepositoryConfigurationExtension.DEFAULT_TRANSACTION_MANAGER_BEAN_NAME)
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

    companion object: LoggerCompanion(Neo4jDataConfiguration::class)
}
