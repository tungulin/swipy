import { IconBus, IconChevronRight, IconPlane } from '@tabler/icons-react';
import { parseAsJson, useQueryStates } from 'nuqs';
import { useEffect, useState } from 'react';
import { z } from 'zod';

import type { DeliveryOption } from '@/generated/api';

import { usePostApiDeliveryCalcMutation } from '@/generated/api';
import { nounWord } from '@/shared/lib/nounWord';
import { H3, Small } from '@/shared/ui/typography';

import { useDeliveryContext } from '../context';

const pointSchema = z.object({
  id: z.string(),
  name: z.string(),
  latitude: z.number(),
  longitude: z.number()
});

const sizeSchema = z.object({
  height: z.number(),
  id: z.string(),
  length: z.number(),
  name: z.string(),
  weight: z.number(),
  width: z.number()
});

const formatPrice = (price: number) => new Intl.NumberFormat('ru-RU').format(price);

export const DeliveryTypeStep = () => {
  const [{ senderPoint, receiverPoint, size }] = useQueryStates({
    senderPoint: parseAsJson(pointSchema.parse),
    receiverPoint: parseAsJson(pointSchema.parse),
    size: parseAsJson(sizeSchema.parse)
  });
  const calcDeliveryMutation = usePostApiDeliveryCalcMutation();

  const context = useDeliveryContext();
  const [deliveries, setDeliveries] = useState<DeliveryOption[]>([]);

  useEffect(() => {
    if (senderPoint && receiverPoint && size) {
      context.setDeliveryOrder({
        ...context.deliveryOrder,
        senderPointId: senderPoint.id,
        receiverPointId: receiverPoint.id,
        size
      });
      calcDeliveryMutation.mutate(
        {
          body: {
            package: size,
            receiverPoint: {
              latitude: receiverPoint.latitude,
              longitude: receiverPoint.longitude
            },
            senderPoint: {
              latitude: senderPoint.latitude,
              longitude: senderPoint.longitude
            }
          }
        },
        {
          onSuccess: (data) => setDeliveries(data.data.options)
        }
      );
    }
  }, [senderPoint, receiverPoint, size]);

  const handleClickTypeDelivery = (delivery: DeliveryOption) => {
    context.stepper.next();

    if (size && delivery) {
      context.setDeliveryOrder({
        ...context.deliveryOrder,
        packageId: size.id,
        price: delivery.price,
        days: delivery.days,
        optionType: delivery.type
      });
    }
  };

  return (
    <div className='flex flex-col gap-4'>
      {deliveries.map((delivery) => (
        <button
          key={delivery.id}
          className='flex h-[116px] flex-1 rounded-xl border-1 p-4'
          onClick={() => handleClickTypeDelivery(delivery)}
        >
          <div className='bg-secondary flex h-12 w-12 items-center justify-center rounded-full'>
            {(delivery.type as unknown as string) === 'express' ? (
              <IconPlane size={18} />
            ) : (
              <IconBus size={18} />
            )}
          </div>
          <div className='flex-1'>
            <div className='ml-4'>
              <div>
                <div className='flex justify-between'>
                  <Small className='text-muted-foreground font-light'>{delivery.name}</Small>
                  <IconChevronRight />
                </div>
                <H3 className='text-left'>{formatPrice(delivery.price)} ₽</H3>
              </div>
              <Small className='text-muted-foreground mt-1 text-left text-sm font-light'>
                {delivery.days}{' '}
                {nounWord(delivery.days, ['business day', 'business days', 'business days'])}
              </Small>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
};
