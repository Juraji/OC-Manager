package nl.juraji.ocManager.domain.traits

import com.fasterxml.jackson.annotation.JsonTypeInfo

@JsonTypeInfo(use = JsonTypeInfo.Id.CLASS, property = "__traitType")
interface OcCharacterTrait {
    val id: String?
}
