package nl.juraji.ocManager.configuration

import org.neo4j.driver.AuthTokens
import org.neo4j.driver.Driver
import org.neo4j.driver.GraphDatabase
import org.neo4j.harness.Neo4j
import org.neo4j.harness.Neo4jBuilders
import org.neo4j.procedure.UserFunction
import org.springframework.boot.test.context.TestConfiguration
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Import
import org.springframework.data.neo4j.core.DatabaseSelectionProvider
import java.util.*
import kotlin.reflect.KClass

/**
 * Automated test configuration for Neo4j test harness
 *
 * @param userFunctions A [KClass] implementing one or more methods
 * annotated with [org.neo4j.procedure.UserFunction].
 * For example to mock Apoc procedures, which are not available in the test harness.
 * Defaults to No-op.
 */
@TestConfiguration
@Import(Neo4jDataConfiguration::class)
abstract class BaseTestHarnessConfiguration(
    private val userFunctions: KClass<*> = Noop::class
) {

    @Bean
    fun databaseSelectionProvider(): DatabaseSelectionProvider =
        DatabaseSelectionProvider.getDefaultSelectionProvider()

    @Bean
    fun driver(): Driver = GraphDatabase.driver(
        neo4j().boltURI(),
        AuthTokens.basic("neo4j", "")
    )

    @Bean(destroyMethod = "close")
    fun neo4j(): Neo4j {
        return Neo4jBuilders.newInProcessBuilder()
            .withDisabledServer()
            .withFunction(ApocUserFunctionImpl::class.java)
            .withFunction(userFunctions.java)
            .withFixture(fixture())
            .build()
    }

    abstract fun fixture(): String

    internal class Noop

    class ApocUserFunctionImpl {
        @UserFunction("apoc.create.uuid")
        fun apocCreateUuid(): String = UUID.randomUUID().toString()
    }
}
