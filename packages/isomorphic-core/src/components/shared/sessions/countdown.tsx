'use client';

import React, { useState, useEffect } from 'react';
import { Text, Badge, Button } from 'rizzui';
import { PiClock, PiClockBold, PiLinkSimpleBold } from 'react-icons/pi';
import { t } from 'i18next';

interface CountdownProps {
  target: Date; // when the session starts
  onTimeUp?: () => void;
  openJoin: (meetingId: string) => Promise<void>;
  original: any;
}

export default function Countdown({ target, onTimeUp, openJoin, original }: CountdownProps) {
  const [timeRemaining, setTimeRemaining] = useState(() =>
    diff(new Date(), target)
  );

  useEffect(() => {
    const tick = () => setTimeRemaining(diff(new Date(), target));
    const id = setInterval(() => {
      const tr = diff(new Date(), target);
      setTimeRemaining(tr);
      if (tr.total <= 0) {
        clearInterval(id);
        onTimeUp?.();
      }
    }, 1000);
    tick();
    return () => clearInterval(id);
  }, [target, onTimeUp]);

  if (timeRemaining.total <= 0) {
    return (
      // <Badge className="border-green-200 bg-green-50 text-green-600">
      //   Starting now
      // </Badge>
      <Button
        size="sm"
        className="bg-mainBlue/10 text-nowrap border-primary/40 text-primary hover:bg-mainBlue/20 py-4"
        onClick={ (e) => {
          e.stopPropagation();
          void openJoin(original.meetingId);
        } }
      >
        <PiLinkSimpleBold className="mr-1.5 h-4 w-4" />
        {t('session.join-now')}
      </Button>
    );
  }

  // "Starting soon" if < 10m
  if (
    timeRemaining.days === 0 &&
    timeRemaining.hours === 0 &&
    timeRemaining.minutes < 10
  ) {
    return (
      <Badge className="border-amber-200 bg-amber-50 text-amber-600">
        {t('session.starts-in')} { timeRemaining.minutes }m { timeRemaining.seconds }s
      </Badge>
    );
  }

  return (
    <Button variant='outline' size='sm' className="flex w-fit items-center gap-2 rounded-lg border border-mainBlue  text-mainBlue">
      <PiClockBold className="h-3 w-3" />
      <Text className="text-xs">
        { timeRemaining.days > 0 ? `${timeRemaining.days}d ` : '' }
        { timeRemaining.hours > 0 ? `${timeRemaining.hours}h ` : '' }
        { `${timeRemaining.minutes}m` }
      </Text>
    </Button>
  );
}

function diff(now: Date, target: Date) {
  const total = target.getTime() - now.getTime();
  const clamp = (n: number) => Math.max(0, n);
  const days = clamp(Math.floor(total / (1000 * 60 * 60 * 24)));
  const hours = clamp(
    Math.floor((total % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  );
  const minutes = clamp(Math.floor((total % (1000 * 60 * 60)) / (1000 * 60)));
  const seconds = clamp(Math.floor((total % (1000 * 60)) / 1000));
  return { days, hours, minutes, seconds, total };
}
