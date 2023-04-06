import { useCallback } from 'react';
import { FormContextValue, FormValidationMod } from '../_typings';
import type { FormInputRef } from '../Input/_typings';

type Args<EnumFields extends string> = {
  enumInputFields: Record<string, EnumFields>;
  formContext: FormContextValue<EnumFields>;
};

export function useFormValidation<EnumFields extends string = string>({
  formContext,
}: Args<EnumFields>) {
  const { inputsRefs, submitRef } = formContext.formRefs;

  const validateForm = useCallback(
    (() => {
      type ValidationStatuses = FormContextValue<EnumFields>['inputsAreValid'];
      let validationStatuses: ValidationStatuses | null = null;

      return function validationFunc({
        shouldForceValidateFields,
      }: FormValidationMod) {
        const currentStatuses = formContext.inputsAreValid;
        if (currentStatuses === validationStatuses) {
          console.log(
            `VALIDATION STATUSES UNCHANGED: ${JSON.stringify(currentStatuses)}`
          );

          if (!shouldForceValidateFields) {
            return !!formContext.isFormValid;
          }
        }

        console.log(
          `VALIDATION STATUSES: ${JSON.stringify(
            validationStatuses
          )} -> ${JSON.stringify(currentStatuses)}`
        );
        validationStatuses = currentStatuses;

        if (shouldForceValidateFields) {
          Object.entries<FormInputRef>(inputsRefs).forEach(
            ([inputName, inputRef]) => {
              const inputValue =
                formContext.inputsValues[inputName as EnumFields];
              inputRef.current?.setValueAndValidate(inputValue);
            }
          );
        }
        const isFormValid = Object.values<boolean>(validationStatuses).every(
          isInputValid => isInputValid
        );

        formContext.isFormValid = isFormValid;
        return isFormValid;
      };
    })(),
    []
  );

  const updateIsFormValid = (
    { shouldForceValidateFields }: FormValidationMod = {
      shouldForceValidateFields: false,
    }
  ) => {
    const isFormValid = validateForm({ shouldForceValidateFields });
    submitRef.current?.updateIsDisabled({ isFormValid });
  };
  formContext.updateIsFormValid = updateIsFormValid;

  return {
    updateIsFormValid,
  };
}
