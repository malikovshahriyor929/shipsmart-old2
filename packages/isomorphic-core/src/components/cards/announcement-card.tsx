"use client";

import { Title, Text, Badge, Button, Avatar } from "rizzui";
import { PiImageBold } from "react-icons/pi";
import cn from "@core/utils/class-names";
import { fullName } from "@core/utils/course-utils";

export type AnnouncementStatus = {
  value: number;
  label: string;
};

export type Attachment = {
  public_id: string;
  file_name: string;
  extension: string;
  file_size: number;
  url: string;
  created_at: string;
};

export type UserLite = {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  avatar: Attachment | null;
};

export type AnnouncementApiItem = {
  id: number;
  title: string;
  body: string;
  status: AnnouncementStatus;
  photo: Attachment | null;
  author: UserLite;
  approver: UserLite | null;
  approved_at: string | null;
  created_at: string;
  updated_at: string;
};

function toDateSafe(value?: string | null) {
  if (!value) return null;
  const isoLike = value.includes("T") ? value : value.replace(" ", "T");
  const d = new Date(isoLike);
  return Number.isNaN(d.getTime()) ? null : d;
}

function formatDateTime(value?: string | null) {
  const d = toDateSafe(value);
  if (!d) return "";
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

export default function AnnouncementCard({
  announcement,
  handlers,
  className,
}: {
  announcement: AnnouncementApiItem;
  handlers?: {
    onView?: (id: number) => void;
  };
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex h-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow",
        className
      )}
    >
      {/* Photo */}
      <div className="relative h-44 w-full overflow-hidden bg-gray-50">
        {announcement.photo?.url ? (
          <img
            src={announcement.photo.url}
            alt={announcement.title}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gray-300">
            <PiImageBold className="h-10 w-10" />
          </div>
        )}

        <div className="absolute left-3 top-3">
          <Badge className="border border-green-200 bg-green-100 font-medium text-green-700">
            {announcement.status?.label ?? "Approved"}
          </Badge>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <Title as="h3" className="mb-1.5 line-clamp-2 text-lg font-semibold">
          {announcement.title}
        </Title>

        <Text className="mb-3 line-clamp-3 text-sm text-gray-600">
          {announcement.body}
        </Text>

        <div className="mt-auto flex items-center justify-between gap-3 pt-2">
          <div className="flex min-w-0 items-center gap-2">
            <Avatar
              size="sm"
              name={fullName(announcement.author)}
              src={announcement.author?.avatar?.url ?? undefined}
              customSize={32}
              className="shrink-0"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-1 text-xs font-semibold text-gray-600">
                {/* <PiUserBold className="h-3.5 w-3.5" /> */}
                <span className="truncate">
                  {fullName(announcement.author)}
                </span>
              </div>
              <div className="mt-0.5 flex items-center gap-1 text-xs text-gray-500">
                {/* <PiClockBold className="h-3.5 w-3.5" /> */}
                <span className="truncate">
                  {formatDateTime(announcement.approved_at)}
                </span>
              </div>
            </div>
          </div>

          <Button
            size="sm"
            variant="solid"
            color="primary"
            className={cn("shrink-0")}
            onClick={() => handlers?.onView?.(announcement.id)}
          >
            View
          </Button>
        </div>
      </div>
    </div>
  );
}
