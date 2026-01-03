import type { HttpContext } from '@adonisjs/core/http'
import { createRegisterValidator, registerQueryValidator, storeRegisterValidator } from '#validators/register_validator'
import RegisterInviteLink from '#models/register_invite_link'
import { registerCodeValidator } from '#validators/register_code_validator'
import { emailValidator } from '#validators/email_validator'
import { dd } from '@adonisjs/core/services/dumper'
import { passwordValidator } from '#validators/password_validator'
import { createVerifyRegisterCodeValidator } from '#validators/register_validator'
import { mapVineJSValidationErrorMessages } from '../helpers/map_vinejs_validation_error_messages.js'
import router from '@adonisjs/core/services/router'
import User from '#models/user'
import Gender from '#models/gender'
import { DateTime } from 'luxon'
import { mapUserWithUserData } from '../helpers/mapper/user_data_mapper.js'
import { EmailAlreadyRegisteredException } from '../helpers/custom_exceptions.js'
import PersonTitleName from '#models/person_title_name'
import { Infer } from '@vinejs/vine/types'

export default class RegisterController {
    /**
    * Display form to create a new record
    */
    async create({ view, request, response, session }: HttpContext) {
      const isHx = request.header('hx-request') ? true : false
      const rawData = request.all() as Partial<Record<keyof Infer<typeof createRegisterValidator>, string>>

      try {
        const validatedData = await request.validateUsing(createRegisterValidator)
        
        return isHx
          ? await view.render('components/form/register', {
              registerCodeValue: validatedData.register_code,
              emailValue: validatedData.email
            })
          : response.ok(
              await view.render('pages/auth/register/index', {
                registerCodeValue: validatedData.register_code,
                emailValue: validatedData.email
              })
            )

      } catch (error) {
        if (error.code !== 'E_VALIDATION_ERROR') {
          throw error
        }
        
        const errorMessages = mapVineJSValidationErrorMessages(error) as Infer<typeof createRegisterValidator>

        return isHx
          ? await view.render('components/form/verify_register_code', {
              registerCodeValue: rawData.register_code,
              registerCodeErrorMessage: errorMessages?.register_code,
              emailValue: rawData.email,
              emailErrorMessage: errorMessages?.email
            })
          : response.ok(
              await view.render('pages/auth/register/verify_register_code', {
                registerCodeValue: rawData.register_code,
                registerCodeErrorMessage: errorMessages?.register_code,
                emailValue: rawData.email,
                emailErrorMessage: errorMessages?.email
              })
            )
      }

      if (rawData.register_code) {
        
      }
      else {
        return isHx
          ? await view.render('components/form/verify_register_code')
          : response.ok(
              await view.render('pages/auth/register/verify_register_code')
            )
      }
    }

