const paths = {
  shield: "M12 3l7 3v5c0 4.5-3 7.8-7 9-4-1.2-7-4.5-7-9V6l7-3z",
  lock: "M6 10V8a6 6 0 1112 0v2M5 10h14a1 1 0 011 1v9a1 1 0 01-1 1H5a1 1 0 01-1-1v-9a1 1 0 011-1z",
  signature: "M3 17c3 0 3-8 6-8s2 6 4 6 2-3 4-3M3 21h18",
  key: "M15 7a4 4 0 11-3.9 5H8v2H6v2H3v-3l5.1-5.1A4 4 0 0115 7z",
  check: "M5 13l4 4L19 7",
  alert: "M12 9v4m0 4h.01M10.3 4.3l-7.4 12.8A1.5 1.5 0 004.2 19h15.6a1.5 1.5 0 001.3-2.3L13.7 4.3a1.5 1.5 0 00-2.6 0z",
  message: "M4 5h16a1 1 0 011 1v10a1 1 0 01-1 1H8l-4 4V6a1 1 0 011-1z",
  send: "M4 12l16-8-6 16-3-6-7-2z",
  database:
    "M4 6c0-1.7 3.6-3 8-3s8 1.3 8 3-3.6 3-8 3-8-1.3-8-3zm0 0v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3",
  user: "M12 12a4 4 0 100-8 4 4 0 000 8zm-7 8a7 7 0 0114 0",
  api: "M8 9l-3 3 3 3m8-6l3 3-3 3M14 5l-4 14",
  arrowRight: "M5 12h14m-6-6l6 6-6 6",
  logout: "M16 17l5-5-5-5m5 5H9M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4",
  eye: "M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z",
  spark: "M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z",
};

export default function Icon({ name, className = "h-5 w-5", strokeWidth = 1.8 }) {
  const d = paths[name];
  if (!d) return null;
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={d} />
    </svg>
  );
}
