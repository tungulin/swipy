import type { ComponentProps, FormHTMLAttributes, ReactNode } from 'react';
import type { FieldValues, UseFormReturn } from 'react-hook-form';

import { Controller, FormProvider, useFormContext } from 'react-hook-form';

import { Field, FieldDescription, FieldError, FieldLabel } from './ui/field';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';

interface FormProps<T extends FieldValues> extends Omit<
  FormHTMLAttributes<HTMLFormElement>,
  'onSubmit'
> {
  form: UseFormReturn<T>;
  onSubmit: (values: T) => void;
}

export const Form = <T extends FieldValues>({ form, onSubmit, ...other }: FormProps<T>) => (
  <FormProvider {...form}>
    <form {...other} onSubmit={form.handleSubmit(onSubmit)} />
  </FormProvider>
);
interface FormInputProps extends ComponentProps<'input'> {
  description?: ReactNode;
  label?: ReactNode;
  name: string;
}

export const FormInput = ({ label, description, name, ...other }: FormInputProps) => {
  const form = useFormContext();

  return (
    <Controller
      render={({ field, fieldState }) => (
        <Field>
          {label && <FieldLabel data-invalid={fieldState.invalid}>{label}</FieldLabel>}
          <Input {...field} {...other} />
          {description && (
            <FieldDescription>Your API key is encrypted and stored securely.</FieldDescription>
          )}
          <FieldError errors={[fieldState.error]} />
        </Field>
      )}
      control={form.control}
      name={name}
      rules={{ required: true }}
    />
  );
};

interface TextAreaProps extends ComponentProps<'textarea'> {
  description?: ReactNode;
  label?: ReactNode;
  name: string;
}

export const FormTextarea = ({ label, description, name, ...other }: TextAreaProps) => {
  const form = useFormContext();

  return (
    <Controller
      render={({ field, fieldState }) => (
        <Field>
          {label && <FieldLabel data-invalid={fieldState.invalid}>{label}</FieldLabel>}
          <Textarea {...field} {...other} />
          {description && (
            <FieldDescription>Your API key is encrypted and stored securely.</FieldDescription>
          )}
          <FieldError errors={[fieldState.error]} />
        </Field>
      )}
      control={form.control}
      name={name}
      rules={{ required: true }}
    />
  );
};
