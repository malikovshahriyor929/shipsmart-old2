import { PiGiftBold, PiMedalBold, PiGraduationCapBold, PiConfettiBold, PiCertificateBold, PiHandshakeBold, PiStarBold } from 'react-icons/pi';

interface BenefitsSectionProps {
  benefits: string[];
}

export default function BenefitsSection({ benefits }: BenefitsSectionProps) {
  return (
    <div className="mb-8 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="bg-gradient-to-r from-green to-mainBlue px-6 py-5">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center mr-3">
            <PiGiftBold className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-xl font-bold text-white">Event Benefits</h2>
        </div>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {benefits.map((item, index) => (
            <div key={index} className="flex p-4 rounded-lg border border-gray-100 bg-white shadow-sm hover:shadow-md hover:border-green-100 transition-all">
              <div className="flex-shrink-0 flex h-12 w-12 items-center justify-center rounded-full bg-green text-white">
                {index === 0 ? <PiMedalBold className="h-6 w-6" /> :
                index === 1 ? <PiCertificateBold className="h-6 w-6" /> :
                index === 2 ? <PiHandshakeBold className="h-6 w-6" /> :
                index === 3 ? <PiGraduationCapBold className="h-6 w-6" /> :
                <PiConfettiBold className="h-6 w-6" />}
              </div>
              <div className="ml-4">
                <div className="font-medium text-gray-900">{item}</div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-amber-50 border border-amber-100 rounded-lg text-amber-800">
          <div className="flex items-start">
            <PiStarBold className="h-5 w-5 mr-2 mt-1 flex-shrink-0 text-amber-500" />
            <div>
              <h4 className="font-medium mb-1 text-mainBlue">Portfolio Enhancement</h4>
              <p className="text-sm">
                This event is highly valued by top universities and can significantly strengthen your application portfolio.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}