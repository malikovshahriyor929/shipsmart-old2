'use client';

import { Button, PinCode } from 'rizzui';
import { Form } from '@core/ui/form';
import { SubmitHandler } from 'react-hook-form';
import { Link } from '@core/i18n/routing';
import { routes } from '@/config/routes';
import toast from 'react-hot-toast';
import { useTranslations } from 'next-intl';
type FormValues = {
  otp: string;
};

export default function OtpForm() {
    const t = useTranslations()
  const onSubmit: SubmitHandler<FormValues> = () => {
    // toast.success('OTP Verified Successfully!');
    toast.success(t('auth.otp.toast.verified') ?? 'OTP verified successfully!');
  };
  const handleResendOtp = () => {
    // Logic to resend OTP goes here
    // toast.success('OTP Resent Successfully!');
    toast.success(t('auth.otp.toast.resent') ?? 'OTP resent successfully!');
  };

  return (
    <Form<FormValues> onSubmit={ onSubmit }>
      { ({ setValue }) => (
        <div className="space-y-10 max-sm:px-5">
          <PinCode
            variant="outline"
            setValue={ (value) => setValue('otp', String(value)) }
            size="lg"
            className="lg:justify-start"
            autoCapitalize='none'
          />
          <Link
            href={ routes.auth.signIn }
          >
            <Button
              className="w-full mt-10 text-base font-medium"
              type="submit"
              size="lg"
            >
              {/* Verify OTP */ }
              { t('auth.otp.submit') ?? 'Verify OTP' }
            </Button>
          </Link>
          <div className="">
            <Button
              onClick={ handleResendOtp }
              className="-mt-4 w-full p-0 text-base font-medium text-primary underline lg:inline-flex lg:w-auto"
              type="button"
              variant="text"
            >
              {/* Resend OTP */ }
              { t('auth.otp.resend') ?? 'Resend OTP' }
            </Button>
          </div>
        </div>
      ) }
    </Form>
  );
}
