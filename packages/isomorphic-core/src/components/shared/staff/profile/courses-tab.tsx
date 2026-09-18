import React from 'react';
import { Badge, Text, Title } from 'rizzui';
import {
  PiBooks,
  PiUsers,
  PiStar,
  PiCalendar,
  PiChalkboardTeacher,
} from 'react-icons/pi';
import cn from '@core/utils/class-names';

interface Course {
  code: string;
  name: string;
  semester: string;
  students: number;
  rating: number;
}

interface CoursesTabProps {
  courses: Course[];
}

const CoursesTab: React.FC<CoursesTabProps> = ({ courses }) => {
  // Get rating stars
  const getRatingStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const stars = [];

    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<PiStar key={`full-${i}`} className="h-4 w-4 fill-current" />);
    }

    // Add half star if needed
    if (hasHalfStar) {
      stars.push(
        <span key="half" className="relative">
          <PiStar className="h-4 w-4 text-gray-300 dark:text-gray-600" />
          <span
            className="absolute left-0 top-0 overflow-hidden"
            style={{ width: '50%' }}
          >
            <PiStar className="h-4 w-4 fill-current" />
          </span>
        </span>
      );
    }

    // Add empty stars
    const emptyStars = 5 - (fullStars + (hasHalfStar ? 1 : 0));
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <PiStar
          key={`empty-${i}`}
          className="h-4 w-4 text-gray-300 dark:text-gray-600"
        />
      );
    }

    return stars;
  };

  // Get semester badge color
  const getSemesterColor = (semester: string) => {
    if (semester.includes('Fall')) {
      return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
    } else if (semester.includes('Spring')) {
      return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
    } else if (semester.includes('Summer')) {
      return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
    } else {
      return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {courses.map((course, index) => (
        <div
          key={index}
          className="flex flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
        >
          <div className="flex items-start justify-between">
            <Badge className="rounded-md text-sm font-bold text-white" color='info' variant="flat">
              {course.code}
            </Badge>
            <Badge
              className={cn('text-xs', getSemesterColor(course.semester))}
              variant="flat"
            >
              <PiCalendar className="mr-1 h-3.5 w-3.5" />
              {course.semester}
            </Badge>
          </div>

          <Title as="h3" className="mb-4 mt-3 text-lg font-semibold">
            {course.name}
          </Title>

          <div className="mt-auto space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              <PiChalkboardTeacher className="h-4 w-4" />
              <Text>Instructor</Text>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PiUsers className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                <Text className="text-sm text-gray-600 dark:text-gray-300">
                  {course.students} Students
                </Text>
              </div>

              <div className="flex items-center gap-1 text-amber-500">
                {getRatingStars(course.rating)}
                <Text className="ml-1 text-sm font-medium">
                  {course.rating.toFixed(1)}
                </Text>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CoursesTab;
