import { StaffRoleKey } from '@/store/users-role-context';

export const routes = {
  eventCalendar: '/event-calendar',

  //Customized routes
  appointment: {
    dashboard: '/appointment',
    appointmentList: '/appointment/list',
  },
  dashboard: {
    overview: '/dashboard',
  },
  shipments: {
    list: '/shipments',
    details: (pro: number) => `/shipments/${pro}`,
  },

  staff: {
    allStaff: '/staff/all-staff',
    addStaff: (role: StaffRoleKey) => `/staff/${role}/add-staff-member`,
    editStaff: (role: StaffRoleKey, staffId: number) =>
      `/staff/${role}/edit-staff-member/${staffId}`,
    staffDetails: (role: StaffRoleKey, staffId: number) =>
      `/staff/${role}/profile/${staffId}`,
  },

  myStudents: {
    // allStudents: '/mystudents/allstudents',
    myAssignedStudents: '/mystudents/my-assigned-students',
    addStudent: '/mystudents/add-student',
    editStudent: '/mystudents/edit-student',
    details: (id: string) => `/mystudents/${id}`,
    edit: (id: string) => `/mystudents/${id}/edit`,
  },
  assessments: {
    rubric: '/assessments/rubrics',
    testScores: '/assessments/test-scores',
    history: '/assessments/history',
  },
  schedules: {
    calendar: '/schedules/calendar',
    attendance: '/schedules/attendance',
  },
  tasks: {
    overview: '/tasks/overview',
    taskBoard: '/tasks/task-board',
    assignTask: '/tasks/assign-task',
    allTasks: '/tasks/all-tasks',
    // edit: (id: string) => `/tasks/${id}/edit`,
  },
  points: '/points',

  analyticsReports: {
    readinessDashboard: '/analytics-reports/readiness-dashboard',
    atRiskTracker: '/analytics-reports/at-risk-tracker',
  },

  messages: {
    dashboard: '/chat',
    inbox: '/chat/inbox',
    messageDetails: (id: string) => `/chat/inbox/${id}`,
  },

  profile: '/profile',

  notifications: '/notification',
  contactUs: '/contact-us',

  courses: {
    allCourses: '/courses/all-courses',
    sessions: '/courses/sessions',
    sessionsDetails: (id: string) => `/courses/sessions/${id}`,
    courseDetails: (id: string) => `/courses/${id}`,
    courseLearning: (id: string) => `/courses/${id}/learn`,
    courseLessonDetails: (id: string, lessonSlug: string) =>
      `/courses/${id}/learn/${lessonSlug}`,
  },

  explore: {
    topUniversities: {
      overview: '/explore/top-universities/overview',
      rankings: '/explore/top-universities/rankings',
      universityDetails: (universityId: string) =>
        `/explore/top-universities/${universityId}`,
    },
    announcements: {
      overview: '/explore/announcements',
      announcementDetails: (announcementId: string) =>
        `/explore/announcements/${announcementId}`,
      announcementsTable: '/explore/announcements/all-announcements-table',
    },
  },

  settings: {
    profileSettings: '/profile-settings',
    notificationSettings: '/profile-settings/notification',
    passwordSettings: '/profile-settings/password',
  },
  resources: {
    guidelines: '/resources/guidelines',
    rubricTemplates: '/resources/rubric-templates',
    faqs: '/resources/advisor-faqs',
  },
  support: {
    main: '/support',
    inbox: '/support/inbox',
  },

  // Custom routes end

  imageViewer: '/image-viewer',

  welcome: '/welcome',
  comingSoon: '/coming-soon',
  accessDenied: '/access-denied',
  notFound: '/not-found',
  maintenance: '/maintenance',
  blank: '/blank',
  auth: {
    signIn: '/auth/sign-in',
    forgotPassword: '/auth/forgot-password',
    requestResetPassword: '/auth/request-reset-password',
    otp: '/auth/otp',
  },
  signIn: '/signin',
  emailTemplates: '/email-templates',
};
