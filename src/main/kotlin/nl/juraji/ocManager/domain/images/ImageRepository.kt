package nl.juraji.ocManager.domain.images

import org.springframework.data.neo4j.repository.ReactiveNeo4jRepository
import org.springframework.data.neo4j.repository.query.Query
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

interface ImageRepository : ReactiveNeo4jRepository<OcImage, String> {

    @Query("MATCH ({id: $ linkedNodeId})-[:HAS_IMAGE]->(image:OcImage) RETURN image")
    fun findByLinkedNodeId(linkedNodeId: String): Flux<OcImage>

    @Query(
        """
            MATCH (img:OcImage {id: $ imageId})
            MATCH (t {id: $ targetNodeId})

            MERGE (t)-[:HAS_IMAGE]->(img)
            RETURN img
        """
    )
    fun linkImageToNodeById(imageId: String, targetNodeId: String): Mono<OcImage>
}
