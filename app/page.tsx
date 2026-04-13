"use client";

import { useEffect, useRef, useState } from "react";
import ProgressTabs from "@/components/ProgressTabs";
import SectionCard from "@/components/SectionCard";
import {
  companySizes,
  contractorTypes,
  documentStatuses,
  evaluationCriteria,
  scoreOptions,
  serviceCategories,
} from "@/data/options";

type ContactPerson = {
  id: string;
  name: string;
  position: string;
  email: string;
  phone: string;
};

type KeyStaff = {
  id: string;
  name: string;
  role: string;
  years: string;
  certification: string;
};

type ProjectRecord = {
  id: string;
  projectName: string;
  client: string;
  value: string;
  year: string;
  status: string;
};

type Reference = {
  id: string;
  company: string;
  contact: string;
  phone: string;
  email: string;
};

type DocumentItem = {
  id: string;
  name: string;
  status: string;
  expiry: string;
};

type EvaluationRow = {
  id: string;
  criterion: string;
  score: number;
  comment: string;
};

type FormState = {
  formNumber: string;
  screeningDate: string;
  procurementRef: string;
  companyName: string;
  registrationNumber: string;
  taxId: string;
  website: string;
  contractorType: string;
  serviceCategory: string;
  companySize: string;
  yearsInOperation: string;

  address: string;
  city: string;
  state: string;
  country: string;

  contactPersons: ContactPerson[];
  keyStaff: KeyStaff[];
  projectRecords: ProjectRecord[];
  references: Reference[];
  documents: DocumentItem[];
  evaluations: EvaluationRow[];

  scopeSummary: string;
  hseStatement: string;
  qualityStatement: string;
  notes: string;

  recommended: string;
  reviewerName: string;
  reviewerTitle: string;
};

const STORAGE_KEY = "contractor-pre-screening-form-v2";

const sectionIds = [
  "Company Information",
  "Contacts & Location",
  "Technical Capability",
  "Compliance Documents",
  "Evaluation & Decision",
];

const defaultDocuments = [
  "CAC / Business Registration",
  "Tax Clearance Certificate",
  "VAT Registration",
  "HSE Policy",
  "Insurance Certificate",
  "Quality Policy / QA-QC Procedure",
  "Relevant Professional Licenses",
];

const makeId = () => Math.random().toString(36).slice(2, 11);

