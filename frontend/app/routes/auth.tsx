import { useBoolean, useTimer } from '@siberiacancode/reactuse';
import { formatDate } from 'date-fns';
import { IconChevronLeft, IconMoon, IconSun } from '@tabler/icons-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { withMask } from 'use-mask-input';

import { useTheme } from '@/contexts';
import {
  getApiOtps,
  usePostApiAuthOtpMutation,
  usePostApiUsersSigninMutation
} from '@/generated/api';
import { Form, FormInput } from '@/shared/form';
import { useAuthTokenLocalStorage, useUserLocalStorage } from '@/shared/localltorage';
import { Button } from '@/shared/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/shared/ui/input-otp';
import { Spinner } from '@/shared/ui/spinner';
import { H2, H3, P } from '@/shared/ui/typography';

const findOtpByPhone = (phone: string, html: string) => {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const rows = doc.querySelectorAll('tbody tr');

  for (const row of rows) {
    const cells = row.querySelectorAll('td');
    if (cells[0]?.textContent === phone) {
      return cells[1]?.textContent ?? null;
    }
  }

  return null;
};

const Auth = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const formPhone = useForm<{ phone: string }>();

  const otpTimer = useTimer(120, { immediately: false });

  const authOtpMutation = usePostApiAuthOtpMutation();
  const signInUserMutation = usePostApiUsersSigninMutation();

  const authTokenStorage = useAuthTokenLocalStorage();
  const userStorage = useUserLocalStorage();

  const [code, setCode] = useState('');
  const [isSendingPhone, togglIsSendingPhone] = useBoolean(true);

  const handleSubmitPhone = (data: { phone: string }) => {
    const phone = data.phone.replace(/\D/g, '');

    authOtpMutation.mutate(
      { body: { phone } },
      {
        onSuccess: () => {
          togglIsSendingPhone();
          otpTimer.start();

          getApiOtps().then((response) => {
            toast.info(`Your code: ${findOtpByPhone(phone, response.data)}`, {
              duration: 10_000
            });
          });
        },
        onError: () => toast.error('Failed to get OTP code')
      }
    );
  };

  const handleSubmitOtpCode = () => {
    const phone = formPhone.getValues().phone.replace(/\D/g, '');
    signInUserMutation.mutate(
      { body: { phone, code: Number(code) } },
      {
        onSuccess: (resp) => {
          toast.dismiss();
          authTokenStorage.set(resp.data.token);
          userStorage.set(resp.data.user);
          navigate('/');
        },
        onError: () => toast.error('Failed to sign in')
      }
    );
  };

  const handleChangeMode = () => theme.set(theme.value === 'dark' ? 'light' : 'dark');

  return (
    <div className='relative flex h-screen flex-col items-center justify-center'>
      <Button
        className='border-border absolute top-5 right-5 h-10 w-10 md:top-20 md:right-20 md:h-8 md:w-8'
        size='icon'
        variant='secondary'
        onClick={handleChangeMode}
      >
        {theme.value === 'dark' ? <IconSun /> : <IconMoon />}
      </Button>
      <div className='mx-5 flex max-w-[380px] flex-col items-center justify-center md:mx-0'>
        <div className='mb-7 flex items-center justify-center gap-1'>
          <img alt='delivery' className='h-8 w-8' src='/logo.png' />
          <H3>DELIVERY</H3>
        </div>
        {isSendingPhone ? (
          <>
            <H2>Sign in</H2>
            <P className='mb-6'>Enter your phone number to sign in to your profile</P>
            <Form key='phone_form' className='w-full' form={formPhone} onSubmit={handleSubmitPhone}>
              <FormInput
                ref={withMask('+7 (999) 999-99-99')}
                className='min-w-full'
                label='Phone'
                name='phone'
                placeholder='+7 (___) ___-__-__'
              />
              <Button
                className='mt-8 w-full'
                disabled={authOtpMutation.isPending}
                size='lg'
                type='submit'
              >
                {authOtpMutation.isPending && <Spinner data-icon='inline-start' />}
                Sign in
              </Button>
            </Form>
          </>
        ) : (
          <>
            <div className='flex w-full items-center justify-between'>
              <IconChevronLeft className='cursor-pointer' onClick={() => togglIsSendingPhone()} />
              <H2>Verification code</H2>
              <div />
            </div>
            <P className='mb-6'>A verification code has been sent to the number you provided</P>
            <InputOTP containerClassName='w-full' maxLength={6} onChange={setCode}>
              <InputOTPGroup className='w-full'>
                <InputOTPSlot className='h-[40px] w-auto flex-1 md:w-[63px]' index={0} />
                <InputOTPSlot className='h-[40px] w-auto flex-1 md:w-[63px]' index={1} />
                <InputOTPSlot className='h-[40px] w-auto flex-1 md:w-[63px]' index={2} />
                <InputOTPSlot className='h-[40px] w-auto flex-1 md:w-[63px]' index={3} />
                <InputOTPSlot className='h-[40px] w-auto flex-1 md:w-[63px]' index={4} />
                <InputOTPSlot className='h-[40px] w-auto flex-1 md:w-[63px]' index={5} />
              </InputOTPGroup>
            </InputOTP>
            <div className='mt-8 flex w-full flex-col gap-4'>
              <Button
                disabled={signInUserMutation.isPending}
                size='lg'
                onClick={() => handleSubmitOtpCode()}
              >
                {signInUserMutation.isPending && <Spinner data-icon='inline-start' />}
                Sign in
              </Button>
              <Button disabled={otpTimer.active} size='lg' type='submit' variant='outline'>
                <div className='flex w-full justify-between'>
                  <div />
                  <div>Resend code</div>
                  <div>
                    {otpTimer.active && formatDate(new Date(otpTimer.count * 1000), 'mm:ss')}
                  </div>
                </div>
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Auth;
