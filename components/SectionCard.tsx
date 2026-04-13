type SectionCardProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
};

export default function SectionCard({
  title,
  subtitle,
  children,
}: SectionCardProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md md:p-6">
      <div className="mb-5 flex flex-col gap-1 border-b border-slate-100 pb-4">
        <h2 className="text-lg font-semibold tracking-tight text-slate-900 md:text-xl">
          {title}
        </h2>
        {subtitle ? (
          <p className="text-sm leading-6 text-slate-500">{subtitle}</p>
        ) : null}
      </div>
      {children}
    </section>
  );
}