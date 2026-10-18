import { useDisclosure } from '@siberiacancode/reactuse';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

import { usePostApiDeliveryOrderMutation } from '@/generated/api';
import { formatAddress, formatFio } from '@/shared/lib/format';
import { Button } from '@/shared/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/shared/ui/dialog';
import { H2, H3, Small } from '@/shared/ui/typography';

import { useDeliveryContext } from '../context';

export const OrderReviewStep = () => {
  const context = useDeliveryContext();
  const deliveryOrderMutation = usePostApiDeliveryOrderMutation();

  const {
    packageId,
    payer,
    price,
    optionType,
    senderAddress,
    senderPointId,
    receiverPointId,
    receiverAddress,
    sender,
    receiver
  } = context.deliveryOrder;

  const successDisclosure = useDisclosure();
  const navigate = useNavigate();

  const handleCreateDelivery = () => {
    deliveryOrderMutation.mutate(
      {
        body: {
          packageId,
          optionType: optionType as any,
          payer: payer as any,
          receiver,
          receiverAddress,
          receiverPointId,
          sender,
          senderAddress,
          senderPointId
        }
      },
      {
        onSuccess: () => successDisclosure.open(),
        onError: () => toast.error('Failed to create the request')
      }
    );
  };

  const handleNavigateToHome = () => navigate('/');
  const handleNavigateToHistory = () => navigate('/history');

  return (
    <>
      <div>
        <H3 className='mt-6'>Your order</H3>
        <div className='mt-8 grid grid-cols-1 gap-8 md:grid-cols-2'>
          <div className='col-span-1 flex flex-col gap-2'>
            <Small className='text-muted-foreground font-light'>Delivery type</Small>
            <Small className='font-light'>
              {optionType === 'default' ? 'Standard delivery' : 'Express delivery'}
            </Small>
          </div>
          <div className='col-span-1 flex flex-col gap-2'>
            <Small className='text-muted-foreground font-light'>Pickup address</Small>
            <Small className='font-light'>{formatAddress(receiverAddress)}</Small>
          </div>
          <div className='col-span-1 flex flex-col gap-2'>
            <Small className='text-muted-foreground font-light'>Receiver</Small>
            <Small className='font-light'>{formatFio(receiver)}</Small>
          </div>
          <div className='col-span-1 flex flex-col gap-2'>
            <Small className='text-muted-foreground font-light'>Delivery address</Small>
            <Small className='font-light'>{formatAddress(senderAddress)}</Small>
          </div>
          <div className='col-span-1 flex flex-col gap-2'>
            <Small className='text-muted-foreground font-light'>Sender</Small>
            <Small className='font-light'>{formatFio(sender)}</Small>
          </div>
          <div className='col-span-1 flex flex-col gap-2'>
            <Small className='text-muted-foreground font-light'>Who pays for delivery</Small>
            <Small className='font-light'>{payer === 'sender' ? 'Sender' : 'Receiver'}</Small>
          </div>
          <div className='col-span-1 flex flex-col gap-2'>
            <H2>Total: {price}₽</H2>
          </div>
        </div>
        <div className='mt-10 flex gap-2'>
          <Button
            className='flex-1'
            disabled={deliveryOrderMutation.isPending}
            size='lg'
            variant='secondary'
            onClick={context.stepper.back}
          >
            Back
          </Button>
          <Button
            className='flex-1'
            disabled={deliveryOrderMutation.isPending}
            size='lg'
            onClick={handleCreateDelivery}
          >
            Continue
          </Button>
        </div>
      </div>
      <Dialog open={successDisclosure.opened}>
        <DialogContent className='sm:max-w-lg' showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Your package is already on its way!</DialogTitle>
            <DialogDescription>
              We've accepted your request and will hand it off to the courier shortly. You can track
              the delivery status in the "My Orders" section.
            </DialogDescription>
          </DialogHeader>
          <img alt='success-feedback' className='mx-auto my-8 w-48' src='/success-feedback.png' />
          <div className='flex gap-2'>
            <Button className='flex-1' size='lg' onClick={handleNavigateToHome}>
              Go home
            </Button>
            <Button className='bg-brand flex-1' size='lg' onClick={handleNavigateToHistory}>
              Order status
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
