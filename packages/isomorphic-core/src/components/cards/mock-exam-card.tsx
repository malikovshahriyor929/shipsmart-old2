"use client";

import Image from "next/image";
import { Badge } from "rizzui";
import { MockExam } from "@core/types/index";
import { PiStar, PiStarFill, PiStarHalf } from "react-icons/pi";
import cn from "@core/utils/class-names";

interface MockExamCardProps {
  exam: MockExam;
  className?: string;
  onClick?: (id: string) => void;
}

export function MockExamCard({ exam, className, onClick }: MockExamCardProps) {
  // Function to render star rating
  const renderRating = (rating: number) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <PiStarFill key={`full-${i}`} className="h-4 w-4 text-amber-500" />
        ))}
        {halfStar && <PiStarHalf className="h-4 w-4 text-amber-500" />}
        {[...Array(emptyStars)].map((_, i) => (
          <PiStar key={`empty-${i}`} className="h-4 w-4 text-amber-500" />
        ))}
      </div>
    );
  };

  return (
    <div
      className={cn(
        "group relative top-0 overflow-hidden rounded-xl border border-gray-200 bg-white transition-all duration-200 hover:-top-1 hover:border-mainBlue hover:shadow-lg dark:border-gray-700 dark:bg-gray-800 cursor-pointer",
        className
      )}
      onClick={() => onClick?.(exam.id)}
    >
      <div className="relative mx-auto aspect-[4/3] w-full overflow-hidden bg-gray-100">
        <Image
          alt={exam.title}
          src={exam.thumbnail}
          fill
          priority
          quality={90}
          sizes="(max-width: 768px) 100vw"
          className="object-cover transition-transform duration-300 group-hover:scale-110"
        />
        {exam.type && (
          <Badge
            variant="flat"
            className="absolute right-3 top-3 bg-white/90 text-mainBlue dark:bg-gray-900/90"
            rounded="lg"
          >
            {exam.type}
          </Badge>
        )}
      </div>

      <div className="p-4">
        <h3 className="mb-1.5 line-clamp-2 text-base font-medium text-gray-900 group-hover:text-mainBlue dark:text-gray-100">
          {exam.title}
        </h3>

        <div className="flex items-center gap-1.5">
          <span className="text-amber-500 font-medium">
            {exam.rating.toFixed(1)}
          </span>
          {renderRating(exam.rating)}
          <span className="text-xs text-gray-500">({exam.votes} votes)</span>
        </div>
      </div>
    </div>
  );
}
