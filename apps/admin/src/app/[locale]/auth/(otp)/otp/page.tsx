import { Text } from 'rizzui/typography';
import OtpForm from './otp-form';
import AuthWrapperOne from '@/app/shared/auth-layout/auth-wrapper-one';
import UnderlineShape from '@core/components/shape/underline';
import { metaObject } from '@/config/site.config';
import { getTranslations } from 'next-intl/server';
import ShipSmartAuthVisual from '@/app/shared/auth-layout/ship-smart-auth-visual';

// export const metadata = {
//   ...metaObject('Verify OTP'),
// };
export async function generateMetadata() {
  const t = await getTranslations();
  return {
    ...metaObject(t('auth.otp.title')),
  };
}
export default async function OtpPage() {
  const t = await getTranslations();
  return (
    <AuthWrapperOne
      title={
        <>
          {/* Enter your{' '} */ }
          { t('auth.otp.headingPrefix') }{ ' ' }
          <span className="relative inline-block">
            {/* OTP. */ }
            { t('auth.otp.headingInline') }
            <UnderlineShape className="absolute -bottom-2 end-0 h-2.5 w-16 text-blue xl:-bottom-1 xl:w-24" />
          </span>
        </>
      }
      description=""
      bannerTitle={ t('auth.signin.bannerTitle') }
      bannerDescription=""
      isSocialLoginActive={ false }
      pageImage={<ShipSmartAuthVisual />}
    >
      <Text className="-mt-1 w-full mb-9 text-center text-[15px] leading-[1.85] text-gray-700 md:text-base md:!leading-loose lg:text-start xl:-mt-6">
        {/* We have sent you One Time Password to your email. */ }
        { t('auth.otp.subtitle') }
      </Text>
      <OtpForm />
    </AuthWrapperOne>
  );
}
