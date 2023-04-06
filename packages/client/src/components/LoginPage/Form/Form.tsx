import Form from '@/components/Form/Form';
import {
  EnumFormFields,
  mapFormFieldToInputComponent,
  mapFormFieldToProps,
} from './inputs';

export function LoginPageForm() {
  return (
    <Form<EnumFormFields>
      debugName="LoginForm"
      enumInputFields={EnumFormFields}
      onSubmitCallback={() => {
        // TODO: login service
      }}
      mapFormFieldToInputComponent={mapFormFieldToInputComponent}
      mapFormFieldToProps={mapFormFieldToProps}></Form>
  );
}
