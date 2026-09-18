'use client';

import { SupportLookup } from '@core/types';
import { t } from 'i18next';
import React from 'react';
import { Input, Select, Textarea, Button, SelectOption, Text } from 'rizzui';
import { z } from 'zod';

// const TicketSchema = z.object({
//   title: z.string().trim().min(1, 'Title is required'),
//   message: z.string().trim().min(1, 'Message is required'),
//   type: z.object({
//     value: z.string().min(1, 'Please select a type'),
//     label: z.string(),
//   }),
//   priority: z.object({
//     value: z.string().min(1, 'Please select a priority'),
//     label: z.string(),
//   }),
// });
const TicketSchema = z.object({
  title: z.string().trim().min(1, t('support.ticket.errors.titleRequired')),
  message: z.string().trim().min(1, t('support.ticket.errors.messageRequired')),
  type: z.object({
    value: z.string().min(1, t('support.ticket.errors.typeRequired')),
    label: z.string(),
  }),
  priority: z.object({
    value: z.string().min(1, t('support.ticket.errors.priorityRequired')),
    label: z.string(),
  }),
});

type TicketForm = z.infer<typeof TicketSchema>;

type Props = {
  lookup: SupportLookup | null;
  onSubmit: (data: { title: string; message: string; type: number; priority: number }) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
};

export default function SupportTicketModalContent({ lookup, onSubmit, onCancel, isSubmitting }: Props) {
  const [form, setForm] = React.useState<TicketForm>({
    title: '',
    message: '',
    // type: { value: '', label: 'Select a type' },
    // priority: { value: '', label: 'Select a priority' },
    type: { value: '', label: t('support.ticket.placeholders.selectType') },
    priority: { value: '', label: t('support.ticket.placeholders.selectPriority') },
  });
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const requestTypeOptions = React.useMemo<SelectOption[]>(
    () =>
      (lookup?.['ticket-type'] ?? []).map((t) => ({
        value: String(t.value),
        label: t.label,
      })),
    [lookup]
  );

  const priorityTypeOptions = React.useMemo<SelectOption[]>(
    () =>
      (lookup?.['ticket-priority'] ?? []).map((t) => ({
        value: String(t.value),
        label: t.label,
      })),
    [lookup]
  );

  const handleChange = (key: keyof TicketForm, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: '' })); // clear field error on change
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = TicketSchema.safeParse(form);

    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        const path = err.path.join('.');
        newErrors[path] = err.message;
      });
      setErrors(newErrors);
      return;
    }

    onSubmit({
      title: form.title.trim(),
      message: form.message.trim(),
      type: +form.type.value,
      priority: +form.priority.value,
    });
  };

  return (
    <form onSubmit={ handleSubmit } className="space-y-5 p-5 dark:bg-gray-100 dark:rounded-lg">
      <div>
        <Input
          // label="Title"
          // placeholder="Enter title..."
          label={ t('support.ticket.labels.title') }
          placeholder={ t('support.ticket.placeholders.title') }
          className='dark:placeholder:text-whitesa'
          value={ form.title }
          onChange={ (e) => handleChange('title', e.target.value) }
          error={ errors.title }
        />
      </div>

      <div>
        <Textarea
          // label="Message"
          // placeholder="Describe your issue..."
          label={ t('support.ticket.labels.message') }
          placeholder={ t('support.ticket.placeholders.message') }
          rows={ 4 }
          value={ form.message }
          onChange={ (e) => handleChange('message', e.target.value) }
          error={ errors.message }
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Select
            label={ t('support.ticket.labels.requestType') }
            placeholder={ t('support.ticket.placeholders.selectType') }
            // label="Request Type"
            // placeholder="Select type"
            dropdownClassName="!z-[99999]"
            className="min-w-[250px]"
            options={ requestTypeOptions }
            value={ form.type }
            onChange={ (value: SelectOption) => handleChange('type', value) }
            displayValue={ (v: SelectOption) => v.label }
            error={ errors['type.value'] }
          />
        </div>

        <div>
          <Select
            // label="Priority"
            // placeholder="Select priority"
            label={ t('support.ticket.labels.priority') }
            placeholder={ t('support.ticket.placeholders.selectPriority') }
            dropdownClassName="!z-[99999]"
            className="min-w-[250px] "
            options={ priorityTypeOptions }
            value={ form.priority }
            onChange={ (value: SelectOption) => handleChange('priority', value) }
            displayValue={ (v: SelectOption) => v.label }
            error={ errors['priority.value'] }

          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button variant="outline" onClick={ onCancel }>
          { t('commons.cancel') }
        </Button>
        <Button type="submit" disabled={ isSubmitting } isLoading={ isSubmitting }>
          { t('support.ticket.actions.submit') }
        </Button>
      </div>
    </form>
  );
}