    /**
    * Handle form submission for the create action
    */
    async store({ view, request, response, auth }: HttpContext) {
      const isHx = request.header('hx-request') === 'true' ? true : false
      const rawData = request.all() as Infer<typeof storeRegisterValidator>
      
      let gendersMapped: {
        value: number
        label: string
        isSelected: boolean
      }[] = []
      let selectedGenderId: number = 0
      
      if (selectedGenderId) {
        const genders = await Gender.query().limit(10)
        gendersMapped = genders.map(gender => ({
          value: gender.id,
          label: gender.name,
          isSelected: selectedGenderId === gender.id
        }))
      }

      let personTitleNamesMapped: {
        value: number
        label: string
        isSelected: boolean
      }[] = []
      let selectedPersonTitleNamesId: number[] = [];

      if (selectedPersonTitleNamesId) {
        const personTitleNames = await PersonTitleName.findMany(selectedPersonTitleNamesId)
        personTitleNamesMapped = personTitleNames.map(personTitleName => ({
          value: personTitleName.id,
          label: personTitleName.name,
          isSelected: selectedPersonTitleNamesId.includes(personTitleName.id)
        }))
      }

      try {
        const validatedData = await request.validateUsing(storeRegisterValidator)

        selectedGenderId = validatedData.gender_id
        
        selectedPersonTitleNamesId = validatedData.person_title_name_ids
        
        const user = await User.registerNewUserWithRegisterCode(
          validatedData.register_code,
          validatedData.full_name,
          validatedData.email,
          validatedData.password,
          validatedData.personal_phone_number,
          DateTime.fromJSDate(validatedData.birth_date),
          validatedData.birth_place,
          validatedData.full_home_address,
          validatedData.gender_id,
          validatedData.person_title_name_ids
        )
        
        if (user.latest_user_data) {
          await auth.use().login(user.latest_user_data)
        }

        return isHx
          ? response.header('hx-redirect', router.makeUrl('account.profile')).noContent()
          : response.redirect().toRoute('account.profile')

      } catch (error) {
        let errorMessages: Partial<Record<keyof Infer<typeof storeRegisterValidator>, string>> = {};

        if (error.code === 'E_VALIDATION_ERROR') {
          errorMessages = mapVineJSValidationErrorMessages(error) as Partial<Record<keyof Infer<typeof storeRegisterValidator>, string>>
        }
        else if (error instanceof EmailAlreadyRegisteredException) {
          errorMessages.email = 'Email already registered'
        } 
        else {
          throw error
        }
        
        return isHx
          ? response.ok(
              await view.render('components/form/register', {
                registerCodeValue: rawData?.register_code,
                registerCodeErrorMessage: errorMessages?.register_code,
                fullNameValue: rawData?.full_name,
                fullNameErrorMessage: errorMessages?.full_name,
                personTitleNameValue: personTitleNamesMapped,
                personTitleNameErrorMessage: errorMessages?.person_title_name_ids,
                genderValue: gendersMapped,
                genderErrorMessage: errorMessages?.gender_id,
                birthDateValue: rawData?.birth_date,
                birthDateErrorMessage: errorMessages?.birth_date,
                birthPlaceValue: rawData?.birth_place,
                birthPlaceErrorMessage: errorMessages?.birth_place,
                fullHomeAddressValue: rawData?.full_home_address,
                fullHomeAddressErrorMessage: errorMessages?.full_home_address,
                personalPhoneNumberValue: rawData?.personal_phone_number,
                personalPhoneNumberErrorMessage: errorMessages?.personal_phone_number,
                emailValue: rawData?.email,
                emailErrorMessage: errorMessages?.email,
                passwordValue: rawData?.password,
                passwordErrorMessage: errorMessages?.password,
                passwordConfirmationValue: rawData?.password_confirmation,
                passwordConfirmationErrorMessage: errorMessages?.password_confirmation
              })
          )
          : response.ok(
              await view.render('pages/auth/register/index', {
                registerCodeValue: rawData?.register_code,
                registerCodeErrorMessage: errorMessages?.register_code,
                fullNameValue: rawData?.full_name,
                fullNameErrorMessage: errorMessages?.full_name,
                personTitleNameValue: rawData?.person_title_name_ids,
                personTitleNameErrorMessage: errorMessages?.person_title_name_ids,
                genderValue: rawData?.gender_id,
                genderErrorMessage: errorMessages?.gender_id,
                birthDateValue: rawData?.birth_date,
                birthDateErrorMessage: errorMessages?.birth_date,
                birthPlaceValue: rawData?.birth_place,
                birthPlaceErrorMessage: errorMessages?.birth_place,
                fullHomeAddressValue: rawData?.full_home_address,
                fullHomeAddressErrorMessage: errorMessages?.full_home_address,
                personalPhoneNumberValue: rawData?.personal_phone_number,
                personalPhoneNumberErrorMessage: errorMessages?.personal_phone_number,
                emailValue: rawData?.email,
                emailErrorMessage: errorMessages?.email,
                passwordValue: rawData?.password,
                passwordErrorMessage: errorMessages?.password,
                passwordConfirmationValue: rawData?.password_confirmation,
                passwordConfirmationErrorMessage: errorMessages?.password_confirmation
              })
            )
      }
    }
    
}