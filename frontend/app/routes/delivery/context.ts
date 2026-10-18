import type { UseStepReturn } from '@siberiacancode/reactuse';

import type {
  CreateDeliveryOrderPersonDto,
  CreateDeliveryOrderReceiverAddressDto,
  DeliveryPackageType
} from '@/generated/api';

import { createBareContext } from '@/shared/lib/createBareContext';

export interface DeliveryOrder {
  days: number;
  optionType: string;
  packageId: string;
  payer: 'receiver' | 'sender';
  price: number;
  receiver: CreateDeliveryOrderPersonDto;
  receiverAddress: CreateDeliveryOrderReceiverAddressDto;
  receiverPointId: string;
  sender: CreateDeliveryOrderPersonDto;
  senderAddress: CreateDeliveryOrderReceiverAddressDto;
  senderPointId: string;
  size: DeliveryPackageType;
}

interface Params {
  deliveryOrder: DeliveryOrder;
  stepper: UseStepReturn;
  setDeliveryOrder: (options: DeliveryOrder) => void;
}

export const [DeliveryProvider, useDeliveryContext] = createBareContext<Params>();
