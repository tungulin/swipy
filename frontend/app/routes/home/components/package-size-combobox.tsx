import { useControllableState } from '@siberiacancode/reactuse';

import type { DeliveryPackageType } from '@/generated/api';

import { useGetApiDeliveryPackageTypesQuery } from '@/generated/api';
import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxList
} from '@/shared/ui/combobox';
import { Large, Small } from '@/shared/ui/typography';

interface Props {
  onChange: (value: DeliveryPackageType | null) => void;
}

const toSizeString = (value: DeliveryPackageType) =>
  `${value.height}x${value.width}x${value.length}`;

export const PackageSizeCombobox = (props: Props) => {
  const { onChange } = props;

  const getTypesPackageQuery = useGetApiDeliveryPackageTypesQuery();

  const packages = getTypesPackageQuery.data?.data?.packages ?? ([] as DeliveryPackageType[]);

  const [value, setValue] = useControllableState<DeliveryPackageType | null>({
    initialValue: null,
    onChange
  });

  const disabled = getTypesPackageQuery.isError || getTypesPackageQuery.isLoading;

  return (
    <Combobox
      disabled={disabled}
      items={packages}
      itemToStringLabel={(_package) => _package.name}
      value={value}
      onValueChange={setValue}
    >
      <div>
        <Small className='text-muted-foreground mb-3'>Package size</Small>
        <ComboboxInput readOnly className='h-[48px] rounded-full' placeholder='Select size' />
      </div>
      <ComboboxContent className='rounded-xl p-4' side='bottom'>
        <ComboboxList>
          {packages.map((packageSize) => (
            <ComboboxItem
              key={packageSize.id}
              className='relative my-2 h-[80px] p-0 data-highlighted:bg-transparent data-highlighted:text-inherit'
              value={packageSize}
            >
              <div className='flex h-full w-full items-center gap-3 rounded-xl border-1 p-4'>
                <div>
                  <Large>{packageSize.name}</Large>
                  <Small className='text-foreground'>{toSizeString(packageSize)} cm</Small>
                </div>
              </div>
            </ComboboxItem>
          ))}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
};
