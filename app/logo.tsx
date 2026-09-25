/** Fixed product brand colors are shared by the header and drawer in both themes. */
export default function Logo({ size = 24 }: { size?: number }) {
  return (
    <svg className="brand-mark" width={size} height={size} viewBox="0 0 34 34" aria-hidden="true" style={{ flex: "none" }}>
      <rect x="2" y="2" width="30" height="12" fill="#00625D" stroke="#2C2B29" strokeWidth="2.5" />
      <rect x="2" y="18" width="13" height="14" fill="#C4553F" stroke="#2C2B29" strokeWidth="2.5" />
      <rect x="19" y="18" width="13" height="14" fill="#F2A81D" stroke="#2C2B29" strokeWidth="2.5" />
    </svg>
  );
}
