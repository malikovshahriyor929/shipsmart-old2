import RequestResetLinkForm from './request-reset-form';
import UnderlineShape from '@core/components/shape/underline';
import AuthWrapperOne from '@/app/shared/auth-layout/auth-wrapper-one';
import { metaObject } from '@/config/site.config';
import { getTranslations } from 'next-intl/server';
import ShipSmartAuthVisual from '@/app/shared/auth-layout/ship-smart-auth-visual';

// export const metadata = {
//   ...metaObject('Request Reset Password'),
// };
export async function generateMetadata() {
  const t = await getTranslations();
  return {
    ...metaObject(t('auth.request.title')), // "Request Reset Password"
  };
}
export default async function RequestResetPasswordPage() {
  const t = await getTranslations();
  return (
    <AuthWrapperOne
      title={
        <>
          {/* Reset your{' '} */ }
          { t('auth.reset.headingPrefix') }{ ' ' }
          <span className="relative inline-block">
            {/* password! */ }
            { t('auth.reset.headingInline') }
            <UnderlineShape className="absolute -bottom-2 end-0 h-2.5 w-28 text-blue xl:-bottom-1.5 xl:w-36" />
          </span>
        </>
      }
      description=""
        bannerTitle={ t('auth.signin.bannerTitle') }
      bannerDescription=""
      isSocialLoginActive={ false }
      pageImage={<ShipSmartAuthVisual />}
    >
      <RequestResetLinkForm />
    </AuthWrapperOne>
  );
}
