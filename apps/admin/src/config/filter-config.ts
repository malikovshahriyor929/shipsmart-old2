import { FilterSection } from '@core/components/filter-sidebar';

export const announcementsFilters: FilterSection[] = [
  {
    id: 'categories',
    title: 'Categories',
    type: 'checkbox',
    options: [
      { name: 'Competition', value: 'Competition' },
      { name: 'Workshop', value: 'Workshop' },
      { name: 'Volunteer', value: 'Volunteer' },
      { name: 'Internship', value: 'Internship' },
      { name: 'Social', value: 'Social' },
      { name: 'Seminar', value: 'Seminar' },
    ],
  },
  {
    id: 'dateRange',
    title: 'Date Range',
    type: 'checkbox',
    options: [
      { name: 'All Time', value: '' },
      { name: 'Today', value: 'today' },
      { name: 'This Week', value: 'this-week' },
      { name: 'This Month', value: 'this-month' },
    ],
  },
  {
    id: 'locations',
    title: 'Location',
    type: 'checkbox',
    options: [
      { name: 'On Campus', value: 'On Campus' },
      { name: 'Downtown', value: 'Downtown' },
      { name: 'Virtual', value: 'Virtual' },
      { name: 'International', value: 'International' },
    ],
  },
  {
    id: 'universities',
    title: 'Associated University',
    type: 'checkbox',
    options: [
      { name: 'Harvard University', value: 'Harvard University' },
      { name: 'MIT', value: 'MIT' },
      { name: 'Stanford University', value: 'Stanford University' },
      { name: 'Oxford University', value: 'Oxford University' },
      { name: 'Cambridge University', value: 'Cambridge University' },
    ],
  },
];

// Universities page filter configuration

export const universityFilters: FilterSection[] = [
  {
    id: 'types',
    title: 'University Type',
    type: 'checkbox',
    options: [
      { name: 'Public', value: 'public' },
      { name: 'Private', value: 'private' },
      { name: 'Ivy League', value: 'ivy-league' },
      { name: 'Liberal Arts', value: 'liberal-arts' },
      { name: 'Research', value: 'research' },
    ],
  },
  {
    id: 'ranking',
    title: 'Ranking',
    type: 'checkbox',
    options: [
      { name: 'All', value: '' },
      { name: 'Top 10', value: 'top-10' },
      { name: 'Top 50', value: 'top-50' },
      { name: 'Top 100', value: 'top-100' },
      { name: 'Top 500', value: 'top-500' },
    ],
  },
  {
    id: 'countries',
    title: 'Country',
    type: 'checkbox',
    options: [
      { name: 'United States', value: 'United States' },
      { name: 'United Kingdom', value: 'United Kingdom' },
      { name: 'Switzerland', value: 'Switzerland' },
      { name: 'Germany', value: 'Germany' },
      { name: 'Canada', value: 'Canada' },
      { name: 'Australia', value: 'Australia' },
    ],
  },
  {
    id: 'tuitionRanges',
    title: 'Tuition Range',
    type: 'checkbox',
    options: [
      { name: 'Under $10,000', value: 'under-10k' },
      { name: '$10,000 - $30,000', value: '10k-30k' },
      { name: '$30,000 - $50,000', value: '30k-50k' },
      { name: 'Above $50,000', value: 'above-50k' },
    ],
  },
];

// Rankings page filter configuration (for future use)
export const rankingsFilters: FilterSection[] = [
  {
    id: 'rankingType',
    title: 'Ranking Type',
    type: 'checkbox',
    options: [
      { name: 'QS World Rankings', value: 'qs' },
      { name: 'Times Higher Education', value: 'the' },
      { name: 'Academic Ranking of World Universities', value: 'arwu' },
      { name: 'US News & World Report', value: 'usnews' },
    ],
  },
  {
    id: 'year',
    title: 'Ranking Year',
    type: 'checkbox',
    options: [
      { name: '2025', value: '2025' },
      { name: '2024', value: '2024' },
      { name: '2023', value: '2023' },
      { name: '2022', value: '2022' },
    ],
  },
  {
    id: 'regions',
    title: 'Region',
    type: 'checkbox',
    options: [
      { name: 'North America', value: 'north-america' },
      { name: 'Europe', value: 'europe' },
      { name: 'Asia', value: 'asia' },
      { name: 'Australia & Oceania', value: 'australia-oceania' },
      { name: 'Africa', value: 'africa' },
      { name: 'South America', value: 'south-america' },
    ],
  },
  {
    id: 'subjects',
    title: 'Subject Areas',
    type: 'checkbox',
    options: [
      { name: 'Arts & Humanities', value: 'arts-humanities' },
      { name: 'Engineering & Technology', value: 'engineering-tech' },
      { name: 'Life Sciences & Medicine', value: 'life-sciences-medicine' },
      { name: 'Natural Sciences', value: 'natural-sciences' },
      { name: 'Social Sciences & Management', value: 'social-sciences' },
    ],
  },
];
