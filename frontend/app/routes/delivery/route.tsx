import { useStep } from '@siberiacancode/reactuse';
import { IconHome } from '@tabler/icons-react';
import { useState } from 'react';
import { Link } from 'react-router';
import { Fragment } from 'react/jsx-runtime';

import { Container } from '@/layout';
import { formatAddress, formatFio } from '@/shared/lib/format';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator
} from '@/shared/ui/breadcrumb';
import { Progress } from '@/shared/ui/progress';
import { H3, Small } from '@/shared/ui/typography';

import type { DeliveryOrder } from './context';

import { DeliveryAddressStep } from './components/DeliveryAddressStep';
import { DeliveryPaymentStep } from './components/DeliveryPaymentStep';
import { DeliveryTypeStep } from './components/DeliveryTypeStep';
import { OrderReviewStep } from './components/OrderReviewStep';
import { PickupAddressStep } from './components/PickupAddressStep';
import { ReceiverFormStep } from './components/ReceiverFormStep';
import { SenderFormStep } from './components/SenderFormStep';
import { DeliveryProvider } from './context';

const STEPPERS = [
  { title: 'Delivery type', node: DeliveryTypeStep },
  { title: 'Receiver', node: ReceiverFormStep },
  { title: 'Sender', node: SenderFormStep },
  { title: 'Pickup address', node: PickupAddressStep },
  { title: 'Delivery address', node: DeliveryAddressStep },
  { title: 'Delivery payment', node: DeliveryPaymentStep },
  { title: 'Review order', node: OrderReviewStep }
] as const;

const Delivery = () => {
  const stepper = useStep(7);

  const [deliveryOrder, setDeliveryOrder] = useState<DeliveryOrder>({} as DeliveryOrder);

  const Step = STEPPERS[stepper.currentStep - 1].node;

  const { optionType, receiver, sender, senderAddress, receiverAddress, payer } = deliveryOrder;

  return (
    <DeliveryProvider value={{ stepper, deliveryOrder, setDeliveryOrder }}>
      <Container>
        <div className='mt-5'>
          <Breadcrumb className='mb-5'>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink
                  render={
                    <Link to='/'>
                      <IconHome size={16} />
                    </Link>
                  }
                />
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              {Array.from({ length: stepper.currentStep }).map((_, index) => {
                const title = STEPPERS[index].title;
                return (
                  <Fragment key={title}>
                    <BreadcrumbItem onClick={() => stepper.set(index)}>{title}</BreadcrumbItem>
                    {stepper.counts !== index + 1 && <BreadcrumbSeparator />}
                  </Fragment>
                );
              })}
            </BreadcrumbList>
          </Breadcrumb>
          <div className='flex h-full min-h-[600px] grid-cols-3 flex-col gap-4 md:grid'>
            <div className='col-span-2 h-full'>
              <H3>{STEPPERS[stepper.currentStep - 1].title}</H3>
              <div className='my-5'>
                <Small>Step {stepper.currentStep} of 7</Small>
                <Progress className='mt-3' value={(stepper.currentStep / 7) * 100} />
              </div>
              {Step && <Step />}
            </div>
            {stepper.currentStep !== 7 && (
              <div className='bg-secondary hidden flex-1 rounded-2xl p-6 md:block'>
                <H3 className='mb-4'>Your order</H3>
                <div className='flex flex-col gap-6'>
                  <div className='flex flex-col gap-2'>
                    <Small className='text-muted-foreground font-light'>Delivery type</Small>
                    <Small className='font-light'>
                      {optionType
                        ? optionType === 'express'
                          ? 'Express delivery'
                          : 'Standard delivery'
                        : '-'}
                    </Small>
                  </div>
                  <div className='flex flex-col gap-2'>
                    <Small className='text-muted-foreground font-light'>Receiver</Small>
                    <Small className='font-light'>{receiver ? formatFio(receiver) : '-'}</Small>
                  </div>
                  <div className='flex flex-col gap-2'>
                    <Small className='text-muted-foreground font-light'>Sender</Small>
                    <Small className='font-light'>{sender ? formatFio(sender) : '-'}</Small>
                  </div>
                  <div className='flex flex-col gap-2'>
                    <Small className='text-muted-foreground font-light'>Delivery address</Small>
                    <Small className='font-light'>
                      {receiverAddress ? formatAddress(receiverAddress) : '-'}
                    </Small>
                  </div>
                  <div className='flex flex-col gap-2'>
                    <Small className='text-muted-foreground font-light'>Pickup address</Small>
                    <Small className='font-light'>
                      {senderAddress ? formatAddress(senderAddress) : '-'}
                    </Small>
                  </div>
                  <div className='flex flex-col gap-2'>
                    <Small className='text-muted-foreground font-light'>
                      Who pays for delivery
                    </Small>
                    <Small className='font-light'>
                      {payer ? (payer === 'receiver' ? 'Receiver' : 'Sender') : '-'}
                    </Small>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </Container>
    </DeliveryProvider>
  );
};

export default Delivery;
