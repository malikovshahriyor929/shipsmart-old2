export default function SAFlagIcon({ ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      id="flag-icon-css-ru"
      viewBox="0 0 640 480"
      {...props}
    >
      {/* White top stripe */}
      <path fill="#fff" d="M0 0h640v160H0z" />

      {/* Blue middle stripe */}
      <path fill="#0039a6" d="M0 160h640v160H0z" />

      {/* Red bottom stripe */}
      <path fill="#d52b1e" d="M0 320h640v160H0z" />
    </svg>
  );
}
