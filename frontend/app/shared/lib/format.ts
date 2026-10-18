import type {
  CreateDeliveryOrderPersonDto,
  CreateDeliveryOrderReceiverAddressDto
} from '@/generated/api';

export const formatAddress = (address: CreateDeliveryOrderReceiverAddressDto) =>
  `ул. ${address.street}, д. ${address.house}, кв. ${address.apartment}`;

export const formatFio = (person: CreateDeliveryOrderPersonDto) =>
  `${person.lastname} ${person.firstname} ${person.middlename}, ${person.phone}`;
