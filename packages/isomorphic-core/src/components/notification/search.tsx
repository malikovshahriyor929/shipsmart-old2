'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Input } from 'rizzui/input';
import { PiMagnifyingGlassBold } from 'react-icons/pi';
import { useRouter, useSearchParams } from 'next/navigation';
import { t } from 'i18next';

// Reusable SearchBar with debounce and URL sync
export default function SearchBar({
  param = 'search',
  placeholder = t("commons.search"),
  delay = 400,
}: {
  param?: string;
  placeholder?: string;
  delay?: number;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialValue = searchParams.get(param) || '';
  const [query, setQuery] = useState(initialValue);
  const checkRef = useRef(searchParams.has("id"));

  // Debounce logic
  useEffect(() => {
    const handler = setTimeout(() => {
      const params = new URLSearchParams(Array.from(searchParams.entries()));

      if (query.trim()) {
        params.set(param, query);
        checkRef.current = false
      } else {
        if (!checkRef.current) {
          params.delete(param);
        }
      }
      router.replace(`?${params.toString()}`, { scroll: false });
    }, delay);

    return () => clearTimeout(handler);
  }, [query, delay, param, router, searchParams, checkRef]);

  useEffect(() => {
    // if (check) {
    setQuery(initialValue);
    // }
  }, [checkRef, initialValue]);
  return (
    <div>
      <Input
        type="search"
        placeholder={ placeholder }
        value={ query }
        onChange={ (e) => setQuery(e.target.value) }
        className="h-10"
        inputClassName="h-110"
        prefix={ <PiMagnifyingGlassBold className="h-5 w-5 text-gray-500" /> }
        clearable
        onClear={ () => {
          setQuery('')
          if (checkRef.current) {
            router.replace(`?`, { scroll: false });
            checkRef.current = false
          }
        } }
      />
    </div>
  );
}
