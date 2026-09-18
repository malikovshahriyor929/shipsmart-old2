'use client';

import { Link, usePathname } from '@core/i18n/routing';
import { Fragment } from 'react';
import { Title } from 'rizzui/typography';
import { Collapse } from 'rizzui/collapse';
import cn from '@core/utils/class-names';
import { PiCaretDownBold } from 'react-icons/pi';
import { useMenuItems } from './helium-menu-items';

type HeliumSidebarMenuProps = {
  name: string;
  href?: string | null;
  icon?: React.ReactNode;
  dropdownItems?: Array<{
    name: string;
    href: string;
  }>;
};

const normalizePath = (path?: string | null) => {
  if (!path) return '';
  const normalized = path.replace(/\/+$/, '');
  return normalized || '/';
};

const isPathMatch = (pathname: string, href?: string | null) => {
  if (!href || href === '#') return false;
  const current = normalizePath(pathname);
  const target = normalizePath(href);

  if (target === '/') return current === '/';
  return current === target || current.startsWith(`${target}/`);
};

export function HeliumSidebarMenu() {
  const menuItems = useMenuItems();
  const pathname = usePathname();
  const currentPath = normalizePath(pathname);

  return (
    <div className="pb-3">
      {menuItems.map((item: HeliumSidebarMenuProps, index) => {
        const isActive = isPathMatch(pathname, item?.href);
        const activeDropdownHref = (item?.dropdownItems ?? [])
          .filter((dropdownItem) => isPathMatch(pathname, dropdownItem.href))
          .map((dropdownItem) => normalizePath(dropdownItem.href))
          .sort((a, b) => b.length - a.length)[0];

        const dropdownItemsWithActive = (item?.dropdownItems ?? []).map(
          (dropdownItem) => {
            const childPath = normalizePath(dropdownItem.href);
            const isChildActive =
              activeDropdownHref === childPath ||
              (!activeDropdownHref && currentPath === childPath);

            return { dropdownItem, isChildActive };
          }
        );

        const isDropdownOpen = dropdownItemsWithActive.some(
          ({ isChildActive }) => isChildActive
        );

        return (
          <Fragment key={item.name + '-' + index}>
            {item?.href ? (
              <>
                {item?.dropdownItems ? (
                  <Collapse
                    defaultOpen={isDropdownOpen}
                    header={({ open, toggle }) => (
                      <div
                        onClick={toggle}
                        className={cn(
                          'group relative mx-1.5 my-1 flex cursor-pointer items-center justify-between rounded-xl px-2.5 py-2.5 text-sm font-medium',
                          isDropdownOpen
                            ? 'bg-[#03a1fe] font-bold text-white dark:bg-gray-200 dark:text-gray-700'
                            : 'text-white/65 transition-colors duration-200 hover:bg-white/10 hover:text-white dark:text-gray-500 dark:hover:bg-gray-200/60 dark:hover:text-gray-700'
                        )}
                      >
                        <span className="flex items-center">
                          {item?.icon && (
                            <span
                              className={cn(
                                'me-2.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors duration-200 [&>svg]:h-[19px] [&>svg]:w-[19px]',
                                isDropdownOpen
                                  ? 'bg-white/15 text-white dark:bg-gray-300 dark:text-gray-700'
                                  : 'bg-white/[0.04] text-white/60 group-hover:bg-white/10 group-hover:text-white dark:bg-gray-200/60 dark:text-gray-500 dark:group-hover:text-gray-600'
                              )}
                            >
                              {item?.icon}
                            </span>
                          )}
                          {item.name}
                        </span>

                        <PiCaretDownBold
                          strokeWidth={3}
                          className={cn(
                            'h-3.5 w-3.5 -rotate-90 text-white/60 transition-transform duration-200 group-hover:text-white dark:text-gray-400 rtl:rotate-90',
                            open &&
                              'rotate-0 group-hover:text-gray-700 rtl:rotate-0',
                            isDropdownOpen &&
                              'text-white group-hover:text-white dark:text-gray-700 rtl:rotate-0'
                          )}
                        />
                      </div>
                    )}
                  >
                    {dropdownItemsWithActive.map(
                      ({ dropdownItem, isChildActive }, childIndex) => {
                        return (
                          <Link
                            href={dropdownItem?.href}
                            key={dropdownItem?.name + childIndex}
                            className={cn(
                              'group mx-2 mb-0.5 flex items-center justify-between rounded-lg px-2.5 py-2 text-sm font-medium capitalize last-of-type:mb-2',
                              isChildActive
                                ? 'font-bold text-white dark:text-gray-700'
                                : 'text-gray-300/90 transition-colors duration-200 hover:bg-white hover:text-gray-700 dark:text-gray-500 dark:hover:bg-gray-200/50'
                            )}
                          >
                            <div className="flex items-center truncate">
                              <span
                                className={cn(
                                  'me-[18px] ms-1 inline-flex h-1 w-1 rounded-full bg-current transition-all duration-200',
                                  isChildActive
                                    ? 'bg-white ring-[1px] ring-white dark:bg-gray-700 dark:ring-gray-700'
                                    : 'opacity-50 group-hover:bg-gray-700'
                                )}
                              />{' '}
                              <span className="truncate">
                                {dropdownItem?.name}
                              </span>
                            </div>
                          </Link>
                        );
                      }
                    )}
                  </Collapse>
                ) : (
                  <Link
                    href={item?.href}
                    className={cn(
                      'group relative mx-1.5 my-1 flex items-center justify-between rounded-xl px-2.5 py-2.5 text-sm font-medium capitalize',
                      isActive
                        ? 'bg-[#03a1fe] font-semibold text-white shadow-[0_8px_22px_rgba(3,161,254,0.2)] dark:bg-gray-200 dark:text-gray-900'
                        : 'text-white/65 transition-colors duration-200 hover:bg-white/10 hover:text-white dark:text-gray-500 dark:hover:bg-gray-200/60 dark:hover:text-gray-700'
                    )}
                  >
                    <div className="flex items-center truncate">
                      {item?.icon && (
                        <span
                          className={cn(
                            'me-2.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors duration-200 [&>svg]:h-[19px] [&>svg]:w-[19px]',
                            isActive
                              ? 'bg-white/15 text-white dark:bg-gray-300 dark:text-gray-900'
                              : 'bg-white/[0.04] text-white/60 group-hover:bg-white/10 group-hover:text-white dark:bg-gray-200/60 dark:text-gray-500 dark:group-hover:text-gray-600'
                          )}
                        >
                          {item?.icon}
                        </span>
                      )}
                      <span className="truncate">{item.name}</span>
                    </div>
                  </Link>
                )}
              </>
            ) : (
              <Title
                as="h6"
                className={cn(
                  'mb-2 truncate px-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45 dark:text-gray-500',
                  index !== 0 && 'mt-5 3xl:mt-6'
                )}
              >
                {item.name}
              </Title>
            )}
          </Fragment>
        );
      })}
    </div>
  );
}
