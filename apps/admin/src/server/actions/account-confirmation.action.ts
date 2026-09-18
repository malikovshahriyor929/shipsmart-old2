'use server';

import { render } from '@react-email/components';
import { sendEmail } from '@/app/[locale]/email-templates/email';
import AccountConfirmationEmail from '@core/components/shared/[locale]/email-templates/account-confirmation';

export const sendAccountConfirmationEmail = async (data: { email: string }) => {
  const to = `Mr. Advisor<${data.email}>`;

  await sendEmail({
    to: to,
    subject: 'Your Account is Created!',
    html: render(AccountConfirmationEmail(data.email)) as unknown as string,
  });

  return true;
};
