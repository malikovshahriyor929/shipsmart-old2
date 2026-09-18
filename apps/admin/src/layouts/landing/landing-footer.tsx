import { Link } from '@core/i18n/routing';
import { LandingBrandMark } from './landing-brand-mark';

const footerColumns = [
  {
    title: 'Shippers',
    items: [
      {
        label: 'Managed Transportation',
        href: '/shippers/managed-transportation',
      },
      { label: 'Dedicated Capacity', href: '/shippers/dedicated-capacity' },
      { label: 'Freight Brokerage', href: '/shippers/freight-brokerage' },
    ],
  },
  {
    title: 'Carriers',
    items: [
      { label: 'Become a Carrier', href: '/carriers/become-a-carrier' },
      { label: 'Carrier Resources', href: '/carriers/carrier-benefits' },
      { label: 'Carrier Portal', href: '/auth/sign-in' },
    ],
  },
  {
    title: 'Solutions',
    items: [
      { label: 'Warehousing', href: '/shippers/warehousing' },
      { label: 'Expedited Freight', href: '/solutions/expedited-freight' },
      { label: 'Specialized Logistics', href: '/services/heavy-haul' },
    ],
  },
  {
    title: 'Company',
    items: [
      { label: 'About Us', href: '/company/about' },
      { label: 'Why Choose Us', href: '/company/why-choose-us' },
      { label: 'Contact Us', href: '/contact/contact-us' },
    ],
  },
];

export function LandingFooter() {
  return (
    <footer className="bg-[#0e0f10] px-5 text-white sm:px-8 lg:h-[528px] lg:px-12">
      <div className="mx-auto flex h-full max-w-[1440px] flex-col border-t border-white/10 pt-11">
        <div className="grid gap-12 lg:grid-cols-[410px_1fr] lg:gap-[104px]">
          <div data-ss-motion="left">
            <LandingBrandMark inverse />
            <p className="mt-6 max-w-[385px] text-[13px] leading-6 text-white/45">
              Reliable freight solutions built around speed, visibility, and
              dependable capacity. We help businesses move freight efficiently
              across the United States and beyond.
            </p>
            <div className="mt-7 flex flex-wrap gap-2">
              {['LinkedIn', 'Facebook', 'Instagram', 'YouTube'].map(
                (social) => (
                  <a
                    key={social}
                    href="#top"
                    className="rounded-full border border-white/10 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.06em] text-white/55 transition-colors hover:border-white/30 hover:text-white"
                  >
                    {social}
                  </a>
                )
              )}
            </div>
          </div>

          <div className="grid gap-9 sm:grid-cols-2 lg:grid-cols-4">
            {footerColumns.map((column, index) => (
              <div
                key={column.title}
                data-ss-motion
                style={{ transitionDelay: `${index * 70}ms` }}
              >
                <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-white/35">
                  {column.title}
                </p>
                <div className="mt-5 grid gap-3.5">
                  {column.items.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="text-[13px] text-white/65 transition hover:text-white"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 grid gap-8 border-t border-white/10 py-7 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ['Call us', '(331) 215-4701'],
            ['Email us', 'operation@ship-solutions.net'],
            ['Visit us', 'Naperville, Illinois'],
            ['Office hours', 'MO – SA / 9am – 5pm'],
          ].map(([label, value], index) => (
            <div
              key={label}
              data-ss-motion
              style={{ transitionDelay: `${index * 60}ms` }}
            >
              <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-white/30">
                {label}
              </p>
              <p className="mt-2 text-[13px] text-white/65">{value}</p>
            </div>
          ))}
        </div>

        <div
          data-ss-motion
          className="mt-auto flex flex-col gap-3 border-t border-white/10 py-5 text-[10px] text-white/30 sm:flex-row sm:items-center sm:justify-between"
        >
          <span>© 2026 ShipSmart Solutions. All rights reserved.</span>
          <div className="flex gap-6">
            <span>Terms</span>
            <span>Privacy</span>
            <span>Cookies</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
