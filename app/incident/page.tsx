"use client";

import { useState } from "react";
import SectionCard from "@/components/SectionCard";

type IncidentFormState = {
  type: string;
  damageCategories: string[];
  severityActual: string[];
  severityPotential: string[];
  humanLoss: string[];
  description: string;
};

const initialState: IncidentFormState = {
  type: "",
  damageCategories: [],
  severityActual: [],
  severityPotential: [],
  humanLoss: [],
  description: "",
};

function ChevronDownIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      className="h-4 w-4 text-orange-500"
    >
      <path
        d="M5 7.5L10 12.5L15 7.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  required?: boolean;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-medium text-slate-800">
        {label}
        {required && <span className="ml-1 text-orange-600">*</span>}
      </span>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          className="h-12 w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 pr-11 text-sm text-slate-900 shadow-sm transition focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
        >
          <option value="">Select option</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
          <ChevronDownIcon />
        </div>
      </div>
    </label>
  );
}

function CheckboxGroup({
  label,
  options,
  selected,
  onChange,
  required = false,
}: {
  label: string;
  options: string[];
  selected: string[];
  onChange: (values: string[]) => void;
  required?: boolean;
}) {
  const toggle = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter((item) => item !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  return (
    <div className="grid gap-3">
      <span className="text-sm font-medium text-slate-800">
        {label}
        {required && <span className="ml-1 text-orange-600">*</span>}
      </span>
      <div className="flex flex-wrap gap-3">
        {options.map((option) => (
          <label
            key={option}
            className={`flex cursor-pointer items-center gap-2 rounded-xl border px-4 py-2 transition-all ${
              selected.includes(option)
                ? "border-orange-500 bg-orange-50/50"
                : "border-slate-200 bg-white hover:bg-slate-50"
            }`}
          >
            <input
              type="checkbox"
              className="hidden"
              checked={selected.includes(option)}
              onChange={() => toggle(option)}
            />
            <div
              className={`flex h-4 w-4 items-center justify-center rounded border ${
                selected.includes(option)
                  ? "border-orange-500 bg-orange-500"
                  : "border-slate-300 bg-white"
              }`}
            >
              {selected.includes(option) && (
                <svg
                  className="h-3 w-3 text-white"
                  viewBox="0 0 12 12"
                  fill="none"
                >
                  <path
                    d="M2.5 6L5.5 9L9.5 3"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>
            <span className="text-sm text-slate-700">{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

function TextArea({
  label,
  value,
  onChange,
  placeholder,
  rows = 4,
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  required?: boolean;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-medium text-slate-800">
        {label}
        {required && <span className="ml-1 text-orange-600">*</span>}
      </span>
      <textarea
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 transition placeholder:text-orange-400/80 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
      />
    </label>
  );
}

export default function IncidentReportPage() {
  const [form, setForm] = useState<IncidentFormState>(initialState);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.type) {
      alert("Incident type is required.");
      return;
    }
    if (form.damageCategories.length === 0) {
      alert("Please select at least one damage category.");
      return;
    }
    alert("Incident reported successfully! (Mock submission)");
    setForm(initialState);
  };

  return (
    <main className="flex-1 px-4 py-6 md:px-8 lg:px-10 flex flex-col">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-5 pb-10">
        <form onSubmit={handleSubmit} className="grid gap-6">
          <SectionCard title="1. Basic Categorization" subtitle="Define the primary type of the incident and what was impacted.">
            <div className="grid gap-6">
              <Select
                label="Incident Type"
                value={form.type}
                onChange={(value) => setForm({ ...form, type: value })}
                options={["Incident", "Near Miss", "Accident", "Hazard"]}
                required
              />

              <CheckboxGroup
                label="Damage Category"
                selected={form.damageCategories}
                onChange={(vals) => setForm({ ...form, damageCategories: vals })}
                options={["Property", "Environment", "Equipment", "Service", "Data"]}
                required
              />
            </div>
          </SectionCard>

          <SectionCard title="2. Severity & Loss Assessment" subtitle="Classify the actual or potential severity for rapid response routing.">
            <div className="grid gap-8">
              <div className="space-y-4">
                <CheckboxGroup
                  label="Actual Impact (Optional)"
                  selected={form.severityActual}
                  onChange={(vals) => setForm({ ...form, severityActual: vals })}
                  options={["Property damage", "Environmental damage", "Operational loss"]}
                />
              </div>

              <div className="space-y-4">
                <CheckboxGroup
                  label="Potential Impact (Optional)"
                  selected={form.severityPotential}
                  onChange={(vals) => setForm({ ...form, severityPotential: vals })}
                  options={["Potential injury", "Potential downtime", "Potential reputation"]}
                />
              </div>

              <div className="space-y-4 pt-2 border-t border-slate-100">
                <CheckboxGroup
                  label="Human Loss (Optional)"
                  selected={form.humanLoss}
                  onChange={(vals) => setForm({ ...form, humanLoss: vals })}
                  options={["Fatality", "Serious injury", "Minor injury", "No injury"]}
                />
              </div>
            </div>
          </SectionCard>

          <SectionCard title="3. Incident Description" subtitle="Provide any additional context or details about what happened.">
            <div>
              <TextArea
                label="Description"
                value={form.description}
                onChange={(value) => setForm({ ...form, description: value })}
                placeholder="Free text field for details/observations..."
                rows={5}
              />
            </div>
          </SectionCard>

          <div className="flex justify-end pt-4 mb-16">
            <button
              type="submit"
              className="rounded-xl bg-orange-600 px-8 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
            >
              Submit Report
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
