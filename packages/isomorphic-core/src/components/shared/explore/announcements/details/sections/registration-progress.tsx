import { Text, Badge, Progressbar } from 'rizzui';
import { PiChartLineUpBold, PiBellRingingBold } from 'react-icons/pi';

interface RegistrationProgressProps {
  remainingSpots: number;
  progress: number;
}

export default function RegistrationProgress({ remainingSpots, progress }: RegistrationProgressProps) {
  return (
    <div className="mb-8 bg-gradient-to-r from-white to-gray-50 p-5 rounded-lg border border-gray-200 shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <Text className="font-medium text-mainBlue flex items-center">
          <PiChartLineUpBold className="mr-2 h-5 w-5 text-mainBlue" />
          Registration Progress
        </Text>
        <Badge className="bg-green-50 text-green border-green-200">
          {Math.floor(progress)}% Full
        </Badge>
      </div>
      <Progressbar value={progress} color="success" size="lg" label="" className="h-2" />
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>0%</span>
        <span>50%</span>
        <span>100%</span>
      </div>
      <div className="mt-3 flex items-center text-sm text-red">
        <PiBellRingingBold className="h-4 w-4 mr-1 animate-pulse" />
        <span>Only {remainingSpots} spots remaining!</span>
      </div>
    </div>
  );
}