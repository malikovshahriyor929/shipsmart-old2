'use client';

import { Section } from '@core/types';
import { Fragment, useState } from 'react';
import { Button, Checkbox, RadioGroup, Radio, Text, Title } from 'rizzui';

export interface FilterOption {
  name: string;
  value: string;
}

export interface FilterSection {
  id: string;
  title: string;
  type: 'checkbox';
  options: FilterOption[];
}

interface GenericFilterSidebarProps {
  title: string;
  sections: FilterSection[];
  initialFilters?: Record<string, string | string[]>;
  onApplyFilters: (filters: Record<string, string | string[]>) => void;
  onClose?: () => void;
  className?: string;
}

export default function GenericFilterSidebar({
  title,
  sections,
  initialFilters = {},
  onApplyFilters,
  onClose,
  className = '',
}: GenericFilterSidebarProps) {
  // Initialize filter state from sections
  const [filters, setFilters] = useState<Record<string, string | string[]>>(
    () => {
      const initialState: Record<string, string | string[]> = {};
      sections.forEach((section) => {
        if (section.type === 'checkbox') {
          initialState[section.id] = initialFilters[section.id] || [];
        } else {
          initialState[section.id] = initialFilters[section.id] || '';
        }
      });
      return initialState;
    }
  );

  // Update filters when a checkbox option changes
  const handleCheckboxChange = (sectionId: string, value: string) => {
    setFilters((prev) => {
      const currentValues = prev[sectionId] as string[];
      const newValues = currentValues.includes(value)
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value];

      return {
        ...prev,
        [sectionId]: newValues,
      };
    });
  };

  // Update filters when a radio option changes
  const handleRadioChange = (sectionId: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [sectionId]: value,
    }));
  };

  // Apply all filters
  const applyFilters = () => {
    onApplyFilters(filters);
  };

  // Reset all filters
  const resetFilters = () => {
    const resetState: Record<string, string | string[]> = {};
    sections.forEach((section) => {
      resetState[section.id] = section.type === 'checkbox' ? [] : '';
    });
    setFilters(resetState);
    onApplyFilters(resetState);
  };

  return (
    <div className={`h-full overflow-y-auto px-7 py-2 rounded-xl border border-gray-200 ${className}`}>
      <div className="mb-4 flex items-center justify-between border-b border-gray-200 pb-4">
        <Title as="h5" className="text-lg text-start text-mainBlue dark:text-gray-600 font-semibold ">
          {title}
        </Title>
      </div>

      {/* Filter Sections */}
      {sections.map((section: any) => (
        <div key={section.id} className="mb-5 border-b border-gray-200 pb-5">
          <Title as='h6' className="mb-3 font-medium text-secondary dark:text-gray-500">{section.title}</Title>

          {/* Checkbox Filter */}
          {section.type === 'checkbox' && (
            <div className="grid grid-cols-1 gap-2">
              {section.options.map((option: any) => (
                <div key={option.value} className="flex items-center">
                  <Checkbox
                    rounded='lg'
                    checked={(filters[section.id] as string[]).includes(
                      option.value
                    )}
                    value={option.value}
                    onChange={() =>
                      handleCheckboxChange(section.id, option.value)
                    }
                    label={option.name}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Action Buttons */}
      <div className="mt-5 flex items-center gap-1">
        <Button size='md' variant="solid" className="w-full" onClick={applyFilters}>
          Apply
        </Button>
        <Button size='md' variant="outline" className="w-full" onClick={resetFilters}>
          Reset
        </Button>
      </div>
    </div>
  );
}
