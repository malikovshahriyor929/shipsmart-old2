'use client';

import Link from 'next/link';
import { useState } from 'react';
import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { SubmitHandler } from 'react-hook-form';
import { PiArrowRightBold } from 'react-icons/pi';
import { Checkbox, Password, Button, Input } from 'rizzui';
import { Form } from '@core/ui/form';
import { routes } from '@/config/routes';
import { loginSchema, LoginSchema } from '@core/validators/login.schema';
import toast from 'react-hot-toast';
import { useTranslations } from 'next-intl';

const initialValues: LoginSchema = {
  login: '',
  password: '',
  rememberMe: false,
};

const DEMO_LOGIN = 'admin';
const DEMO_PASSWORD = 'admin123';

const SIGN_IN_ERROR_KEYS = {
  AccessDenied: 'auth.signin.toast.notAdmin',
  CredentialsSignin: 'auth.signin.toast.invalidCredentials',
  'fetch failed': 'auth.signin.toast.serverUnreachable',
} as const;

export default function SignInForm() {
  const t = useTranslations();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const onSubmit: SubmitHandler<LoginSchema> = async (data) => {
    setIsLoading(true);
    try {
      const existing = await getSession();
      if (existing?.user?.accessToken) {
        toast.success(t('auth.signin.toast.success'));
        router.replace(routes.dashboard.overview);
        router.refresh();
        return;
      }

      const result = await signIn('credentials', {
        login: data.login,
        password: data.password,
        redirect: false,
      });

      const fresh = await getSession();
      if (fresh?.user?.accessToken) {
        toast.success(t('auth.signin.toast.success'));
        router.replace(routes.dashboard.overview);
        router.refresh();
        return;
      }

      if (!result || result.error) {
        const errorCode = result?.error;
        const errorKey =
          errorCode &&
          Object.prototype.hasOwnProperty.call(SIGN_IN_ERROR_KEYS, errorCode)
            ? SIGN_IN_ERROR_KEYS[errorCode as keyof typeof SIGN_IN_ERROR_KEYS]
            : 'auth.signin.toast.failed';

        toast.error(t(errorKey));
        return;
      }

      toast.error(t('auth.signin.toast.noToken'));
    } catch (e) {
      console.error('Login error:', e);
      // toast.error('Unexpected error during sign in.');
      toast.error(t('auth.signin.toast.unexpected'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Form<LoginSchema>
        validationSchema={loginSchema}
        onSubmit={onSubmit}
        useFormProps={{ mode: 'onChange', defaultValues: initialValues }}
      >
        {({ register, setValue, formState: { errors } }) => (
          <div className="space-y-5 lg:space-y-3 [@media(max-height:650px)]:space-y-2">
            {process.env.NODE_ENV !== 'production' ? (
              <button
                type="button"
                onClick={() => {
                  setValue('login', DEMO_LOGIN, {
                    shouldDirty: true,
                    shouldValidate: true,
                  });
                  setValue('password', DEMO_PASSWORD, {
                    shouldDirty: true,
                    shouldValidate: true,
                  });
                  setValue('rememberMe', true, {
                    shouldDirty: true,
                  });
                }}
                className="flex w-full items-center justify-between gap-4 rounded-[1.1rem] border border-black/[0.06] bg-[#f2f2f2] px-5 py-4 text-left transition hover:border-[#03a1fe]/35 hover:bg-[#edf7ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#03a1fe] lg:py-2.5 [@media(max-height:650px)]:py-2"
              >
                <span>
                  <span className="block text-sm font-semibold text-[#111214]">
                    {t('auth.signin.demoFill')}
                  </span>
                  <span className="mt-1 block text-xs text-[#77797e]">
                    {t('auth.signin.demoHint')}
                  </span>
                </span>
                <span className="shrink-0 rounded-full bg-white px-3 py-1.5 font-mono text-xs font-semibold text-[#03a1fe] shadow-sm">
                  admin
                </span>
              </button>
            ) : null}
            <Input
              id="login"
              type="text"
              size="lg"
              label={t('auth.signin.loginLabel')}
              placeholder={t('auth.signin.loginPlaceholder')}
              className="[&>label>span]:mb-2 [&>label>span]:text-[13px] [&>label>span]:font-semibold [&>label>span]:text-[#303030]"
              inputClassName="!h-14 !rounded-[1rem] !border-black/10 !bg-[#f7f7f5] px-4 text-sm shadow-none focus:!border-[#03a1fe] focus:!ring-0 lg:!h-12 [@media(max-height:650px)]:!h-11"
              {...register('login')}
              error={errors.login?.message}
            />
            <Password
              id="password"
              label={t('auth.signin.passwordLabel')}
              placeholder={t('auth.signin.passwordPlaceholder')}
              size="lg"
              className="[&>label>span]:mb-2 [&>label>span]:text-[13px] [&>label>span]:font-semibold [&>label>span]:text-[#303030]"
              inputClassName="!h-14 !rounded-[1rem] !border-black/10 !bg-[#f7f7f5] px-4 text-sm shadow-none focus:!border-[#03a1fe] focus:!ring-0 lg:!h-12 [@media(max-height:650px)]:!h-11"
              {...register('password')}
              error={errors.password?.message}
            />
            <div className="flex items-center justify-between gap-4 pb-2 lg:pb-0">
              <Checkbox
                {...register('rememberMe')}
                label={t('auth.signin.rememberMe')}
                variant="flat"
                className="[&>label>span]:text-sm [&>label>span]:font-medium [&>label>span]:text-[#4f5156]"
              />
              <Link
                href={routes.auth.requestResetPassword}
                className="h-auto p-0 text-sm font-semibold text-[#0183d0] transition-colors hover:text-[#111214]"
              >
                {t('auth.signin.forgot')}
              </Link>
            </div>
            <Button
              className="!h-14 w-full !rounded-full !bg-[#111214] !text-base !font-semibold !text-white shadow-none hover:!bg-black lg:!h-12 [@media(max-height:650px)]:!h-11"
              type="submit"
              size="lg"
              isLoading={isLoading}
              disabled={isLoading}
            >
              <span>{t('auth.signin.submit')}</span>
              <PiArrowRightBold className="ms-2 mt-0.5 h-5 w-5" />
            </Button>
          </div>
        )}
      </Form>
    </>
  );
}
