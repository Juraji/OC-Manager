package nl.juraji.ocManager.api

import nl.juraji.ocManager.domain.TraitService
import nl.juraji.ocManager.domain.traits.*
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
import javax.validation.Valid

@RestController
@RequestMapping("/traits")
class TraitManagementController(
    private val traitService: TraitService
) {
    // Body types
    @GetMapping("/body-types")
    fun getAllBodyTypes(): Flux<OcBodyType> = traitService.getAllBodyTypes()

    @PostMapping("/body-types")
    fun createBodyType(
        @Valid @RequestBody trait: OcBodyType
    ): Mono<OcBodyType> = traitService.createBodyType(trait)

    @PutMapping("/body-types/{traitId})")
    fun updateBodyType(
        @PathVariable traitId: String,
        @Valid @RequestBody trait: OcBodyType
    ): Mono<OcBodyType> =
        traitService.updateBodyType(traitId, trait)

    @DeleteMapping("/body-types/{traitId}")
    fun deleteBodyType(
        @PathVariable traitId: String
    ): Mono<Void> = traitService.deleteBodyType(traitId)

    // Custom traits
    @GetMapping("/custom-traits")
    fun getAllCustomTraits(): Flux<OcCustomTrait> = traitService.getAllCustomTraits()

    @PostMapping("/custom-traits")
    fun createCustomTrait(
        @Valid @RequestBody trait: OcCustomTrait
    ): Mono<OcCustomTrait> = traitService.createCustomTrait(trait)

    @PutMapping("/custom-traits/{traitId})")
    fun updateCustomTrait(
        @PathVariable traitId: String,
        @Valid @RequestBody trait: OcCustomTrait
    ): Mono<OcCustomTrait> =
        traitService.updateCustomTrait(traitId, trait)

    @DeleteMapping("/custom-traits/{traitId}")
    fun deleteCustomTrait(
        @PathVariable traitId: String
    ): Mono<Void> = traitService.deleteCustomTrait(traitId)

    // Ethnicities
    @GetMapping("/ethnicities")
    fun getAllEthnicities(): Flux<OcEthnicity> = traitService.getAllEthnicities()

    @PostMapping("/ethnicities")
    fun createEthnicity(
        @Valid @RequestBody trait: OcEthnicity
    ): Mono<OcEthnicity> = traitService.createEthnicity(trait)

    @PutMapping("/ethnicities/{traitId})")
    fun updateEthnicity(
        @PathVariable traitId: String,
        @Valid @RequestBody trait: OcEthnicity
    ): Mono<OcEthnicity> =
        traitService.updateEthnicity(traitId, trait)

    @DeleteMapping("/ethnicities/{traitId}")
    fun deleteEthnicity(
        @PathVariable traitId: String
    ): Mono<Void> = traitService.deleteEthnicity(traitId)

    // Eye colors
    @GetMapping("/eye-colors")
    fun getAllEyeColors(): Flux<OcEyeColor> = traitService.getAllEyeColors()

    @PostMapping("/eye-colors")
    fun createEyeColor(
        @Valid @RequestBody trait: OcEyeColor
    ): Mono<OcEyeColor> = traitService.createEyeColor(trait)

    @PutMapping("/eye-colors/{traitId})")
    fun updateEyeColor(
        @PathVariable traitId: String,
        @Valid @RequestBody trait: OcEyeColor
    ): Mono<OcEyeColor> = traitService.updateEyeColor(traitId, trait)

    @DeleteMapping("/eye-colors/{traitId}")
    fun deleteEyeColor(
        @PathVariable traitId: String
    ): Mono<Void> = traitService.deleteEyeColor(traitId)

    // Gender preferences
    @GetMapping("/genders")
    fun getAllGenders(): Flux<OcGender> = traitService.getAllGenders()

    @PostMapping("/genders")
    fun createGender(
        @Valid @RequestBody trait: OcGender
    ): Mono<OcGender> = traitService.createGender(trait)

    @PutMapping("/genders/{traitId})")
    fun updateGender(
        @PathVariable traitId: String,
        @Valid @RequestBody trait: OcGender
    ): Mono<OcGender> = traitService.updateGender(traitId, trait)

    @DeleteMapping("/genders/{traitId}")
    fun deleteGenderPreference(
        @PathVariable traitId: String
    ): Mono<Void> = traitService.deleteGender(traitId)

    // Hair styles
    @GetMapping("/hairstyles")
    fun getAllHairStyles(): Flux<OcHairStyle> = traitService.getAllHairStyles()

    @PostMapping("/hairstyles")
    fun createHairStyle(
        @Valid @RequestBody trait: OcHairStyle
    ): Mono<OcHairStyle> = traitService.createHairStyle(trait)

    @PutMapping("/hairstyles/{traitId})")
    fun updateHairStyle(
        @PathVariable traitId: String,
        @Valid @RequestBody trait: OcHairStyle
    ): Mono<OcHairStyle> = traitService.updateHairStyle(traitId, trait)

    @DeleteMapping("/hairstyles/{traitId}")
    fun deleteHairStyle(
        @PathVariable traitId: String
    ): Mono<Void> = traitService.deleteHairStyle(traitId)

    // Sexualities
    @GetMapping("/sexualities")
    fun getAllSexualities(): Flux<OcSexuality> = traitService.getAllSexualities()

    @PostMapping("/sexualities")
    fun createSexuality(
        @Valid @RequestBody trait: OcSexuality
    ): Mono<OcSexuality> = traitService.createSexuality(trait)

    @PutMapping("/sexualities/{traitId})")
    fun updateSexuality(
        @PathVariable traitId: String,
        @Valid @RequestBody trait: OcSexuality
    ): Mono<OcSexuality> = traitService.updateSexuality(traitId, trait)

    @DeleteMapping("/sexualities/{traitId}")
    fun deleteSexuality(
        @PathVariable traitId: String
    ): Mono<Void> = traitService.deleteSexuality(traitId)
}
