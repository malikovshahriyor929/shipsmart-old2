"use client";

import { useMemo } from "react";
import { Button, Select } from "rizzui";
import { PiArrowRightBold, PiFilePdf, PiStarFill } from "react-icons/pi";
import cn from "@core/utils/class-names";
import CustomVideoPlayer from "@core/components/custom-video-player";
import LessonNavTabs from "@core/components/courses/lessons/lesson-nav-tabs";
import LessonOverview from "@core/components/courses/lessons/lesson-overview";
import StudentProgressTab from "@core/components/courses/lessons/students-progress-tab";
import Pagination from "@core/components/pagination";
// import NotFound from '@/app/[locale]/not-found';
import { isVideoExt, thumbUrl } from "@core/utils/course-utils";
import { t } from "i18next";
import type { LessonDetailsItem, _Meta } from "@core/types";
import AttachmentCard from "@core/components/cards/attachment-card";
import ReviewCard from "@core/components/cards/review-card";

// Reusing the prop type logic from existing files, consolidated.
type SharedLessonContentProps = {
  // courseId is often passed but maybe unused in simple display, keeping for compatibility
  courseId: string | number;
  lessonItem: LessonDetailsItem | null;
  isLoading?: boolean;
  activeTab: string;
  onTabChange: (tab: any) => void;
  onGoNext?: () => void;
  onStudentsPageChange?: (page: number) => void;
  onReviewsPageChange?: (page: number) => void;
  reviewRatingFilter?: number | null;
  onReviewRatingChange?: (rating: number | null) => void;
  showReviewRatingFilter?: boolean;
  studentSearchQuery?: string;
  studentStatusFilter?: "all" | "completed" | "inprogress" | "notstarted";
  onStudentSearchChange?: (value: string) => void;
  onStudentStatusChange?: (
    value: "all" | "completed" | "inprogress" | "notstarted",
  ) => void;
  // Configuration to control which tabs are shown
  visibleTabs?: string[];
  notFoundComponent?: React.ReactNode;
};

