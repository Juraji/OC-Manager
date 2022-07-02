package nl.juraji.ocManager.domain

import nl.juraji.ocManager.domain.traits.*
import org.springframework.stereotype.Service
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

@Service
class TraitService(
    private val bodyTypeRepository: BodyTypeRepository,
    private val ethnicityRepository: EthnicityRepository,
    private val eyeColorRepository: EyeColorRepository,
    private val genderPreferenceRepository: GenderPreferenceRepository,
    private val hairStyleRepository: HairStyleRepository,
) {
    // Body types
    fun getAllBodyTypes(): Flux<OcBodyType> =
        bodyTypeRepository.findAll()

    fun createBodyType(trait: OcBodyType): Mono<OcBodyType> =
        bodyTypeRepository.save(trait)

    fun updateBodyType(traitId: String, trait: OcBodyType): Mono<OcBodyType> =
        bodyTypeRepository
            .findById(traitId)
            .map { trait.copy(id = it.id) }
            .flatMap(bodyTypeRepository::save)

    fun deleteBodyType(traitId: String): Mono<Void> =
        bodyTypeRepository.deleteById(traitId)

    // Ethnicities
    fun getAllEthnicities(): Flux<OcEthnicity> =
        ethnicityRepository.findAll()

    fun createEthnicity(trait: OcEthnicity): Mono<OcEthnicity> =
        ethnicityRepository.save(trait)

    fun updateEthnicity(traitId: String, trait: OcEthnicity): Mono<OcEthnicity> =
        ethnicityRepository
            .findById(traitId)
            .map { trait.copy(id = it.id) }
            .flatMap(ethnicityRepository::save)

    fun deleteEthnicity(traitId: String): Mono<Void> =
        ethnicityRepository.deleteById(traitId)

    // Eye colors
    fun getAllEyeColors(): Flux<OcEyeColor> =
        eyeColorRepository.findAll()

    fun createEyeColor(trait: OcEyeColor): Mono<OcEyeColor> =
        eyeColorRepository.save(trait)

    fun updateEyeColor(traitId: String, trait: OcEyeColor): Mono<OcEyeColor> =
        eyeColorRepository
            .findById(traitId)
            .map { trait.copy(id = it.id) }
            .flatMap(eyeColorRepository::save)

    fun deleteEyeColor(traitId: String): Mono<Void> =
        eyeColorRepository.deleteById(traitId)

    // Gender preferences
    fun getAllGenderPreferences(): Flux<OcGenderPreference> =
        genderPreferenceRepository.findAll()

    fun createGenderPreference(trait: OcGenderPreference): Mono<OcGenderPreference> =
        genderPreferenceRepository.save(trait)

    fun updateGenderPreference(traitId: String, trait: OcGenderPreference): Mono<OcGenderPreference> =
        genderPreferenceRepository
            .findById(traitId)
            .map { trait.copy(id = it.id) }
            .flatMap(genderPreferenceRepository::save)

    fun deleteGenderPreference(traitId: String): Mono<Void> =
        genderPreferenceRepository.deleteById(traitId)

    // Hair styles
    fun getAllHairStyles(): Flux<OcHairStyle> =
        hairStyleRepository.findAll()

    fun createHairStyle(trait: OcHairStyle): Mono<OcHairStyle> =
        hairStyleRepository.save(trait)

    fun updateHairStyle(traitId: String, trait: OcHairStyle): Mono<OcHairStyle> =
        hairStyleRepository
            .findById(traitId)
            .map { trait.copy(id = it.id) }
            .flatMap(hairStyleRepository::save)

    fun deleteHairStyle(traitId: String): Mono<Void> =
        hairStyleRepository.deleteById(traitId)
}
