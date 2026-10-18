import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import z from 'zod';

import { Form, FormInput, FormTextarea } from '@/shared/form';
import { Button } from '@/shared/ui/button';

import { useDeliveryContext } from '../context';

const deliveryAddressFormSchema = z.object({
  street: z.string().min(2, 'Enter street name').max(30, 'Street name is too long'),
  house: z.string().min(1, 'Enter house number').regex(/^\d+$/, 'Digits only'),
  apartment: z.string().min(1, 'Enter apartment number').regex(/^\d+$/, 'Digits only'),
  comment: z.string()
});

export type DeliveryAddressFormFields = z.infer<typeof deliveryAddressFormSchema>;

export const DeliveryAddressStep = () => {
  const context = useDeliveryContext();
  const senderAddress = context.deliveryOrder.senderAddress ?? {};

  const form = useForm<DeliveryAddressFormFields>({
    resolver: zodResolver(deliveryAddressFormSchema),
    defaultValues: {
      street: senderAddress.street ?? '',
      house: senderAddress.house ?? '',
      apartment: senderAddress.apartment ?? '',
      comment: senderAddress.comment ?? ''
    }
  });

  const handleSubmitForm = (fields: DeliveryAddressFormFields) => {
    context.setDeliveryOrder({ ...context.deliveryOrder, senderAddress: fields });
    context.stepper.next();
  };

  return (
    <Form key='phone_form' className='w-full' form={form} onSubmit={handleSubmitForm}>
      <div className='flex flex-col gap-4 pr-4'>
        <FormInput label='Street' name='street' placeholder='Street' />
        <FormInput inputMode='numeric' label='House' name='house' placeholder='House number' />
        <FormInput
          inputMode='numeric'
          label='Apartment'
          name='apartment'
          placeholder='Apartment number'
        />
        <FormTextarea
          className='max-h-40'
          label='Note for the courier'
          maxLength={200}
          name='comment'
          placeholder='Comment for the courier'
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