export default function SharedLessonContent({
  lessonItem,
  isLoading = false,
  activeTab,
  onTabChange,
  onGoNext,
  onStudentsPageChange,
  onReviewsPageChange,
  reviewRatingFilter,
  onReviewRatingChange,
  showReviewRatingFilter = false,
  studentSearchQuery = "",
  studentStatusFilter = "all",
  onStudentSearchChange,
  onStudentStatusChange,
  visibleTabs = ["overview", "files", "students"],
  notFoundComponent,
}: SharedLessonContentProps) {
  const lesson = lessonItem?.lesson || null;
  const studentsProgress = lessonItem?.students_progress || [];
  const studentsProgressMeta = lessonItem?.students_progress_meta || null;
  const reviewsMeta = lessonItem?.reviews_meta || null;
  const courseRating = lessonItem?.course_rating || null;

  const attachments = Array.isArray(lesson?.attachments)
    ? lesson!.attachments!
    : [];
  const filesCount = attachments.length;
  const reviews = Array.isArray(lesson?.reviews) ? lesson.reviews : [];
  const reviewsCount =
    reviewsMeta?.total ?? courseRating?.total_reviews ?? reviews.length;
  const canGoNext = Boolean(lesson?.next_lesson_slug);
  const ratingBreakdown = courseRating?.rating_breakdown;
  const ratingBreakdownItems = useMemo(
    () =>
      ratingBreakdown
        ? [
            { rating: 5, count: ratingBreakdown.five_star_count ?? 0 },
            { rating: 4, count: ratingBreakdown.four_star_count ?? 0 },
            { rating: 3, count: ratingBreakdown.three_star_count ?? 0 },
            { rating: 2, count: ratingBreakdown.two_star_count ?? 0 },
            { rating: 1, count: ratingBreakdown.one_star_count ?? 0 },
          ]
        : [],
    [ratingBreakdown],
  );
  const ratingBreakdownTotal =
    courseRating?.total_reviews ??
    ratingBreakdownItems.reduce((sum, item) => sum + item.count, 0);
  const hasRatingBreakdown = ratingBreakdownItems.some(
    (item) => item.count > 0,
  );
  const activeReviewRating =
    reviewsMeta && "rating" in reviewsMeta
      ? (reviewsMeta.rating ?? null)
      : (reviewRatingFilter ?? null);
  const reviewRatingOptions = useMemo(
    () => [
      {
        value: "",
        label:
          t("courses.reviews.ratingFilterAll") || t("commons.all") || "All",
      },
      ...[5, 4, 3, 2, 1].map((rating) => ({
        value: String(rating),
        label: t("courses.reviews.starFilterOption", {
          count: rating,
          defaultValue: `${rating} stars`,
        }),
      })),
    ],
    [],
  );

  const type: "video" | "pdf" | "attachment" = useMemo(() => {
    const ext = lesson?.video?.extension;
    if (ext === "pdf") return "pdf";
    return isVideoExt(ext) ? "video" : "attachment";
  }, [lesson?.video?.extension]);

  // Video/pdf block
  const renderPlayer = () => (
    <div className="relative">
      {type === "video" ? (
        <CustomVideoPlayer
          className="mb-4 aspect-video"
          poster={thumbUrl(lesson?.thumbnail)}
          src={lesson?.video?.url || ""}
        />
      ) : (
        <div className="relative mb-6 flex min-h-[280px] items-center justify-center overflow-hidden rounded-lg bg-gray-100 p-8">
          <div className="text-center">
            <PiFilePdf className="mx-auto h-16 w-16 text-gray-500" />
            <h3 className="mt-2 text-lg font-medium text-gray-600">
              {lesson?.title}
            </h3>
            {lesson?.video?.url && (
              <Button
                variant="flat"
                className="mt-4 hover:text-white"
                onClick={() => window.open(lesson?.video?.url!, "_blank")}
              >
                {t("courses.card-open-course") || "Open"}
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );

  // Top row
  const renderTopControls = () => (
    <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 px-1 pb-2">
      <LessonNavTabs
        activeTab={activeTab}
        onTabChange={onTabChange}
        tabs={visibleTabs}
        counts={{
          files: filesCount,
          students: studentsProgressMeta?.total ?? studentsProgress.length,
          reviews: reviewsCount,
        }}
      />
      <div className="flex items-center gap-4">
        <Button
          size="sm"
          className={cn(
            "inline-flex items-center gap-2",
            canGoNext
              ? "bg-mainBlue text-white hover:bg-mainBlue/90 dark:bg-gray-800 dark:text-gray-0 dark:hover:bg-gray-700"
              : "bg-gray-200 text-gray-500",
          )}
          disabled={!canGoNext}
          onClick={onGoNext}
        >
          {t("commons.next") || "Next"}
          <PiArrowRightBold className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  if (isLoading || !lesson) {
    return (
      <div className="min-h-0 flex-1 animate-pulse overflow-y-auto">
        <div className="mb-4 aspect-video rounded-lg bg-gray-100" />
        {renderTopControls()}
        <div className="mt-4 h-6 w-40 rounded bg-gray-100" />
        <div className="mt-2 h-4 w-3/4 rounded bg-gray-100" />
        <div className="mt-2 h-4 w-2/3 rounded bg-gray-100" />
      </div>
    );
  }

  // Normal render
  return (
    <div className="min-h-0 flex-1 overflow-y-auto">
      {renderPlayer()}
      {renderTopControls()}

      <div className="space-y-4 py-4">
        {/* OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {Array.isArray(lesson.content) ? (
              <LessonOverview content={lesson.content as any} />
            ) : lesson.content ? (
              <div className="prose max-w-none whitespace-pre-wrap text-gray-700">
                {lesson.content as string}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-xl bg-gray-50 py-12 text-center shadow-sm">
                <p className="text-gray-500">
                  {t("courses.lesson-no-overview") || "No overview available"}
                </p>
              </div>
            )}
          </div>
        )}

        {/* FILES */}
        {activeTab === "files" && (
          <div className="space-y-3">
            {filesCount === 0 && notFoundComponent}
            {attachments.map((f: any, idx: number) => (
              <AttachmentCard key={`${f.public_id}-${idx}`} attachment={f} />
            ))}
          </div>
        )}

        {/* Students */}
        {activeTab === "students" && (
          <StudentProgressTab
            data={studentsProgress}
            total={studentsProgressMeta?.total}
            meta={studentsProgressMeta as _Meta}
            page={studentsProgressMeta?.page}
            perPage={studentsProgressMeta?.per_page}
            totalPages={studentsProgressMeta?.total_pages}
            query={studentSearchQuery}
            statusFilter={studentStatusFilter}
            onPageChange={onStudentsPageChange}
            onQueryChange={onStudentSearchChange}
            onStatusFilterChange={onStudentStatusChange}
          />
        )}

        {/* REVIEWS */}
        {activeTab === "reviews" && (
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              {(courseRating?.average_rating != null || reviewsCount > 0) &&
                !hasRatingBreakdown && (
                  <div className="flex flex-wrap items-center gap-3 rounded-lg border border-gray-200 bg-white p-3 shadow-sm">
                    <div className="text-xl font-semibold text-gray-900">
                      {Number(courseRating?.average_rating ?? 0).toFixed(1)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {reviewsCount} {t("courses.reviews.total") || "reviews"}
                    </div>
                  </div>
                )}

              {!hasRatingBreakdown &&
                showReviewRatingFilter &&
                onReviewRatingChange && (
                  <Select
                    options={reviewRatingOptions}
                    value={
                      activeReviewRating == null
                        ? ""
                        : String(activeReviewRating)
                    }
                    onChange={(val) => {
                      const next =
                        typeof val === "object" &&
                        val !== null &&
                        "value" in val
                          ? (val as { value?: string }).value
                          : val;
                      onReviewRatingChange(next ? Number(next) : null);
                    }}
                    displayValue={(val: any) => {
                      const current = reviewRatingOptions.find(
                        (option) =>
                          option.value === String(val?.value ?? val ?? ""),
                      );
                      return current?.label ?? t("commons.all") ?? "All";
                    }}
                    className="w-full max-w-[170px]"
                    selectClassName="h-9 text-sm"
                    prefix={<PiStarFill className="h-4 w-4 text-amber-500" />}
                  />
                )}
            </div>

            {hasRatingBreakdown && (
              <div className="rounded-xl bg-gray-50 p-3 sm:p-4">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
                      <PiStarFill className="h-7 w-7 text-mainBlue" />
                    </div>
                    <div>
                      <div className="text-2xl font-semibold leading-none text-mainBlue">
                        {Number(courseRating?.average_rating ?? 0).toFixed(2)}
                      </div>
                      <div className="mt-1 text-xs text-gray-500">
                        {t("courses.reviews.averageRating") || "Average rating"}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {showReviewRatingFilter && onReviewRatingChange && (
                      <Select
                        options={reviewRatingOptions}
                        value={
                          activeReviewRating == null
                            ? ""
                            : String(activeReviewRating)
                        }
                        onChange={(val) => {
                          const next =
                            typeof val === "object" &&
                            val !== null &&
                            "value" in val
                              ? (val as { value?: string }).value
                              : val;
                          onReviewRatingChange(next ? Number(next) : null);
                        }}
                        displayValue={(val: any) => {
                          const current = reviewRatingOptions.find(
                            (option) =>
                              option.value === String(val?.value ?? val ?? ""),
                          );
                          return current?.label ?? t("commons.all") ?? "All";
                        }}
                        className="w-[160px]"
                        selectClassName="h-9 text-sm bg-white"
                        prefix={
                          <PiStarFill className="h-4 w-4 text-amber-500" />
                        }
                      />
                    )}

                    <div className="rounded-xl bg-mainBlue px-4 py-2.5 text-white shadow-sm">
                      <div className="text-lg font-semibold leading-none">
                        {Number(ratingBreakdownTotal || 0).toLocaleString()}
                      </div>
                      <div className="mt-0.5 text-xs text-white/80">
                        {t("courses.reviews.total") || "reviews"}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                  <div className="mb-4 text-base font-semibold text-mainBlue">
                    {t("courses.reviews.ratingBreakdown") || "Rating breakdown"}
                  </div>

                  <div className="space-y-3">
                    {ratingBreakdownItems.map((item) => {
                      const percent = ratingBreakdownTotal
                        ? Math.round((item.count / ratingBreakdownTotal) * 100)
                        : 0;

                      return (
                        <div
                          key={item.rating}
                          className="grid grid-cols-[44px_minmax(0,1fr)_82px] items-center gap-3"
                        >
                          <div className="flex items-center gap-1 text-base font-semibold text-mainBlue">
                            <span>{item.rating}</span>
                            <PiStarFill className="h-4 w-4" />
                          </div>
                          <div className="h-2.5 overflow-hidden rounded-full bg-gray-200">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-mainBlue to-[#28c7a2]"
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                          <div className="text-right text-xs font-medium text-gray-500">
                            {Number(item.count).toLocaleString()} ({percent}%)
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {reviewsCount === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-xl bg-gray-50 py-12 text-center shadow-sm">
                <p className="text-gray-500">
                  {t("courses.reviews.empty") || "No reviews yet."}
                </p>
              </div>
            ) : (
              <>
                {reviews.map((review: any, idx: number) => (
                  <ReviewCard
                    key={String(review?.id ?? `${lesson?.id}-review-${idx}`)}
                    review={review}
                  />
                ))}

                {reviewsMeta &&
                  reviewsMeta.total_pages > 1 &&
                  onReviewsPageChange && (
                    <Pagination
                      total={reviewsMeta.total}
                      pageSize={reviewsMeta.per_page}
                      current={reviewsMeta.page}
                      onChange={onReviewsPageChange}
                      className="justify-center pt-2"
                    />
                  )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
