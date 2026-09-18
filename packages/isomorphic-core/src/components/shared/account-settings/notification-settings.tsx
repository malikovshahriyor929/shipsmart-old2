'use client';

import { useState } from 'react';
import HorizontalFormBlockWrapper from '@core/components/shared/account-settings/horiozontal-block';
import {
  Button,
  Text,
  Switch,
  CheckboxGroup,
  Checkbox,
  RadioGroup,
  Radio,
} from 'rizzui';
import { useTranslations } from 'next-intl';

export default function NotificationSettingsView() {
  const t = useTranslations();
  const [values, setValues] = useState<string[]>([]);
  const [remindersValue, setRemindersValue] = useState('');
  const [activityValue, setActivityValue] = useState('');
  const [notificationChannels, setNotificationChannels] = useState<
    Record<string, string>
  >({});

  const generalOptions = [
    {
      id: 'mentioned',
      title: t('profile.notifications.general.mentioned') ?? 'I’m mentioned in a message',
    },
    {
      id: 'reply',
      title: t('profile.notifications.general.reply') ?? 'Someone replies to any message',
    },
    {
      id: 'assignedTask',
      title: t('profile.notifications.general.assignedTask') ?? 'I’m assigned a task',
    },
    {
      id: 'taskOverdue',
      title: t('profile.notifications.general.taskOverdue') ?? 'A task is overdue',
    },
    {
      id: 'taskStatusUpdated',
      title: t('profile.notifications.general.taskStatusUpdated') ?? 'A task status is updated',
    },
  ];

  const summaryOptions = [
    {
      id: 'daily',
      title: t('profile.notifications.summary.daily') ?? 'Daily summary',
    },
    {
      id: 'weekly',
      title: t('profile.notifications.summary.weekly') ?? 'Weekly summary',
    },
    {
      id: 'monthly',
      title: t('profile.notifications.summary.monthly') ?? 'Monthly summary',
    },
    {
      id: 'quarterly',
      title: t('profile.notifications.summary.quarterly') ?? 'Quaterly summary',
    },
  ];

  return (
    <div className="@container">
      <HorizontalFormBlockWrapper
        childrenWrapperClassName="gap-0 @lg:gap-0"
        title={t('profile.notifications.title') ?? 'Notifications'}
        titleClassName="text-xl font-semibold"
        description={t('profile.notifications.subtitle') ?? 'Select when and how you will be notified.'}
      />
      <HorizontalFormBlockWrapper
        title={t('profile.notifications.general.title') ?? 'General notifications'}
        description={t('profile.notifications.general.description') ?? 'Select when you’ll be notified when the following changes occur.'}
        descriptionClassName="max-w-[344px]"
      >
        <div className="col-span-2">
          {generalOptions.map((opt, index) => (
            <div
              key={`generalopt-${index}`}
              className="flex items-center justify-between border-b border-muted py-6 last:border-none last:pb-0"
            >
              <Text className="text-sm font-medium text-gray-900">
                {opt.title}
              </Text>
              <ButtonGroup
                value={notificationChannels[`general.${opt.id}`]}
                onChange={(option) =>
                  setNotificationChannels((prev) => ({
                    ...prev,
                    [`general.${opt.id}`]: option,
                  }))
                }
              />
            </div>
          ))}
        </div>
      </HorizontalFormBlockWrapper>
      <HorizontalFormBlockWrapper
        title={t('profile.notifications.summary.title') ?? 'Summary notifications'}
        description={t('profile.notifications.summary.description') ?? 'Select when you’ll be notified when the following summaries or report are ready.'}
        descriptionClassName="max-w-[344px]"
      >
        <div className="col-span-2">
          {summaryOptions.map((opt, index) => (
            <div
              key={`summaryopt-${index}`}
              className="flex items-center justify-between border-b border-muted py-6 last:border-none last:pb-0"
            >
              <Text className="text-sm font-medium text-gray-900">
                {opt.title}
              </Text>
              <ButtonGroup
                value={notificationChannels[`summary.${opt.id}`]}
                onChange={(option) =>
                  setNotificationChannels((prev) => ({
                    ...prev,
                    [`summary.${opt.id}`]: option,
                  }))
                }
              />
            </div>
          ))}
        </div>
      </HorizontalFormBlockWrapper>
      <HorizontalFormBlockWrapper
        title={t('profile.notifications.comments.title') ?? 'Comments'}
        description={t('profile.notifications.comments.description') ?? 'These are notifications for comments on your posts and replies to your comments.'}
        descriptionClassName="max-w-[344px]"
      >
        <div className="col-span-2">
          <Switch
            label={t('profile.notifications.doNotNotify') ?? 'Do not notify me'}
            variant="flat"
            labelClassName="font-medium text-sm text-gray-900"
          />
          <Switch
            label={t('profile.notifications.comments.mentionsOnly') ?? 'Mentions only'}
            variant="flat"
            labelClassName="font-medium text-sm text-gray-900"
          />
          <Switch
            label={t('profile.notifications.comments.allComments') ?? 'All comments'}
            variant="flat"
            labelClassName="font-medium text-sm text-gray-900"
          />
        </div>
      </HorizontalFormBlockWrapper>
      <HorizontalFormBlockWrapper
        title={t('profile.notifications.fromUs.title') ?? 'Notifications from us'}
        description={t('profile.notifications.fromUs.description') ?? 'These are notifications for when someone tags you in a comment, post or story.'}
        descriptionClassName="max-w-[344px]"
      >
        <div className="col-span-2">
          <CheckboxGroup
            values={values}
            setValues={setValues}
            className="flex flex-col"
          >
            <Checkbox
              name="app_notification"
              label={t('profile.notifications.fromUs.newsLabel') ?? 'News and updates'}
              value="news_updates"
              className="mb-5"
              labelClassName="pl-2 text-sm font-medium !text-gray-900"
              helperClassName="text-gray-500 text-sm mt-3 ms-8"
              helperText={t('profile.notifications.fromUs.newsHelper') ?? 'News about product and feature updates.'}
            />
            <Checkbox
              name="app_notification"
              label={t('profile.notifications.fromUs.tipsLabel') ?? 'Tips and tutorials'}
              value="tips_tutorials"
              className="mb-5"
              labelClassName="pl-2 text-sm font-medium text-gray-900"
              helperClassName="text-gray-500 text-sm mt-3 ms-8"
              helperText={t('profile.notifications.fromUs.tipsHelper') ?? 'Tips on getting more out of Untitled.'}
            />
            <Checkbox
              name="app_notification"
              label={t('profile.notifications.fromUs.researchLabel') ?? 'User research'}
              value="user_research"
              labelClassName="pl-2 text-sm font-medium text-gray-900"
              helperClassName="text-gray-500 text-sm mt-3 ms-8"
              helperText={t('profile.notifications.fromUs.researchHelper') ?? 'Get involved in our beta testing program or participate in paid product user research.'}
            />
          </CheckboxGroup>
        </div>
      </HorizontalFormBlockWrapper>
      <HorizontalFormBlockWrapper
        title={t('profile.notifications.reminders.title') ?? 'Reminders'}
        description={t('profile.notifications.reminders.description') ?? 'These are notifications to remind you of updates you might have missed.'}
        descriptionClassName="max-w-[344px]"
      >
        <div className="col-span-2">
          <RadioGroup
            value={remindersValue}
            setValue={setRemindersValue}
            className="justify-center space-x-4 space-y-4"
          >
            <div className="flex w-full flex-col divide-slate-300 md:w-[500px]">
              <Radio
                name="reminders"
                label={t('profile.notifications.doNotNotify') ?? 'Do not notify me'}
                value="do_not_notify"
                className="mb-5"
                labelClassName="pl-2 text-sm font-medium text-gray-900"
              />
              <Radio
                name="reminders"
                label={t('profile.notifications.reminders.importantOnly') ?? 'Important reminders only'}
                value="important_only"
                className="mb-5"
                labelClassName="pl-2 text-sm font-medium text-gray-900"
                helperClassName="text-gray-500 text-sm mt-3 ms-8"
                helperText={t('profile.notifications.reminders.importantOnlyHelper') ?? 'Only notify me if the reminder is tagged as important.'}
              />
              <Radio
                name="reminders"
                value="all_reminder"
                label={t('profile.notifications.allReminders') ?? 'All reminders'}
                labelClassName="pl-2 text-sm font-medium text-gray-900"
                helperClassName="text-gray-500 text-sm mt-3 ms-8"
                helperText={t('profile.notifications.allRemindersHelper') ?? 'Notify me for all reminders.'}
              />
            </div>
          </RadioGroup>
        </div>
      </HorizontalFormBlockWrapper>
      <HorizontalFormBlockWrapper
        title={t('profile.notifications.activity.title') ?? 'More activity about you'}
        description={t('profile.notifications.activity.description') ?? 'These are notifications for posts on your profile, likes and other reactions to your posts, and more.'}
        descriptionClassName="max-w-[344px]"
        className="border-0 pb-0"
      >
        <div className="col-span-2">
          <RadioGroup
            value={activityValue}
            setValue={setActivityValue}
            className="justify-center space-x-4 space-y-4"
          >
            <div className="flex w-full flex-col divide-slate-300 md:w-[500px]">
              <Radio
                name="activity"
                label={t('profile.notifications.doNotNotify') ?? 'Do not notify me'}
                value="do_not_notify_activity"
                className="mb-5"
                labelClassName="pl-2 text-sm font-medium text-gray-900"
              />
              <Radio
                name="activity"
                value="all_reminder_activity"
                label={t('profile.notifications.allReminders') ?? 'All reminders'}
                labelClassName="pl-2 text-sm font-medium text-gray-900"
                helperClassName="text-gray-500 text-sm mt-3 ms-8"
                helperText={t('profile.notifications.allRemindersHelper') ?? 'Notify me for all reminders.'}
              />
            </div>
          </RadioGroup>
        </div>
      </HorizontalFormBlockWrapper>
    </div>
  );
}

const options = ['None', 'In-app', 'Email'];

function ButtonGroup({
  value,
  onChange,
}: {
  value?: string;
  onChange: (option: string) => void;
}) {
  const t = useTranslations();
  function handleOnClick(option: string) {
    onChange(option);
  }

  const optionLabels: Record<string, string> = {
    None: t('profile.notifications.channel.none') ?? 'None',
    'In-app': t('profile.notifications.channel.inApp') ?? 'In-app',
    Email: t('profile.notifications.channel.email') ?? 'Email',
  };

  return (
    <div className="inline-flex gap-1">
      {options.map((option) => (
        <Button
          key={option}
          variant={value === option ? 'solid' : 'outline'}
          onClick={() => handleOnClick(option)}
        >
          {optionLabels[option] ?? option}
        </Button>
      ))}
    </div>
  );
}