const initialState: FormState = {
  formNumber: "CPSF-001",
  screeningDate: "",
  procurementRef: "",
  companyName: "",
  registrationNumber: "",
  taxId: "",
  website: "",
  contractorType: "",
  serviceCategory: "",
  companySize: "",
  yearsInOperation: "",

  address: "",
  city: "",
  state: "",
  country: "Nigeria",

  contactPersons: [
    { id: makeId(), name: "", position: "", email: "", phone: "" },
  ],
  keyStaff: [
    { id: makeId(), name: "", role: "", years: "", certification: "" },
  ],
  projectRecords: [
    {
      id: makeId(),
      projectName: "",
      client: "",
      value: "",
      year: "",
      status: "",
    },
  ],
  references: [{ id: makeId(), company: "", contact: "", phone: "", email: "" }],
  documents: defaultDocuments.map((doc) => ({
    id: makeId(),
    name: doc,
    status: "Not Available",
    expiry: "",
  })),
  evaluations: evaluationCriteria.map((criterion) => ({
    id: makeId(),
    criterion,
    score: 3,
    comment: "",
  })),

  scopeSummary: "",
  hseStatement: "",
  qualityStatement: "",
  notes: "",

  recommended: "Under Review",
  reviewerName: "",
  reviewerTitle: "",
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

function Input({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-medium text-slate-800">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 transition placeholder:text-orange-400/80 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
      />
    </label>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-medium text-slate-800">{label}</span>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
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

function TableSelect({
  value,
  onChange,
  options,
}: {
  value: string | number;
  onChange: (value: string) => void;
  options: Array<string | number>;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 pr-10 text-sm text-slate-900 shadow-sm transition focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
      >
        {options.map((option) => (
          <option key={String(option)} value={option}>
            {option}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
        <ChevronDownIcon />
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
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-medium text-slate-800">{label}</span>
      <textarea
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 transition placeholder:text-orange-400/80 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
      />
    </label>
  );
}

export default function Page() {
  const [form, setForm] = useState<FormState>(initialState);
  const [activeSection, setActiveSection] = useState(sectionIds[0]);

  const refs = {
    "Company Information": useRef<HTMLElement | null>(null),
    "Contacts & Location": useRef<HTMLElement | null>(null),
    "Technical Capability": useRef<HTMLElement | null>(null),
    "Compliance Documents": useRef<HTMLElement | null>(null),
    "Evaluation & Decision": useRef<HTMLElement | null>(null),
  };

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setForm(JSON.parse(saved));
      } catch {
        console.log("Could not load saved draft");
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
  }, [form]);

  const updateField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const scrollToSection = (section: string) => {
    setActiveSection(section);
    refs[section as keyof typeof refs].current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const addRow = (
    key: "contactPersons" | "keyStaff" | "projectRecords" | "references"
  ) => {
    setForm((prev) => {
      if (key === "contactPersons") {
        return {
          ...prev,
          contactPersons: [
            ...prev.contactPersons,
            { id: makeId(), name: "", position: "", email: "", phone: "" },
          ],
        };
      }

      if (key === "keyStaff") {
        return {
          ...prev,
          keyStaff: [
            ...prev.keyStaff,
            { id: makeId(), name: "", role: "", years: "", certification: "" },
          ],
        };
      }

      if (key === "projectRecords") {
        return {
          ...prev,
          projectRecords: [
            ...prev.projectRecords,
            {
              id: makeId(),
              projectName: "",
              client: "",
              value: "",
              year: "",
              status: "",
            },
          ],
        };
      }

      return {
        ...prev,
        references: [
          ...prev.references,
          { id: makeId(), company: "", contact: "", phone: "", email: "" },
        ],
      };
    });
  };

  const removeRow = (
    key: "contactPersons" | "keyStaff" | "projectRecords" | "references",
    id: string
  ) => {
    setForm((prev) => ({
      ...prev,
      [key]: prev[key].filter((item) => item.id !== id),
    }));
  };

  const clearForm = () => {
    setForm(initialState);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <main className="flex-1 px-4 py-6 md:px-8 lg:px-10">
      <div className="mx-auto flex h-full max-w-7xl flex-col gap-5">
        <div className="grid flex-1 gap-6 lg:grid-cols-[260px_1fr] items-start">
          <aside className="sticky top-24 flex max-h-[calc(100vh-6rem)] flex-col gap-5 overflow-y-auto pr-1 pb-4">
            <ProgressTabs
              sections={sectionIds}
              activeSection={activeSection}
              onClick={scrollToSection}
            />
            
            <SectionCard title="Actions">
              <div className="grid gap-3">
                <button
                  type="button"
                  onClick={clearForm}
                  className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                >
                  Reset Form
                </button>
              </div>
            </SectionCard>
          </aside>

          <div className="flex flex-col pr-1 pb-10" id="form-container">
            <div className="space-y-6 pb-12">
              <section
                ref={(node) => {
                  refs["Company Information"].current = node;
                }}
              >
                <SectionCard
                  title="Company Information"
                  subtitle="Capture core contractor identity, business profile, and service classification."
                >
                  <div className="grid gap-4 md:grid-cols-2">
                    <Input
                      label="Form Number"
                      value={form.formNumber}
                      onChange={(value) => updateField("formNumber", value)}
                      placeholder="CPSF-001"
                    />
                    <Input
                      label="Screening Date"
                      type="date"
                      value={form.screeningDate}
                      onChange={(value) => updateField("screeningDate", value)}
                    />
                    <Input
                      label="Procurement Reference"
                      value={form.procurementRef}
                      onChange={(value) => updateField("procurementRef", value)}
                      placeholder="RFQ / Tender Ref"
                    />
                    <Input
                      label="Company Name"
                      value={form.companyName}
                      onChange={(value) => updateField("companyName", value)}
                      placeholder="Enter contractor company name"
                    />
                    <Input
                      label="Registration Number"
                      value={form.registrationNumber}
                      onChange={(value) => updateField("registrationNumber", value)}
                      placeholder="CAC / Business Reg No."
                    />
                    <Input
                      label="Tax ID"
                      value={form.taxId}
                      onChange={(value) => updateField("taxId", value)}
                      placeholder="TIN"
                    />
                    <Input
                      label="Website"
                      value={form.website}
                      onChange={(value) => updateField("website", value)}
                      placeholder="https://company.com"
                    />
                    <Input
                      label="Years in Operation"
                      value={form.yearsInOperation}
                      onChange={(value) => updateField("yearsInOperation", value)}
                      placeholder="e.g. 8"
                    />
                    <Select
                      label="Contractor Type"
                      value={form.contractorType}
                      onChange={(value) => updateField("contractorType", value)}
                      options={contractorTypes}
                    />
                    <Select
                      label="Service Category"
                      value={form.serviceCategory}
                      onChange={(value) => updateField("serviceCategory", value)}
                      options={serviceCategories}
                    />
                    <Select
                      label="Company Size"
                      value={form.companySize}
                      onChange={(value) => updateField("companySize", value)}
                      options={companySizes}
                    />
                  </div>

                  <div className="mt-5 grid gap-4">
                    <TextArea
                      label="Scope Summary"
                      value={form.scopeSummary}
                      onChange={(value) => updateField("scopeSummary", value)}
                      placeholder="Briefly describe the services, work scope, and project relevance of this contractor."
                    />
                  </div>
                </SectionCard>
              </section>

              <section
                ref={(node) => {
                  refs["Contacts & Location"].current = node;
                }}
              >
                <SectionCard
                  title="Contacts & Location"
                  subtitle="Capture contractor office details and focal persons."
                >
                  <div className="grid gap-4 md:grid-cols-2">
                    <TextArea
                      label="Registered Address"
                      value={form.address}
                      onChange={(value) => updateField("address", value)}
                      placeholder="Enter full company address"
                      rows={3}
                    />
                    <div className="grid gap-4">
                      <Input
                        label="City"
                        value={form.city}
                        onChange={(value) => updateField("city", value)}
                      />
                      <Input
                        label="State"
                        value={form.state}
                        onChange={(value) => updateField("state", value)}
                      />
                      <Input
                        label="Country"
                        value={form.country}
                        onChange={(value) => updateField("country", value)}
                      />
                    </div>
                  </div>

                  <div className="mt-8">
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <div>
                        <h3 className="text-base font-semibold text-slate-900">
                          Contact Persons
                        </h3>
                        <p className="text-sm text-slate-500">
                          Add primary company contacts for communication and coordination.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => addRow("contactPersons")}
                        className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                      >
                        Add Contact
                      </button>
                    </div>

                    <div className="space-y-4">
                      {form.contactPersons.map((person, index) => (
                        <div
                          key={person.id}
                          className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                        >
                          <div className="mb-4 flex items-center justify-between">
                            <p className="font-medium text-slate-800">
                              Contact {index + 1}
                            </p>
                            {form.contactPersons.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeRow("contactPersons", person.id)}
                                className="text-sm font-medium text-rose-600 hover:text-rose-700"
                              >
                                Remove
                              </button>
                            )}
                          </div>

                          <div className="grid gap-4 md:grid-cols-2">
                            <Input
                              label="Full Name"
                              value={person.name}
                              onChange={(value) =>
                                setForm((prev) => ({
                                  ...prev,
                                  contactPersons: prev.contactPersons.map((item) =>
                                    item.id === person.id ? { ...item, name: value } : item
                                  ),
                                }))
                              }
                            />
                            <Input
                              label="Position"
                              value={person.position}
                              onChange={(value) =>
                                setForm((prev) => ({
                                  ...prev,
                                  contactPersons: prev.contactPersons.map((item) =>
                                    item.id === person.id
                                      ? { ...item, position: value }
                                      : item
                                  ),
                                }))
                              }
                            />
                            <Input
                              label="Email"
                              type="email"
                              value={person.email}
                              onChange={(value) =>
                                setForm((prev) => ({
                                  ...prev,
                                  contactPersons: prev.contactPersons.map((item) =>
                                    item.id === person.id ? { ...item, email: value } : item
                                  ),
                                }))
                              }
                            />
                            <Input
                              label="Phone"
                              value={person.phone}
                              onChange={(value) =>
                                setForm((prev) => ({
                                  ...prev,
                                  contactPersons: prev.contactPersons.map((item) =>
                                    item.id === person.id ? { ...item, phone: value } : item
                                  ),
                                }))
                              }
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </SectionCard>
              </section>

              <section
                ref={(node) => {
                  refs["Technical Capability"].current = node;
                }}
              >
                <SectionCard
                  title="Technical Capability"
                  subtitle="Assess manpower, past projects, and client references."
                >
                  <div className="grid gap-5">
                    <TextArea
                      label="HSE Statement"
                      value={form.hseStatement}
                      onChange={(value) => updateField("hseStatement", value)}
                      placeholder="Briefly describe contractor HSE system, safety culture, and field readiness."
                    />

                    <TextArea
                      label="Quality Statement"
                      value={form.qualityStatement}
                      onChange={(value) => updateField("qualityStatement", value)}
                      placeholder="Describe quality assurance / quality control capability."
                    />
                  </div>

                  <div className="mt-8">
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <div>
                        <h3 className="text-base font-semibold text-slate-900">
                          Key Staff
                        </h3>
                        <p className="text-sm text-slate-500">
                          List technical team members relevant to this service.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => addRow("keyStaff")}
                        className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                      >
                        Add Staff
                      </button>
                    </div>

                    <div className="space-y-4">
                      {form.keyStaff.map((staff, index) => (
                        <div
                          key={staff.id}
                          className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                        >
                          <div className="mb-4 flex items-center justify-between">
                            <p className="font-medium text-slate-800">
                              Staff {index + 1}
                            </p>
                            {form.keyStaff.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeRow("keyStaff", staff.id)}
                                className="text-sm font-medium text-rose-600 hover:text-rose-700"
                              >
                                Remove
                              </button>
                            )}
                          </div>

                          <div className="grid gap-4 md:grid-cols-2">
                            <Input
                              label="Name"
                              value={staff.name}
                              onChange={(value) =>
                                setForm((prev) => ({
                                  ...prev,
                                  keyStaff: prev.keyStaff.map((item) =>
                                    item.id === staff.id ? { ...item, name: value } : item
                                  ),
                                }))
                              }
                            />
                            <Input
                              label="Role"
                              value={staff.role}
                              onChange={(value) =>
                                setForm((prev) => ({
                                  ...prev,
                                  keyStaff: prev.keyStaff.map((item) =>
                                    item.id === staff.id ? { ...item, role: value } : item
                                  ),
                                }))
                              }
                            />
                            <Input
                              label="Years of Experience"
                              value={staff.years}
                              onChange={(value) =>
                                setForm((prev) => ({
                                  ...prev,
                                  keyStaff: prev.keyStaff.map((item) =>
                                    item.id === staff.id ? { ...item, years: value } : item
                                  ),
                                }))
                              }
                            />
                            <Input
                              label="Certification / Qualification"
                              value={staff.certification}
                              onChange={(value) =>
                                setForm((prev) => ({
                                  ...prev,
                                  keyStaff: prev.keyStaff.map((item) =>
                                    item.id === staff.id
                                      ? { ...item, certification: value }
                                      : item
                                  ),
                                }))
                              }
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8">
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <div>
                        <h3 className="text-base font-semibold text-slate-900">
                          Relevant Project Experience
                        </h3>
                        <p className="text-sm text-slate-500">
                          Add similar projects completed by the contractor.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => addRow("projectRecords")}
                        className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                      >
                        Add Project
                      </button>
                    </div>

                    <div className="space-y-4">
                      {form.projectRecords.map((project, index) => (
                        <div
                          key={project.id}
                          className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                        >
                          <div className="mb-4 flex items-center justify-between">
                            <p className="font-medium text-slate-800">
                              Project {index + 1}
                            </p>
                            {form.projectRecords.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeRow("projectRecords", project.id)}
                                className="text-sm font-medium text-rose-600 hover:text-rose-700"
                              >
                                Remove
                              </button>
                            )}
                          </div>

                          <div className="grid gap-4 md:grid-cols-2">
                            <Input
                              label="Project Name"
                              value={project.projectName}
                              onChange={(value) =>
                                setForm((prev) => ({
                                  ...prev,
                                  projectRecords: prev.projectRecords.map((item) =>
                                    item.id === project.id
                                      ? { ...item, projectName: value }
                                      : item
                                  ),
                                }))
                              }
                            />
                            <Input
                              label="Client"
                              value={project.client}
                              onChange={(value) =>
                                setForm((prev) => ({
                                  ...prev,
                                  projectRecords: prev.projectRecords.map((item) =>
                                    item.id === project.id ? { ...item, client: value } : item
                                  ),
                                }))
                              }
                            />
                            <Input
                              label="Project Value"
                              value={project.value}
                              onChange={(value) =>
                                setForm((prev) => ({
                                  ...prev,
                                  projectRecords: prev.projectRecords.map((item) =>
                                    item.id === project.id ? { ...item, value: value } : item
                                  ),
                                }))
                              }
                              placeholder="e.g. ₦20,000,000"
                            />
                            <Input
                              label="Year"
                              value={project.year}
                              onChange={(value) =>
                                setForm((prev) => ({
                                  ...prev,
                                  projectRecords: prev.projectRecords.map((item) =>
                                    item.id === project.id ? { ...item, year: value } : item
                                  ),
                                }))
                              }
                            />
                            <Input
                              label="Status"
                              value={project.status}
                              onChange={(value) =>
                                setForm((prev) => ({
                                  ...prev,
                                  projectRecords: prev.projectRecords.map((item) =>
                                    item.id === project.id ? { ...item, status: value } : item
                                  ),
                                }))
                              }
                              placeholder="Completed / Ongoing"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8">
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <div>
                        <h3 className="text-base font-semibold text-slate-900">
                          Client References
                        </h3>
                      </div>
                      <button
                        type="button"
                        onClick={() => addRow("references")}
                        className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                      >
                        Add Reference
                      </button>
                    </div>

                    <div className="space-y-4">
                      {form.references.map((reference, index) => (
                        <div
                          key={reference.id}
                          className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                        >
                          <div className="mb-4 flex items-center justify-between">
                            <p className="font-medium text-slate-800">
                              Reference {index + 1}
                            </p>
                            {form.references.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeRow("references", reference.id)}
                                className="text-sm font-medium text-rose-600 hover:text-rose-700"
                              >
                                Remove
                              </button>
                            )}
                          </div>

                          <div className="grid gap-4 md:grid-cols-2">
                            <Input
                              label="Company"
                              value={reference.company}
                              onChange={(value) =>
                                setForm((prev) => ({
                                  ...prev,
                                  references: prev.references.map((item) =>
                                    item.id === reference.id
                                      ? { ...item, company: value }
                                      : item
                                  ),
                                }))
                              }
                            />
                            <Input
                              label="Contact Person"
                              value={reference.contact}
                              onChange={(value) =>
                                setForm((prev) => ({
                                  ...prev,
                                  references: prev.references.map((item) =>
                                    item.id === reference.id
                                      ? { ...item, contact: value }
                                      : item
                                  ),
                                }))
                              }
                            />
                            <Input
                              label="Phone"
                              value={reference.phone}
                              onChange={(value) =>
                                setForm((prev) => ({
                                  ...prev,
                                  references: prev.references.map((item) =>
                                    item.id === reference.id
                                      ? { ...item, phone: value }
                                      : item
                                  ),
                                }))
                              }
                            />
                            <Input
                              label="Email"
                              value={reference.email}
                              onChange={(value) =>
                                setForm((prev) => ({
                                  ...prev,
                                  references: prev.references.map((item) =>
                                    item.id === reference.id
                                      ? { ...item, email: value }
                                      : item
                                  ),
                                }))
                              }
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </SectionCard>
              </section>

              <section
                ref={(node) => {
                  refs["Compliance Documents"].current = node;
                }}
              >
                <SectionCard
                  title="Compliance Documents"
                  subtitle="Track the contractor’s mandatory business and compliance documents."
                >
                  <div className="overflow-hidden rounded-2xl border border-slate-200">
                    <div className="overflow-x-auto">
                      <table className="min-w-full border-collapse">
                        <thead className="bg-slate-950 text-left text-sm text-white">
                          <tr>
                            <th className="px-4 py-3 font-medium">Document</th>
                            <th className="px-4 py-3 font-medium">Status</th>
                            <th className="px-4 py-3 font-medium">Expiry Date</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 bg-white">
                          {form.documents.map((doc) => (
                            <tr key={doc.id}>
                              <td className="px-4 py-3 text-sm font-medium text-slate-800">
                                {doc.name}
                              </td>
                              <td className="px-4 py-3">
                                <TableSelect
                                  value={doc.status}
                                  onChange={(value) =>
                                    setForm((prev) => ({
                                      ...prev,
                                      documents: prev.documents.map((item) =>
                                        item.id === doc.id
                                          ? { ...item, status: value }
                                          : item
                                      ),
                                    }))
                                  }
                                  options={documentStatuses}
                                />
                              </td>
                              <td className="px-4 py-3">
                                <input
                                  type="date"
                                  value={doc.expiry}
                                  onChange={(e) =>
                                    setForm((prev) => ({
                                      ...prev,
                                      documents: prev.documents.map((item) =>
                                        item.id === doc.id
                                          ? { ...item, expiry: e.target.value }
                                          : item
                                      ),
                                    }))
                                  }
                                  className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </SectionCard>
              </section>

              <section
                ref={(node) => {
                  refs["Evaluation & Decision"].current = node;
                }}
              >
                <SectionCard
                  title="Evaluation & Decision"
                  subtitle="Rate the contractor and record the reviewer’s recommendation."
                >
                  <div className="overflow-hidden rounded-2xl border border-slate-200">
                    <div className="overflow-x-auto">
                      <table className="min-w-full border-collapse">
                        <thead className="bg-slate-950 text-left text-sm text-white">
                          <tr>
                            <th className="px-4 py-3 font-medium">Criterion</th>
                            <th className="px-4 py-3 font-medium">Score (1 - 5)</th>
                            <th className="px-4 py-3 font-medium">Comments</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 bg-white">
                          {form.evaluations.map((row) => (
                            <tr key={row.id}>
                              <td className="px-4 py-3 text-sm font-medium text-slate-800">
                                {row.criterion}
                              </td>
                              <td className="px-4 py-3">
                                <TableSelect
                                  value={row.score}
                                  onChange={(value) =>
                                    setForm((prev) => ({
                                      ...prev,
                                      evaluations: prev.evaluations.map((item) =>
                                        item.id === row.id
                                          ? {
                                              ...item,
                                              score: Number(value),
                                            }
                                          : item
                                      ),
                                    }))
                                  }
                                  options={scoreOptions}
                                />
                              </td>
                              <td className="px-4 py-3">
                                <input
                                  type="text"
                                  value={row.comment}
                                  onChange={(e) =>
                                    setForm((prev) => ({
                                      ...prev,
                                      evaluations: prev.evaluations.map((item) =>
                                        item.id === row.id
                                          ? { ...item, comment: e.target.value }
                                          : item
                                      ),
                                    }))
                                  }
                                  placeholder="Optional note"
                                  className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-4 md:grid-cols-2">
                    <Select
                      label="Recommendation"
                      value={form.recommended}
                      onChange={(value) => updateField("recommended", value)}
                      options={[
                        "Under Review",
                        "Recommended",
                        "Recommended with Conditions",
                        "Not Recommended",
                      ]}
                    />
                    <Input
                      label="Reviewer Name"
                      value={form.reviewerName}
                      onChange={(value) => updateField("reviewerName", value)}
                    />
                    <Input
                      label="Reviewer Title"
                      value={form.reviewerTitle}
                      onChange={(value) => updateField("reviewerTitle", value)}
                    />
                  </div>

                  <div className="mt-5">
                    <TextArea
                      label="Reviewer Notes"
                      value={form.notes}
                      onChange={(value) => updateField("notes", value)}
                      placeholder="Enter concluding observations, approval conditions, or follow-up actions."
                      rows={5}
                    />
                  </div>
                </SectionCard>
              </section>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}