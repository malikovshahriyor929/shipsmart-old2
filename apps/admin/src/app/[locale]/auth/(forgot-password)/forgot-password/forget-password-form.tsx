'use client';

import { useRouter } from '@core/i18n/routing';
import { useState } from 'react';
import { Button, Password } from 'rizzui';
import { SubmitHandler } from 'react-hook-form';
import { Form } from '@core/ui/form';
import { routes } from '@/config/routes';
import {
  resetPasswordSchema,
  ResetPasswordSchema,
} from '@core/validators/reset-password.schema';
import toast from 'react-hot-toast';
import { axiosPublic } from '@/server/api'; // adjust path if different
import { useTranslations } from 'next-intl';

const initialValues: ResetPasswordSchema = {
  password: '',
  confirmPassword: '',
};

export default function ForgetPasswordForm({
  token,
}: {
  token: string;
}) {
  const t = useTranslations()
  const [resetValues, setResetValues] =
    useState<ResetPasswordSchema>(initialValues);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const onSubmit: SubmitHandler<ResetPasswordSchema> = async (data) => {
    setIsLoading(true);
    try {
      await axiosPublic.post('/v1/auth/reset-password', {
        token,
        new_password: data.password,
      });

      // toast.success('Password reset successfully! Redirecting to login...', {
      //   duration: 1000,
      // });
      toast.success(t('auth.reset.toast.success'), { duration: 2000 });
      setResetValues(initialValues);

      setTimeout(() => {
        router.push(routes.auth.signIn);
      }, 1000);
    } catch (error: any) {
      const msg =
        error?.response?.data?.message ||
        error?.response?.data?.data?.message ||
        // 'Failed to reset password';
        t('auth.reset.toast.failed');
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Form<ResetPasswordSchema>
        validationSchema={ resetPasswordSchema }
        resetValues={ resetValues }
        onSubmit={ onSubmit }
        useFormProps={ {
          mode: 'onChange',
          defaultValues: initialValues,
        } }
        className="pt-1.5"
      >
        { ({ register, formState: { errors } }) => (
          <div className="space-y-6 max-sm:px-5">
            <Password
              // label="New Password"
              // placeholder="Enter your new password"
              label={ t('auth.reset.form.new') }
              placeholder={ t('auth.reset.form.newPh') }
              size="lg"
              className="[&>label>span]:font-medium"
              inputClassName="text-sm"
              { ...register('password') }
              error={ errors.password?.message }
            />
            <Password
              // label="Confirm New Password"
              // placeholder="Re-enter your new password"
              label={ t('auth.reset.form.confirm') }
              placeholder={ t('auth.reset.form.confirmPh') }
              size="lg"
              className="[&>label>span]:font-medium"
              inputClassName="text-sm"
              { ...register('confirmPassword') }
              error={ errors.confirmPassword?.message }
            />

            <Button
              className="mt-5 w-full"
              type="submit"
              size="lg"
              isLoading={ isLoading }
              disabled={ isLoading }
            >
              { t('auth.reset.form.submit') }
              {/* Reset Password */ }
            </Button>
          </div>
        ) }
      </Form>

      {/* <Text className="mt-6 flex items-center justify-center gap-1 text-center text-[15px] leading-loose text-gray-500 lg:mt-8 lg:text-start xl:text-base">
        Don’t want to reset your password?{' '}
        <Link
          href={routes.auth.signIn}
          className="font-bold text-gray-700 transition-colors hover:text-blue"
        >
          Sign In
        </Link>
      </Text> */}
    </>
  );
}
