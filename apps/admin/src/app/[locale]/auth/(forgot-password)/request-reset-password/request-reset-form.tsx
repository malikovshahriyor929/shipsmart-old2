'use client';

import { Link, useRouter } from '@core/i18n/routing';
import { useState } from 'react';
import { Button, Text, Input } from 'rizzui';
import { SubmitHandler } from 'react-hook-form';
import { Form } from '@core/ui/form';
import { routes } from '@/config/routes';
import {
  requestResetSchema,
  RequestResetSchema,
} from '@core/validators/request-reset.schema';
import toast from 'react-hot-toast';
import { axiosPublic } from '@/server/api';
import { useTranslations } from 'next-intl';

const initialValues: RequestResetSchema = { email: '' };

export default function RequestResetForm() {
  const t = useTranslations()
  const [formValues, setFormValues] =
    useState<RequestResetSchema>(initialValues);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const onSubmit: SubmitHandler<RequestResetSchema> = async (data) => {
    setIsLoading(true);
    try {
      const res = await axiosPublic.post('/v1/auth/request-reset', {
        login: data.email,
      });
      const message =
        res?.data?.data?.message ||
        res?.data?.message ||
        // 'Reset link sent to your email.';
        (t('auth.request.toast.sent') ?? 'Reset link sent to your email.');

      toast.success(message, { duration: 5000 });
      router.push(routes.auth.signIn);
      setFormValues(initialValues);
    } catch (error: any) {
      const msg =
        error?.response?.data?.data?.message ||
        error?.response?.data?.message ||
        // 'Failed to send reset link';
        (t('auth.request.toast.failed') ?? 'Failed to send reset link')
      toast.error(msg, { duration: 3000 });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Form<RequestResetSchema>
        validationSchema={ requestResetSchema }
        resetValues={ formValues }
        onSubmit={ onSubmit }
        useFormProps={ {
          mode: 'onChange',
          defaultValues: initialValues,
        } }
        className="pt-1.5"
      >
        { ({ register, formState: { errors } }) => (
          <div className="space-y-6 max-sm:px-5">
            <Input
              type="email"
              size="lg"
              // label="Email"
              // placeholder="Enter your email"
              label={ t('auth.request.emailLabel') ?? 'Email' }
              placeholder={ t('auth.request.emailPlaceholder') ?? 'Enter your email' }
              className="[&>label>span]:font-medium"
              inputClassName="text-sm"
              { ...register('email') }
              error={ errors.email?.message }
            />

            <Button
              className="mt-5 w-full"
              type="submit"
              size="lg"
              isLoading={ isLoading }
              disabled={ isLoading }
            >
              {/* Request Reset Link */ }
              { t('auth.request.submit') ?? 'Request Reset Link' }
            </Button>
          </div>
        ) }
      </Form>

      <Text className="mt-6 flex items-center justify-center gap-1 text-center text-[15px] leading-loose text-gray-500 lg:mt-8 lg:text-start xl:text-base">
        {/* Don’t want to reset your password?{ ' ' } */ }
        { t('auth.reset.cta.backPrompt') ?? 'Don’t want to reset your password?' }{ ' ' }
        <Link
          href={ routes.auth.signIn }
          className="font-bold text-gray-700 transition-colors hover:text-blue"
        >
          {/* Sign In */ }
          { t('auth.reset.cta.backToSignIn') ?? 'Sign In' }
        </Link>
      </Text>
    </>
  );
}
