package nl.juraji.ocManager.domain.traits

import com.fasterxml.jackson.annotation.JsonSubTypes
import com.fasterxml.jackson.annotation.JsonSubTypes.Type
import com.fasterxml.jackson.annotation.JsonTypeInfo

@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, property = "traitType")
@JsonSubTypes(
    Type(value = OcBodyType::class, name = "OcBodyType"),
    Type(value = OcCustomTrait::class, name = "OcCustomTrait"),
    Type(value = OcEthnicity::class, name = "OcEthnicity"),
    Type(value = OcEyeColor::class, name = "OcEyeColor"),
    Type(value = OcGender::class, name = "OcGender"),
    Type(value = OcHairStyle::class, name = "OcHairStyle"),
    Type(value = OcSexuality::class, name = "OcSexuality"),
)
interface OcCharacterTrait {
    val id: String?
}
