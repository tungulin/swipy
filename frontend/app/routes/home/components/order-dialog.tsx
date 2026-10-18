import type { DeliveryOrder } from '@/generated/api';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/ui/dialog';

const STATUS_MAP: Record<string, string> = {
  in_processing: 'Processing',
  waiting_courier: 'Waiting for courier',
  on_my_way: 'On the way',
  success: 'Delivered',
  canceled: 'Canceled'
};

interface Props {
  open: boolean;
  order: DeliveryOrder;
  onOpenChange: (open: boolean) => void;
}

export const OrderDialog = (props: Props) => {
  const { order, open, onOpenChange } = props;

  if (!order) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader>
          <DialogTitle>Order #{order._id}</DialogTitle>
        </DialogHeader>
        <div className='flex flex-col gap-3 text-sm'>
          <div className='flex justify-between'>
            <span className='text-muted-foreground'>Status</span>
            <span>{STATUS_MAP[order.status as unknown as string] ?? order.status}</span>
          </div>
          <div className='flex justify-between'>
            <span className='text-muted-foreground'>Delivery type</span>
            <span>{order.option === 'EXPRESS' ? 'Express' : 'Standard'}</span>
          </div>
          <div className='flex justify-between'>
            <span className='text-muted-foreground'>Price</span>
            <span>{order.price} ₽</span>
          </div>
          <div className='flex justify-between'>
            <span className='text-muted-foreground'>Payer</span>
            <span>{order.payer === 'SENDER' ? 'Sender' : 'Receiver'}</span>
          </div>
          <div className='flex justify-between'>
            <span className='text-muted-foreground'>From</span>
            <span>{order.senderPoint.name}</span>
          </div>
          <div className='flex justify-between'>
            <span className='text-muted-foreground'>To</span>
            <span>{order.receiverPoint.name}</span>
          </div>
          <div className='flex justify-between'>
            <span className='text-muted-foreground'>Sender</span>
            <span>
              {order.sender.lastname} {order.sender.firstname}
            </span>
          </div>
          <div className='flex justify-between'>
            <span className='text-muted-foreground'>Receiver</span>
            <span>
              {order.receiver.lastname} {order.receiver.firstname}
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
