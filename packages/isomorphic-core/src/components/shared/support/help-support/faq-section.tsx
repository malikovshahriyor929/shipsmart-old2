import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { PiCaretDownBold, PiCaretUpBold, PiQuestionBold } from 'react-icons/pi';
import { Button, Text, Input } from 'rizzui';
import cn from '@core/utils/class-names';

interface FaqItemProps {
  question: string;
  answer: React.ReactNode;
  isExpanded: boolean;
  onToggle: () => void;
}

const FaqItem: React.FC<FaqItemProps> = ({
  question,
  answer,
  isExpanded,
  onToggle,
}) => {
  return (
    <div
      className={cn(
        'mb-4 overflow-hidden rounded-lg border transition-all duration-200 ease-in-out',
        isExpanded
          ? 'border-blue-200 shadow-md dark:border-blue-800/50'
          : 'border-gray-200 dark:border-gray-300'
      )}
    >
      <div
        className={cn(
          'flex cursor-pointer items-center justify-between p-4 transition-colors duration-200',
          isExpanded
            ? 'bg-blue-50/70 dark:bg-blue-900/20'
            : 'bg-white dark:bg-gray-100/50'
        )}
        onClick={onToggle}
      >
        <div className="flex items-center gap-3">
          <span
            className={cn(
              'rounded-full p-2 transition-colors duration-200',
              isExpanded
                ? 'bg-blue-100 text-blue-600 dark:bg-blue-800/50 dark:text-blue-400'
                : 'bg-[#043764]/10 text-[#043764] dark:bg-gray-200/50 dark:text-blue-400'
            )}
          >
            <PiQuestionBold className="h-4 w-4" />
          </span>
          <Text
            className={cn(
              'text-base font-medium transition-colors duration-200',
              isExpanded
                ? 'text-blue-700 dark:text-blue-300'
                : 'dark:text-gray-600'
            )}
          >
            {question}
          </Text>
        </div>
        <Button
          variant="text"
          className={cn(
            'h-auto p-0 transition-colors duration-200',
            isExpanded
              ? 'text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300'
              : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
          )}
        >
          {isExpanded ? (
            <PiCaretUpBold className="h-5 w-5" />
          ) : (
            <PiCaretDownBold className="h-5 w-5" />
          )}
        </Button>
      </div>

      <div
        className={cn(
          'overflow-hidden transition-all duration-300 ease-in-out',
          isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <div className="border-t border-gray-200 bg-white p-5 dark:border-gray-300 dark:bg-gray-100/50">
          <div className="prose dark:prose-invert max-w-none">{answer}</div>
        </div>
      </div>
    </div>
  );
};

const FAQSection: React.FC = () => {
  const t = useTranslations();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaqId, setExpandedFaqId] = useState<number | null>(0);

  // Sample FAQ data
  const faqs = [
    {
      id: 0,
      question:
        t('support.faq.q-reset-password') ?? 'How do I reset my password?',
      answer: (
        <p>
          {t('support.faq.a-reset-password') ??
            'To reset your password, click on the "Forgot Password" link on the login page. You\'ll receive an email with instructions to create a new password. If you don\'t receive the email within 5 minutes, check your spam folder or contact the support team.'}
        </p>
      ),
    },
    {
      id: 1,
      question:
        t('support.faq.q-technical-issues') ??
        "I'm experiencing technical issues with the platform. What should I do?",
      answer: (
        <>
          <p>
            {t('support.faq.a-technical-issues-intro') ??
              "If you're experiencing technical issues, please try these troubleshooting steps:"}
          </p>
          <ol>
            <li>
              {t('support.faq.a-technical-issues-step-1') ??
                'Clear your browser cache and cookies'}
            </li>
            <li>
              {t('support.faq.a-technical-issues-step-2') ??
                'Try using a different browser'}
            </li>
            <li>
              {t('support.faq.a-technical-issues-step-3') ??
                'Ensure your internet connection is stable'}
            </li>
            <li>
              {t('support.faq.a-technical-issues-step-4') ??
                'Restart your computer'}
            </li>
          </ol>
          <p>
            {t('support.faq.a-technical-issues-outro') ??
              'If the problem persists, please submit a support ticket with details about the issue, including screenshots if possible.'}
          </p>
        </>
      ),
    },
    {
      id: 2,
      question:
        t('support.faq.q-update-profile') ??
        'How can I update my profile information?',
      answer: (
        <p>
          {t('support.faq.a-update-profile') ??
            'You can update your profile information by clicking on your profile picture in the top-right corner, then selecting "Profile Settings." From there, you can edit your personal information, change your profile picture, and update your notification preferences.'}
        </p>
      ),
    },
    {
      id: 3,
      question:
        t('support.faq.q-supported-browsers') ??
        'What browsers are supported by the platform?',
      answer: (
        <>
          <p>
            {t('support.faq.a-supported-browsers-intro') ??
              'Our platform supports the following browsers:'}
          </p>
          <ul>
            <li>
              {t('support.faq.a-supported-browsers-chrome') ??
                'Google Chrome (latest version)'}
            </li>
            <li>
              {t('support.faq.a-supported-browsers-firefox') ??
                'Mozilla Firefox (latest version)'}
            </li>
            <li>
              {t('support.faq.a-supported-browsers-edge') ??
                'Microsoft Edge (latest version)'}
            </li>
            <li>
              {t('support.faq.a-supported-browsers-safari') ??
                'Safari (latest version)'}
            </li>
          </ul>
          <p>
            {t('support.faq.a-supported-browsers-outro') ??
              'For the best experience, we recommend using Google Chrome or Mozilla Firefox.'}
          </p>
        </>
      ),
    },
  ];

  // Filter FAQs based on search
  const filteredFaqs = faqs.filter(
    (faq) =>
      searchQuery === '' ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle FAQ toggle
  const handleFaqToggle = (faqId: number) => {
    setExpandedFaqId(expandedFaqId === faqId ? null : faqId);
  };

  return (
    <div>
      <div className="mb-8">
        <Input
          type="search"
          placeholder={
            t('support.faq.search-placeholder') ??
            'Search frequently asked questions...'
          }
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-12"
          inputClassName="pl-12 h-12"
          prefix={<PiQuestionBold className="h-5 w-5 text-gray-500" />}
          clearable={true}
          onClear={() => setSearchQuery('')}
        />
      </div>

      {filteredFaqs.length > 0 ? (
        <div className="space-y-2">
          {filteredFaqs.map((faq) => (
            <FaqItem
              key={faq.id}
              question={faq.question}
              answer={faq.answer}
              isExpanded={expandedFaqId === faq.id}
              onToggle={() => handleFaqToggle(faq.id)}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center dark:border-gray-300 dark:bg-gray-100/50">
          <Text
            as="strong"
            className="mb-2 text-lg font-semibold dark:text-gray-600"
          >
            {t('support.faq.no-matches-title') ?? 'No FAQ matches found'}
          </Text>
          <Text className="text-gray-500 dark:text-gray-400">
            {t('support.faq.no-matches-desc') ??
              'Try adjusting your search terms or browse all FAQs.'}
          </Text>
          <Button
            color="primary"
            className="mt-4 dark:bg-blue-800 dark:text-white dark:hover:bg-blue-700"
            onClick={() => setSearchQuery('')}
          >
            {t('support.faq.view-all') ?? 'View All FAQs'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default FAQSection;
