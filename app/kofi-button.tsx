export default function KofiButton({ className }: { className?: string }) {
  return (
    <a className={className} href="https://ko-fi.com/M3O325HG20" target="_blank" rel="noreferrer">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        height={36}
        style={{ border: 0, height: 36 }}
        src="https://storage.ko-fi.com/cdn/kofi6.png?v=6"
        alt="Buy Me a Coffee at ko-fi.com"
      />
    </a>
  );
}
