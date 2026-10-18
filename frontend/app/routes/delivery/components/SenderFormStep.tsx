import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { withMask } from 'use-mask-input';
import z from 'zod';

import { PHONE_REGEX, SINGLE_WORD_REGEX } from '@/shared/const';
import { Form, FormInput } from '@/shared/form';
import { Button } from '@/shared/ui/button';

import { useDeliveryContext } from '../context';

const senderFormSchema = z.object({
  lastname: z
    .string()
    .min(2, 'Last name must contain at least 2 characters')
    .max(20, 'Last name is too long')
    .regex(SINGLE_WORD_REGEX, 'Must be a single word without spaces'),
  firstname: z
    .string()
    .min(2, 'First name must contain at least 2 characters')
    .max(20, 'First name is too long')
    .regex(SINGLE_WORD_REGEX, 'Must be a single word without spaces'),
  middlename: z
    .string()
    .min(2, 'Middle name must contain at least 2 characters')
    .max(20, 'Middle name is too long')
    .regex(SINGLE_WORD_REGEX, 'Must be a single word without spaces'),
  phone: z.string().regex(PHONE_REGEX, 'Enter the phone in the format +7 (999) 999-99-99')
});

export type SenderFormFields = z.infer<typeof senderFormSchema>;

export const SenderFormStep = () => {
  const context = useDeliveryContext();
  const sender = context.deliveryOrder.sender ?? {};

  const form = useForm<SenderFormFields>({
    resolver: zodResolver(senderFormSchema),
    defaultValues: {
      lastname: sender.lastname ?? '',
      firstname: sender.firstname ?? '',
      middlename: sender.middlename ?? '',
      phone: sender.phone ?? ''
    }
  });

  const handleSubmitForm = (fields: SenderFormFields) => {
    const phone = fields.phone.replace(/\D/g, '');
    context.setDeliveryOrder({ ...context.deliveryOrder, sender: { ...fields, phone } });
    context.stepper.next();
  };

  return (
    <Form key='phone_form' className='w-full' form={form} onSubmit={handleSubmitForm}>
      <div className='flex flex-col gap-4 pr-4'>
        <FormInput label='Last name' name='lastname' placeholder='Dinosaurov' />
        <FormInput label='First name' name='firstname' placeholder='Dino' />
        <FormInput label='Middle name' name='middlename' placeholder='Dinovich' />
        <FormInput
          ref={withMask('+7 (999) 999-99-99')}
          label='Phone'
          name='phone'
          placeholder='+7 (___) ___-__-__'
        />
      </div>
      <div>
        <div className='mt-5 flex gap-2'>
          <Button className='flex-1' size='lg' variant='secondary' onClick={context.stepper.back}>
            Back
          </Button>
          <Button className='flex-1' size='lg' type='submit'>
            Next
          </Button>
        </div>
      </div>
    </Form>
  );
};
