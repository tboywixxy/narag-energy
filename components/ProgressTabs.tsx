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
    <div className="w-full rounded-xl border border-slate-200 bg-white p-1 lg:p-2 shadow-sm overflow-hidden">
      <div className="flex flex-row flex-wrap lg:flex-col gap-1">
        {sections.map((section, index) => {
          const isActive = activeSection === section;

          return (
            <button
              key={section}
              type="button"
              onClick={() => onClick(section)}
              className={`flex flex-1 min-w-[30%] lg:min-w-0 shrink-0 items-center justify-center lg:justify-start rounded-md lg:rounded-lg px-1.5 py-1.5 lg:px-3 lg:py-2 text-center lg:text-left text-[10px] leading-tight lg:text-[11px] font-medium transition ${
                isActive
                  ? "bg-orange-500 text-white shadow-sm"
                  : "bg-slate-50 text-slate-700 hover:bg-slate-100"
              }`}
            >
              <span
                className={`hidden lg:inline-flex mr-2 h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] ${
                  isActive ? "bg-white/20 text-white" : "bg-slate-200 text-slate-700"
                }`}
              >
                {index + 1}
              </span>
              <span>{section}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}