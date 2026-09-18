import SignInForm from './sign-in-form';
import AuthWrapperOne from '@/app/shared/auth-layout/auth-wrapper-one';
import ShipSmartAuthVisual from '@/app/shared/auth-layout/ship-smart-auth-visual';

import { metaObject } from '@/config/site.config';
import { getTranslations } from 'next-intl/server';

// export const metadata = {
//   ...metaObject('Sign In'),
// };
export async function generateMetadata() {
  const t = await getTranslations();
  return {
    ...metaObject(t('auth.signin.title')),
  };
}

export default async function SignIn() {
  const t = await getTranslations();
  return (
    <AuthWrapperOne
      title={
        <>
          {t('auth.signin.welcomePrefix')}{' '}
          <span className="text-[#03a1fe]">
            {t('auth.signin.inlineSignIn')}
          </span>{' '}
          {t('auth.signin.welcomeSuffix')}
        </>
      }
      description=""
      bannerTitle={t('auth.signin.bannerTitle')}
      bannerDescription=""
      isSocialLoginActive={false}
      pageImage={<ShipSmartAuthVisual />}
    >
      <SignInForm />
    </AuthWrapperOne>
  );
}
