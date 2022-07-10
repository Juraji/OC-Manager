package nl.juraji.ocManager.util.validators

import org.springframework.beans.PropertyAccessorFactory
import javax.validation.Constraint
import javax.validation.ConstraintValidator
import javax.validation.ConstraintValidatorContext
import javax.validation.Payload
import kotlin.reflect.KClass

/*
  Usage:
  @RequiredIfFieldValue(
    sourceFieldName = <name of field that needs to be checked against>,
    sourceFieldValue = <value that sourceFieldName needs to have in order to enforce targetFieldName required rule>
    targetFieldName = <name of field that needs to be required>,
  )

  Example usage(single):
  @RequiredIfFieldValue(targetFieldName = "debtCollectionNumber", sourceFieldName = "enableAutomaticDebtCollection", sourceFieldValue = "true")

  Example usage(list):
  @RequiredIfFieldValue.List(
    RequiredIfFieldValue(targetFieldName = "debtCollectionNumber", sourceFieldName = "enableAutomaticDebtCollection", sourceFieldValue = "true"),
    RequiredIfFieldValue(targetFieldName = "vatIdentificationNumber", sourceFieldName = "enableDebtCollectionRegistrationForm", sourceFieldValue = "true"),
    RequiredIfFieldValue(targetFieldName = "membershipFeeInvoiceDescription", sourceFieldName = "useDefaultInvoiceDescription", sourceFieldValue = "false"),
    ...
  )
 */

@Target(AnnotationTarget.TYPE, AnnotationTarget.CLASS)
@Retention(AnnotationRetention.RUNTIME)
@Constraint(validatedBy = [RequiredIfFieldValueValidator::class])
annotation class RequiredIfFieldValue(
    val sourceFieldName: String,
    val sourceFieldValue: String,
    val targetFieldName: String,
    val message: String = "{javax.validation.constraints.NotBlank.message}",
    val groups: Array<KClass<*>> = [],
    val payload: Array<KClass<out Payload>> = []
) {
    @Target(AnnotationTarget.TYPE, AnnotationTarget.CLASS)
    @Repeatable
    @Retention(AnnotationRetention.RUNTIME)
    annotation class List(vararg val value: RequiredIfFieldValue)

    companion object {
        const val ANYTHING = "*"
        const val BOOL_TRUE = "true"
        const val BOOL_FALSE = "false"
    }
}

class RequiredIfFieldValueValidator : ConstraintValidator<RequiredIfFieldValue, Any> {
    private lateinit var sourceFieldName: String
    private lateinit var sourceFieldValue: String
    private lateinit var targetFieldName: String
    private lateinit var message: String

    override fun initialize(annotation: RequiredIfFieldValue) {
        sourceFieldName = annotation.sourceFieldName
        sourceFieldValue = annotation.sourceFieldValue.lowercase()
        targetFieldName = annotation.targetFieldName
        message = annotation.message
    }

    override fun isValid(value: Any, ctx: ConstraintValidatorContext): Boolean {
        val beanWrapper = PropertyAccessorFactory.forBeanPropertyAccess(value)
        val sourceFieldValue: String? = beanWrapper.getPropertyValue(sourceFieldName)?.toString()?.lowercase()
        val targetFieldValue: String? = beanWrapper.getPropertyValue(targetFieldName)?.toString()?.lowercase()

        if (!sourceFieldValue.isNullOrBlank() && targetFieldValue.isNullOrBlank()) {
            if (this.sourceFieldValue == RequiredIfFieldValue.ANYTHING || this.sourceFieldValue == sourceFieldValue) {
                buildViolationInContext(ctx)
                return false
            }
        }

        return true
    }

    private fun buildViolationInContext(ctx: ConstraintValidatorContext) = ctx.run {
        disableDefaultConstraintViolation()
        buildConstraintViolationWithTemplate(message)
            .addPropertyNode(targetFieldName)
            .addConstraintViolation()
    }

}

