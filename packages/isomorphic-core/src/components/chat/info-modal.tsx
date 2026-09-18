import { Creater } from '@core/types'
import React from 'react'
import { PiAtBold, PiBellSimpleRingingBold, PiDotsThreeVerticalBold, PiFileBold, PiImage, PiImageBold, PiImages, PiImagesBold, PiLinkBold, PiMicrophoneBold, PiPhoneBold, PiUserBold, PiVideoBold, PiXBold } from 'react-icons/pi'
import { Avatar } from 'rizzui/avatar'
import { IoSend } from "react-icons/io5";
import { Button } from 'rizzui/button'
import { useModal } from '@core/modal-views';
import InfoRow from '../info-row';
import { formatUzbekPhone } from '@core/utils/phone-uzbek-format';
import { t } from 'i18next';
interface InfoModalProps {
  user: Creater & { chat_id?: number } | null,
  onSendMessage?: (user: Creater & { chat_id?: number }) => void
}
const InfoModal = ({
  user,
  onSendMessage
}: InfoModalProps) => {
  const { closeModal, isOpen } = useModal()
  if (onSendMessage) isOpen == false


  return (
    <div>
      { user && (
        <div
          className="w-full max-w-[520px] rounded-2xl bg-white shadow-xl "
          onClick={ (e) => e.stopPropagation() }
        >
          <div className="sticky top-0 flex items-center justify-between rounded-t-2xl px-4 py-3">
            <h3 className="text-base font-semibold text-gray-800">{ t('chat.userInfo') ?? 'User Info' }</h3>
            <div className="flex items-center gap-1">
              <button
                type="button"
                className="grid size-8 place-items-center rounded-full text-gray-500 hover:bg-gray-100"
                aria-label={ t('chat.more-aria') ?? 'More' }
              >
                <PiDotsThreeVerticalBold className="h-5 w-5" />
              </button>
              <button
                type="button"
                className="grid size-8 place-items-center rounded-full text-gray-500 hover:bg-gray-100"
                onClick={ () => {
                  // onClose(null);
                  closeModal()
                } }
                aria-label={ t('commons.close') ?? 'Close' }
              >
                <PiXBold className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="px-5 pb-2">
            <div className="flex items-center gap-3">
              <Avatar
                src={ user.avatar?.url ?? "" }
                name={ `${user.first_name ?? ""} ${user.last_name ?? ""}` }
                customSize={ 56 }
                className="rounded-full"
              />
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="truncate text-[15px] font-semibold text-gray-900">
                    { user.first_name } { user.last_name }
                  </p>
                  { user.online && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                      <span className="size-2 rounded-full bg-emerald-600" />
                      { t('chat.online') ?? 'online' }
                    </span>
                  ) }
                </div>
                <p className="text-xs text-gray-500">
                  { user.online ? (t('chat.lastSeenJustNow') ?? 'last seen just now') : formatLastSeen(user.last_seen_at) }
                </p>
              </div>
            </div>
          </div>
          <hr className="border-gray-100" />
          <div className="space-y-3 px-5 py-4">
            { user.phone_number && (
              <InfoRow
                icon={ <PiPhoneBold className="h-5 w-5" /> }
                label={ t('chat.mobile') ?? 'Mobile' }
                value={ formatUzbekPhone(user.phone_number) }
              // copyValue={ user.phone_number }
              />
            ) }
            { user.username && (
              <InfoRow
                icon={ <PiAtBold className="h-5 w-5" /> }
                label={ t('chat.username') ?? 'Username' }
                value={ `@${user.username}` }
              // copyValue={ user.username }
              />
            ) }
            { user.email && (
              <InfoRow
                icon={ <PiUserBold className="h-5 w-5" /> }
                label={ t('chat.email') ?? 'Email' }
                value={ user.email }
              // copyValue={ user.email }
              />
            ) }
          </div>
          { onSendMessage &&
            <>
              <hr className="border-gray-100" />
              <div className="px-5 py-3">
                <Button
                  className="w-full flex items-center gap-2"
                  onClick={ () => onSendMessage?.(user) }
                  variant="outline"
                >
                  { t('chat.sendMessage') ?? 'Send message' }
                  <IoSend className='h-5 w-5 ' />
                </Button>
              </div>
            </>
          }

          {/* { (user.stats?.photos || user.stats?.videos || user.stats?.files && ( */ }
          <>
            <hr className="border-gray-100" />
            <div className="px-3 py-2">
              <div className="space-y-0">
                <StatRow icon={ <PiImageBold className="h-5 w-5 " /> } label={ t('chat.photos') ?? 'photos' } value={ user.stats?.photos ?? 0 } />
                <StatRow icon={ <PiVideoBold className="h-5 w-5" /> } label={ t('chat.video') ?? 'video' } value={ user.stats?.videos ?? 0 } />
                <StatRow icon={ <PiFileBold className="h-5 w-5" /> } label={ t('chat.files') ?? 'files' } value={ user.stats?.files ?? 0 } />
              </div>
            </div>
          </>
          {/* )) } */ }
        </div>
      ) }
    </div>
  )
}
function StatRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="flex items-center justify-between rounded-lg px-2 py-1.5 hover:bg-gray-50">
      <div className="flex items-center gap-4">
        <div className="grid size-8 place-items-center rounded-md bg-gray-100 text-gray-700">
          { icon }
        </div>
        <div className='flex items-center gap-2'>
          <span className="text-sm font-medium text-gray-900">{ value }</span>
          <span className="text-sm text-gray-700">{ label }</span>
        </div>
      </div>
    </div>
  );
}
function formatLastSeen(dateStr: string | null) {
  if (!dateStr) return t('chat.lastSeenRecently') ?? 'last seen recently';
  const dt = new Date(dateStr.replace(" ", "T")); // "YYYY-MM-DD HH:mm:ss"
  const diff = Date.now() - dt.getTime();
  const m = Math.round(diff / 60000);
  if (m < 5) return t('chat.lastSeenRecently') ?? 'last seen recently';
  if (m < 60) return t('chat.lastSeenMinutes', { count: m }) ?? `last seen ${m} minutes ago`;
  const h = Math.round(m / 60);
  if (h < 24) return t('chat.lastSeenHours', { count: h }) ?? `last seen ${h} hours ago`;
  const d = Math.round(h / 24);
  return t('chat.lastSeenDays', { count: d }) ?? `last seen ${d} days ago`;
}

export default InfoModal
