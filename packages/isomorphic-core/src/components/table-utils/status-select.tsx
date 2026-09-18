"use client";

import { useState, useEffect } from "react";
import { PiCheckCircleBold, PiClockBold, PiPlusCircle } from "react-icons/pi";
import { Select, SelectOption, Text } from "rizzui";
import { t } from "i18next";

export function StatusSelect({
  selectItem,
  options,
  onChange,
}: {
  selectItem?: string;
  options: SelectOption[];
  onChange?: (value: string) => void;
}) {
  const selectItemValue = options.find(
    (option) => option.value === selectItem || option.label === selectItem
  );
  const [value, setValue] = useState(selectItemValue);

  // Handle external value changes
  useEffect(() => {
    const newSelectItemValue = options.find(
      (option) => option.value === selectItem || option.label === selectItem
    );
    if (newSelectItemValue && newSelectItemValue !== value) {
      setValue(newSelectItemValue);
    }
  }, [selectItem, options, value]);

  // Handle internal value changes with propagation to parent
  const handleChange = (newValue: SelectOption) => {
    setValue(newValue);
    if (onChange && newValue) {
      onChange(newValue.value as string);
    }
  };

  return (
    <Select
      dropdownClassName="!z-10"
      className="min-w-[140px]"
      placeholder={t("commons.select-status") ?? "Select Status"}
      options={options}
      value={value}
      onChange={handleChange}
      displayValue={(option: { value: any }) =>
        renderOptionDisplayValue(option.value as string)
      }
    />
  );
}

function renderOptionDisplayValue(value: string) {
  switch (value) {
    case "Scheduled":
    case "Attended":
      return (
        <div className="flex items-center">
          <PiCheckCircleBold className="shrink-0 fill-green-dark text-base" />
          <Text className="ms-1.5 text-sm font-medium capitalize text-gray-700">
            {value}
          </Text>
        </div>
      );
    case "Closed":
    case "Missed":
      return (
        <div className="flex items-center">
          <PiPlusCircle className="shrink-0 rotate-45 fill-red-dark text-lg" />
          <Text className="ms-1.5 text-sm font-medium capitalize text-gray-700">
            {value}
          </Text>
        </div>
      );
    case "Live":
      return (
        <div className="flex items-center">
          <PiCheckCircleBold className="shrink-0 fill-green-dark text-lg" />
          <Text className="ms-1.5 text-sm font-medium capitalize text-gray-700">
            {value}
          </Text>
        </div>
      );
    case "Waiting":
    case "Excused":
      return (
        <div className="flex items-center">
          <PiCheckCircleBold className="shrink-0 fill-orange text-base" />
          <Text className="ms-1.5 text-sm font-medium capitalize text-gray-700">
            {value}
          </Text>
        </div>
      );
    default:
      return (
        <div className="flex items-center">
          <PiCheckCircleBold className="shrink-0 fill-orange text-base" />
          <Text className="ms-1.5 text-sm font-medium capitalize text-gray-700">
            {value}
          </Text>
        </div>
      );
  }
}
