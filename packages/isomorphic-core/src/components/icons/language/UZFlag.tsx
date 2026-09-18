export default function ESFlagIcon({ ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      id="flag-icon-css-uz"
      viewBox="0 0 640 480"
      {...props}
    >
      {/* Light blue top stripe */}
      <path fill="#1eb5ea" d="M0 0h640v160H0z" />
      {/* Red stripe below light blue */}
      <path fill="#ed2939" d="M0 160h640v16H0z" />
      {/* White middle stripe */}
      <path fill="#fff" d="M0 176h640v128H0z" />
      {/* Red stripe below white */}
      <path fill="#ed2939" d="M0 304h640v16H0z" />
      {/* Green bottom stripe */}
      <path fill="#3e9b45" d="M0 320h640v160H0z" />

      {/* Crescent moon */}
      <circle cx="134" cy="88" r="36" fill="#fff" />
      <circle cx="152" cy="88" r="32" fill="#1eb5ea" />

      {/* 12 Stars */}
      {/* Row 1: 3 stars */}
      <path
        fill="#fff"
        d="m112 32.5 3.8 11.7h12.3l-9.9 7.2 3.8 11.7-9.9-7.2-9.9 7.2 3.8-11.7-9.9-7.2h12.3zm40 0 3.8 11.7h12.3l-9.9 7.2 3.8 11.7-9.9-7.2-9.9 7.2 3.8-11.7-9.9-7.2h12.3zm40 0 3.8 11.7h12.3l-9.9 7.2 3.8 11.7-9.9-7.2-9.9 7.2 3.8-11.7-9.9-7.2h12.3z"
      />

      {/* Row 2: 4 stars */}
      <path
        fill="#fff"
        d="m92 88.5 3.8 11.7h12.3l-9.9 7.2 3.8 11.7-9.9-7.2-9.9 7.2 3.8-11.7-9.9-7.2h12.3zm40 0 3.8 11.7h12.3l-9.9 7.2 3.8 11.7-9.9-7.2-9.9 7.2 3.8-11.7-9.9-7.2h12.3zm40 0 3.8 11.7h12.3l-9.9 7.2 3.8 11.7-9.9-7.2-9.9 7.2 3.8-11.7-9.9-7.2h12.3zm40 0 3.8 11.7h12.3l-9.9 7.2 3.8 11.7-9.9-7.2-9.9 7.2 3.8-11.7-9.9-7.2h12.3z"
      />

      {/* Row 3: 5 stars */}
      <path
        fill="#fff"
        d="m72 144.5 3.8 11.7h12.3l-9.9 7.2 3.8 11.7-9.9-7.2-9.9 7.2 3.8-11.7-9.9-7.2h12.3zm40 0 3.8 11.7h12.3l-9.9 7.2 3.8 11.7-9.9-7.2-9.9 7.2 3.8-11.7-9.9-7.2h12.3zm40 0 3.8 11.7h12.3l-9.9 7.2 3.8 11.7-9.9-7.2-9.9 7.2 3.8-11.7-9.9-7.2h12.3zm40 0 3.8 11.7h12.3l-9.9 7.2 3.8 11.7-9.9-7.2-9.9 7.2 3.8-11.7-9.9-7.2h12.3zm40 0 3.8 11.7h12.3l-9.9 7.2 3.8 11.7-9.9-7.2-9.9 7.2 3.8-11.7-9.9-7.2h12.3z"
      />
    </svg>
  );
}
