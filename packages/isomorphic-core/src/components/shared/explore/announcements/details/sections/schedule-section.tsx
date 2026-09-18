import { PiClockBold } from 'react-icons/pi';

interface ScheduleProps {
  schedule: Array<{ time: string; activity: string }>;
}

export default function ScheduleSection({ schedule }: ScheduleProps) {
  return (
    <div className="mb-8 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 px-6 py-5">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center mr-3">
            <PiClockBold className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-xl font-bold text-white">Event Schedule</h2>
        </div>
      </div>
      
      <div className="p-6">
        <div className="relative pl-4 mt-6">
          {schedule.map((item, index) => (
            <div key={index} className="relative pb-8">
              {/* Vertical line */}
              {index < schedule.length - 1 && (
                <div className="absolute left-3 top-6 h-full w-0.5 bg-gradient-to-b from-mainBlue to-blue-200"></div>
              )}
              
              {/* Step item */}
              <div className="group flex items-start">
                <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-mainBlue shadow-md shadow-blue-200 group-hover:scale-110 transition-transform">
                  <PiClockBold className="h-3 w-3 text-white" />
                </div>
                <div className="ml-4 bg-white rounded-lg border border-gray-100 p-4 shadow-sm transition-all group-hover:shadow-md group-hover:border-blue-100 w-full">
                  <div className="font-semibold text-mainBlue">{item.time}</div>
                  <div className="mt-1">{item.activity}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}