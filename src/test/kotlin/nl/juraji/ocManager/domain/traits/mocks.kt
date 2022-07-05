package nl.juraji.ocManager.domain.traits

import nl.juraji.ocManager.util.uuid

fun mockOcBodyType() = uuid().let {
    OcBodyType(
        id = it,
        description = "Test body type $it"
    )
}

fun mockOcEthnicity() = uuid().let {
    OcEthnicity(
        id = it,
        description = "Test ethnicity $it"
    )
}

fun mockOcEyeColor() = uuid().let {
    OcEyeColor(
        id = it,
        type = OcEyeColorType.BLUE,
        variant = "Test variant $it"
    )
}

fun mockOcGender() = uuid().let {
    OcGender(
        id = it,
        description = "Test gender preference $it"
    )
}

fun mockOcHairStyle() = uuid().let {
    OcHairStyle(
        id = it,
        length = OcHairStyleLength.MEDIUM,
        baseColor = OcHairStyleColor.BLONDE,
        variant = "Test variant $it",
        dyed = false,
    )
}
