export default function EcommerceLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="relative min-h-screen bg-repeat pt-16 pb-24 w-full bg-paternSm md:bg-paternMd"
      style={{ backgroundImage: "url(/paterngoma.png)" }}
    >
      {children}
    </div>
  );
}
