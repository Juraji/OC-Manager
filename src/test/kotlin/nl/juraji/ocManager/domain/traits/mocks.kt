package nl.juraji.ocManager.domain.traits

import nl.juraji.ocManager.util.uuid

fun mockOcBodyType() = uuid().let {
    OcBodyType(
        id = it,
        label = "Test body type $it"
    )
}

fun mockOcEthnicity() = uuid().let {
    OcEthnicity(
        id = it,
        label = "Test ethnicity $it"
    )
}

fun mockOcEyeColor() = uuid().let {
    OcEyeColor(
        id = it,
        type = OcEyeColorType.BLUE,
        variant = "Test variant $it"
    )
}

fun mockOcGenderPreference() = uuid().let {
    OcGenderPreference(
        id = it,
        label = "Test gender preference $it"
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
