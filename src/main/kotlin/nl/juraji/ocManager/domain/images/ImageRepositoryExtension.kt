package nl.juraji.ocManager.domain.images

import nl.juraji.ocManager.util.Neo4jDataClassMapper
import org.springframework.data.neo4j.core.DatabaseSelectionProvider
import org.springframework.data.neo4j.core.ReactiveNeo4jClient
import org.springframework.stereotype.Component
import reactor.core.publisher.Flux

interface ImageRepositoryExtension {
    fun findAllOcImageGalleryViews(portfolioId: String): Flux<OcImageGalleryView>
}

@Component
class ImageRepositoryExtensionImpl(
    private val neo4jClient: ReactiveNeo4jClient,
    private val databaseSelectionProvider: DatabaseSelectionProvider,
) : ImageRepositoryExtension {
    private val galleryViewMapper = Neo4jDataClassMapper(OcImageGalleryView::class)

    override fun findAllOcImageGalleryViews(portfolioId: String): Flux<OcImageGalleryView> = neo4jClient
        .query(
            """
            MATCH (:OcPortfolio {id: $ portfolioId})-[:CONTAINS_IMAGE]->(img:OcImage)<-[:HAS_IMAGE]-(tn)
            RETURN
              img.id AS id,
              img.sourceName AS sourceName,
              img.sourceFileSize AS sourceFileSize,
              img.uploadedOn AS uploadedOn,
              tn.id AS parentNodeId,
              labels(tn) AS parentNodeLabels
        """.trimIndent()
        )
        .`in`(databaseSelectionProvider.databaseSelection.value)
        .bind(portfolioId).to("portfolioId")
        .fetch().all()
        .map(galleryViewMapper::mapFrom)
}
