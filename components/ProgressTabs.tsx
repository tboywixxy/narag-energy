type ProgressTabsProps = {
  sections: string[];
  activeSection: string;
  onClick: (section: string) => void;
};

export default function ProgressTabs({
  sections,
  activeSection,
  onClick,
}: ProgressTabsProps) {
  return (
    <div className="sticky top-0 z-20 w-full rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
      <div className="flex flex-col gap-2">
        {sections.map((section, index) => {
          const isActive = activeSection === section;

          return (
            <button
              key={section}
              type="button"
              onClick={() => onClick(section)}
              className={`flex w-full items-center rounded-xl px-4 py-3 text-left text-sm font-medium transition ${
                isActive
                  ? "bg-orange-500 text-white shadow-sm"
                  : "bg-slate-50 text-slate-700 hover:bg-slate-100"
              }`}
            >
              <span
                className={`mr-3 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs ${
                  isActive ? "bg-white/20 text-white" : "bg-slate-200 text-slate-700"
                }`}
              >
                {index + 1}
              </span>
              {section}
            </button>
          );
        })}
      </div>
    </div>
  );
}