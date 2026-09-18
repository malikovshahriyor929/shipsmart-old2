import ForgetPasswordForm from './forget-password-form';
import UnderlineShape from '@core/components/shape/underline';
import AuthWrapperOne from '@/app/shared/auth-layout/auth-wrapper-one';
import { metaObject } from '@/config/site.config';
import { getTranslations } from 'next-intl/server';
import ShipSmartAuthVisual from '@/app/shared/auth-layout/ship-smart-auth-visual';

export async function generateMetadata() {
  const t = await getTranslations();
  return {
    ...metaObject(t('auth.reset.title') ?? 'Reset Password'),
  };
}
/// ______ test qilib korin
type Query = { token?: string };
type PageProps = { searchParams?: Promise<Query> };

export default async function ForgotPasswordPage({
  searchParams,
}: PageProps) {
  const t = await getTranslations();
  // const token = searchParams?.token;
  // const login = searchParams?.login;
  const { token } = (await searchParams) ?? {};

  // Security: only allow access via email link that contains both params
  if (!token) {
    return (
      <AuthWrapperOne
        title={t('auth.reset.notFoundTitle') ?? 'Something went wrong'}
        description={
          t('auth.reset.notFoundDesc') ??
          'Token not found or invalid email detected. Please request a new reset link.'
        }
        bannerTitle={t('auth.signin.bannerTitle') ?? 'Admin Portal'}
        bannerDescription=""
        isSocialLoginActive={false}
        pageImage={<ShipSmartAuthVisual />}
      >
        <div />
      </AuthWrapperOne>
    );
  }

  return (
    <AuthWrapperOne
      title={
        <>
          {/* Reset your{ ' ' }
          <span className="relative inline-block">
            password! */}
          { t('auth.reset.headingPrefix') ?? 'Reset your' }{ ' ' }
          <span className="relative inline-block">
            { t('auth.reset.headingInline') ?? 'password!' }
            <UnderlineShape className="absolute -bottom-2 end-0 h-2.5 w-28 text-blue xl:-bottom-1.5 xl:w-36" />
          </span>
        </>
      }
      description=""
      bannerTitle={ t('auth.signin.bannerTitle') ?? 'Admin Portal' }
      bannerDescription=""
      isSocialLoginActive={ false }
      pageImage={<ShipSmartAuthVisual />}
    >
      <ForgetPasswordForm token={ token } />
    </AuthWrapperOne>
  );
}
