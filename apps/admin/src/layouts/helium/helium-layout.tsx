import Header from '@/layouts/helium/helium-header';
import Sidebar from '@/layouts/helium/helium-sidebar';

export default function HeliumLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main
      className="flex min-h-screen min-w-0 flex-grow bg-[#f2f2f2] text-[#111214]"
      style={{ fontFamily: 'var(--font-montserrat), sans-serif' }}
    >
      <Sidebar className="fixed hidden dark:bg-gray-50 xl:block" />
      <div className="flex w-full min-w-0 flex-col xl:ms-[252px] xl:w-[calc(100%-252px)] 2xl:ms-[264px] 2xl:w-[calc(100%-264px)]">
        <Header />
        <div className="flex min-w-0 flex-grow flex-col px-3 pb-4 pt-2 sm:px-4 lg:px-5 xl:px-3 2xl:px-4">
          {children}
        </div>
      </div>
    </main>
  );
}
