import { useControllableState } from '@siberiacancode/reactuse';
import { useMemo } from 'react';

import type { DeliveryPoint } from '@/generated/api';

import { useGetApiDeliveryPointsQuery } from '@/generated/api';
import { EllipseIcon } from '@/shared/icons';
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  useComboboxAnchor
} from '@/shared/ui/combobox';
import { InputGroupAddon } from '@/shared/ui/input-group';
import { Small } from '@/shared/ui/typography';

interface Props {
  colorPoint?: string;
  label?: string;
  placeholder?: string;
  onChange: (value: DeliveryPoint | null) => void;
}

export const CityCombobox = (props: Props) => {
  const { label, onChange, colorPoint, placeholder } = props;

  const anchor = useComboboxAnchor();
  const getDeliveryPointsQuery = useGetApiDeliveryPointsQuery();
  const [value, setValue] = useControllableState<DeliveryPoint | null>({
    initialValue: null,
    onChange
  });

  const cities = getDeliveryPointsQuery.data?.data?.points ?? ([] as DeliveryPoint[]);
  const suggestedCities = useMemo(() => cities.slice(0, 3), [cities]);

  const handleClickSuggestedCity = (city: DeliveryPoint) => setValue(city);

  const disabled = getDeliveryPointsQuery.isError || getDeliveryPointsQuery.isLoading;

  return (
    <Combobox
      disabled={disabled}
      items={cities}
      itemToStringLabel={(_package) => _package.name}
      value={value}
      onValueChange={setValue}
    >
      <div ref={anchor}>
        {label && <Small className='text-muted-foreground mb-3'>{label}</Small>}
        <ComboboxInput
          className='h-[48px] rounded-full'
          disabled={disabled}
          placeholder={placeholder}
        >
          <InputGroupAddon>
            <EllipseIcon className='mr-1' color={colorPoint} />
          </InputGroupAddon>
        </ComboboxInput>
        <div className='mt-3 flex h-[14px] cursor-pointer gap-3'>
          {suggestedCities.map((city) => (
            <Small
              key={city.id}
              className='text-muted-foreground underline'
              onClick={() => handleClickSuggestedCity(city)}
            >
              {city.name}
            </Small>
          ))}
        </div>
      </div>
      <ComboboxContent anchor={anchor} side='bottom'>
        <ComboboxEmpty>No such city...</ComboboxEmpty>
        <ComboboxList>
          {(city) => (
            <ComboboxItem key={city.name} value={city}>
              {city.name}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
};
