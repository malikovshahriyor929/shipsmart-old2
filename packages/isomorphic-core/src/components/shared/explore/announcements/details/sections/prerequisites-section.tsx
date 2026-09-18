import { PiCheckCircleBold } from 'react-icons/pi';

interface PrerequisitesSectionProps {
  prerequisites: string[];
}

export default function PrerequisitesSection({ prerequisites }: PrerequisitesSectionProps) {
  return (
    <div className="mb-8 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="bg-gradient-to-r from-mainBlue to-blue-900 px-6 py-5">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center mr-3">
            <PiCheckCircleBold className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-xl font-bold text-white">Prerequisites</h2>
        </div>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {prerequisites.map((item, index) => (
            <div key={index} className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100 shadow-sm">
              <div className="flex items-start">
                <div className="rounded-full bg-white p-1.5 mr-3 shadow-sm flex-shrink-0">
                  <PiCheckCircleBold className="h-5 w-5 text-mainBlue" />
                </div>
                <div className="font-medium text-mainBlue">{item}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}