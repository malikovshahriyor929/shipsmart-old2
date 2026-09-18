import React from 'react';
import { Text, Title, Button } from 'rizzui';
import {
  PiCalendar,
  PiClock,
  PiBuildings,
  PiEnvelopeOpen,
  PiPhone,
  PiCalendarPlus,
} from 'react-icons/pi';

interface AvailabilityTabProps {
  advisor: any;
}

const AvailabilityTab: React.FC<AvailabilityTabProps> = ({ advisor }) => {
  // Parse office hours
  const officeHours = advisor.officeHours
    .split(',')
    .map((slot: string) => slot.trim());

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Office Hours Schedule */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
        <div className="mb-4 flex items-center gap-2">
          <div className="rounded-full bg-blue-50 p-2 dark:bg-blue-900/20">
            <PiClock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <Title as="h3" className="text-lg font-semibold">
            Office Hours
          </Title>
        </div>

        <div className="space-y-3">
          {officeHours.map((slot: string, index: number) => {
            const [day, time] = slot.split(':');

            return (
              <div
                key={index}
                className="flex items-start gap-3 rounded-lg bg-gray-50 p-3 dark:bg-gray-700/40"
              >
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                  <PiCalendar className="h-4 w-4" />
                </div>
                <div>
                  <Text className="font-medium">{day}</Text>
                  <Text className="text-sm text-gray-600 dark:text-gray-300">
                    {time}
                  </Text>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4 dark:border-gray-700">
          <Text className="text-sm text-gray-500 dark:text-gray-400">
            Walk-ins welcome during office hours
          </Text>
          <Button
            variant="solid"
            color="primary"
            size="sm"
            className="flex items-center gap-1.5"
          >
            <PiCalendarPlus className="h-4 w-4" />
            Book Appointment
          </Button>
        </div>
      </div>

      {/* Contact Information */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
        <div className="mb-4 flex items-center gap-2">
          <div className="rounded-full bg-green-50 p-2 dark:bg-green-900/20">
            <PiEnvelopeOpen className="h-5 w-5 text-green-600 dark:text-green-400" />
          </div>
          <Title as="h3" className="text-lg font-semibold">
            Contact Information
          </Title>
        </div>

        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="rounded-md bg-gray-100 p-2 dark:bg-gray-100">
              <PiBuildings className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <Text className="text-sm text-gray-500 dark:text-gray-400">
                Office Location
              </Text>
              <Text className="font-medium">{advisor.office}</Text>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="rounded-md bg-gray-100 p-2 dark:bg-gray-100">
              <PiPhone className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <Text className="text-sm text-gray-500 dark:text-gray-400">
                Phone
              </Text>
              <Text className="font-medium">{advisor.phone}</Text>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="rounded-md bg-gray-100 p-2 dark:bg-gray-100">
              <PiEnvelopeOpen className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <Text className="text-sm text-gray-500 dark:text-gray-400">
                Email
              </Text>
              <Text className="font-medium">{advisor.email}</Text>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <Button
            variant="solid"
            color="secondary"
            className="w-full"
            onClick={() => window.open(`mailto:${advisor.email}`)}
          >
            Send Email
          </Button>
        </div>
      </div>

      {/* Calendar Preview (Placeholder) */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800 md:col-span-2">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-purple-50 p-2 dark:bg-purple-900/20">
              <PiCalendar className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <Title as="h3" className="text-lg font-semibold">
              Availability Calendar
            </Title>
          </div>

          <div className="flex items-center gap-2">
            <Text className="text-sm font-medium text-gray-500 dark:text-gray-400">
              July 2023
            </Text>
          </div>
        </div>

        <div className="min-h-[200px] rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
          <div className="grid grid-cols-7 gap-2">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
              <div
                key={day}
                className="text-center text-xs font-medium text-gray-500 dark:text-gray-400"
              >
                {day}
              </div>
            ))}

            {Array.from({ length: 31 }).map((_, i) => (
              <div
                key={i}
                className={`h-10 rounded-md border border-gray-200 p-1 text-center text-sm ${
                  [3, 8, 10, 15, 17, 22, 24].includes(i)
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-white text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                }`}
              >
                {i + 1}
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-center">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-green-500"></div>
              <Text className="text-xs text-gray-500 dark:text-gray-400">
                Available for appointments
              </Text>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvailabilityTab;
