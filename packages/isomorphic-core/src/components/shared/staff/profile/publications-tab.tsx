import React from 'react';
import { Text, Title, Badge } from 'rizzui';
import {
  PiNotePencil,
  PiUsers,
  PiCalendar,
  PiArrowSquareOut,
  PiBookBookmark,
} from 'react-icons/pi';

interface Publication {
  title: string;
  journal: string;
  year: string;
  coAuthors: string;
  doi: string;
}

interface PublicationsTabProps {
  publications: Publication[];
}

const PublicationsTab: React.FC<PublicationsTabProps> = ({ publications }) => {
  return (
    <div className="space-y-6">
      {publications.map((publication, index) => (
        <div
          key={index}
          className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800"
        >
          <div className="flex flex-col gap-4 lg:flex-row">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
              <PiBookBookmark className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>

            <div className="flex-1">
              <Title as="h3" className="mb-2 text-lg font-bold">
                {publication.title}
              </Title>

              <div className="mb-3 flex flex-wrap items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <Badge
                  className="border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800/30 dark:bg-blue-900/30 dark:text-blue-400"
                  variant="outline"
                >
                  {publication.journal}
                </Badge>
                <Text className="flex items-center gap-1 text-sm">
                  <PiCalendar className="h-4 w-4" />
                  {publication.year}
                </Text>
              </div>

              <div className="mb-4">
                <Text className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Co-authors
                </Text>
                <Text className="flex items-start gap-1 text-sm text-gray-600 dark:text-gray-400">
                  <PiUsers className="mt-0.5 h-4 w-4" />
                  {publication.coAuthors}
                </Text>
              </div>

              <a
                href={`https://doi.org/${publication.doi}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm font-medium text-blue-600 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-blue-400 dark:hover:bg-gray-700"
              >
                <span>DOI: {publication.doi}</span>
                <PiArrowSquareOut className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PublicationsTab;
