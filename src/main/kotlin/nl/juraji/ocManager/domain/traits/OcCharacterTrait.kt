package nl.juraji.ocManager.domain.traits

interface OcCharacterTrait {
    val id: String?

    @Suppress("unused") // Type support for api consumers
    val traitType: String get() = this::class.simpleName!!
}
