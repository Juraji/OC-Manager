package nl.juraji.ocManager.domain

import nl.juraji.ocManager.domain.traits.*
import nl.juraji.ocManager.util.orElseEntityNotFound
import org.springframework.stereotype.Service
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

@Service
class TraitService(
    private val bodyTypeRepository: BodyTypeRepository,
    private val customTraitRepository: CustomTraitRepository,
    private val ethnicityRepository: EthnicityRepository,
    private val eyeColorRepository: EyeColorRepository,
    private val genderRepository: GenderRepository,
    private val hairStyleRepository: HairStyleRepository,
    private val sexualityRepository: SexualityRepository,
) {
    // Body types
    fun getAllBodyTypes(): Flux<OcBodyType> =
        bodyTypeRepository.findAll()

    fun createBodyType(trait: OcBodyType): Mono<OcBodyType> =
        bodyTypeRepository.save(trait)

    fun updateBodyType(traitId: String, trait: OcBodyType): Mono<OcBodyType> =
        bodyTypeRepository
            .findById(traitId)
            .orElseEntityNotFound(OcBodyType::class, traitId)
            .map { trait.copy(id = it.id) }
            .flatMap(bodyTypeRepository::save)

    fun deleteBodyType(traitId: String): Mono<Void> =
        bodyTypeRepository.deleteById(traitId)

    // Custom traits
    fun getAllCustomTraits(): Flux<OcCustomTrait> =
        customTraitRepository.findAll()

    fun createCustomTrait(trait: OcCustomTrait): Mono<OcCustomTrait> =
        customTraitRepository.save(trait)

    fun updateCustomTrait(traitId: String, trait: OcCustomTrait): Mono<OcCustomTrait> =
        customTraitRepository
            .findById(traitId)
            .orElseEntityNotFound(OcCustomTrait::class, traitId)
            .map { trait.copy(id = it.id) }
            .flatMap(customTraitRepository::save)

    fun deleteCustomTrait(traitId: String): Mono<Void> =
        customTraitRepository.deleteById(traitId)

    // Ethnicities
    fun getAllEthnicities(): Flux<OcEthnicity> =
        ethnicityRepository.findAll()

    fun createEthnicity(trait: OcEthnicity): Mono<OcEthnicity> =
        ethnicityRepository.save(trait)

    fun updateEthnicity(traitId: String, trait: OcEthnicity): Mono<OcEthnicity> =
        ethnicityRepository
            .findById(traitId)
            .orElseEntityNotFound(OcEthnicity::class, traitId)
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
            .orElseEntityNotFound(OcEyeColor::class, traitId)
            .map { trait.copy(id = it.id) }
            .flatMap(eyeColorRepository::save)

    fun deleteEyeColor(traitId: String): Mono<Void> =
        eyeColorRepository.deleteById(traitId)

    // Gender preferences
    fun getAllGenders(): Flux<OcGender> =
        genderRepository.findAll()

    fun createGender(trait: OcGender): Mono<OcGender> =
        genderRepository.save(trait)

    fun updateGender(traitId: String, trait: OcGender): Mono<OcGender> =
        genderRepository
            .findById(traitId)
            .orElseEntityNotFound(OcGender::class, traitId)
            .map { trait.copy(id = it.id) }
            .flatMap(genderRepository::save)

    fun deleteGender(traitId: String): Mono<Void> =
        genderRepository.deleteById(traitId)

    // Hair styles
    fun getAllHairStyles(): Flux<OcHairStyle> =
        hairStyleRepository.findAll()

    fun createHairStyle(trait: OcHairStyle): Mono<OcHairStyle> =
        hairStyleRepository.save(trait)

    fun updateHairStyle(traitId: String, trait: OcHairStyle): Mono<OcHairStyle> =
        hairStyleRepository
            .findById(traitId)
            .orElseEntityNotFound(OcHairStyle::class, traitId)
            .map { trait.copy(id = it.id) }
            .flatMap(hairStyleRepository::save)

    fun deleteHairStyle(traitId: String): Mono<Void> =
        hairStyleRepository.deleteById(traitId)

    // Sexuality
    fun getAllSexualities(): Flux<OcSexuality> =
        sexualityRepository.findAll()

    fun createSexuality(trait: OcSexuality): Mono<OcSexuality> =
        sexualityRepository.save(trait)

    fun updateSexuality(traitId: String, trait: OcSexuality): Mono<OcSexuality> =
        sexualityRepository
            .findById(traitId)
            .orElseEntityNotFound(OcSexuality::class, traitId)
            .map { trait.copy(id = it.id) }
            .flatMap(sexualityRepository::save)

    fun deleteSexuality(traitId: String): Mono<Void> =
        sexualityRepository.deleteById(traitId)
}
