"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProgressTabs from "@/components/ProgressTabs";
import SectionCard from "@/components/SectionCard";
import Footer from "@/components/Footer";
import {
  companySizes,
  contractorTypes,
  serviceCategories,
} from "@/data/options";

type ContactPerson = {
  id: string;
  name: string;
  position: string;
  email: string;
  phone: string;
};

type Reference = {
  id: string;
  company: string;
  contact: string;
  phone: string;
  email: string;
};

type FormState = {
  appointmentDate: string;
  procurementRef: string;
  companyName: string;
  website: string;
  contractType: string;
  serviceCategory: string;
  companySize: string;

  address: string;
  city: string;
  state: string;
  country: string;

  contactPersons: ContactPerson[];
  projectName: string;
  projectEstimateBudget: string;
  projectDuration: string;
  projectNotes: string;
  references: Reference[];

  scopeSummary: string;
};

const STORAGE_KEY = "contractor-pre-screening-form-v5";
const LEGACY_STORAGE_KEYS = [
  "contractor-pre-screening-form-v4",
  "contractor-pre-screening-form-v3",
  "contractor-pre-screening-form-v2",
];

const sectionIds = [
  "Company Information",
  "Contacts & Location",
  "Project Details",
];

const makeId = () => Math.random().toString(36).slice(2, 11);

const initialState: FormState = {
  appointmentDate: "",
  procurementRef: "",
  companyName: "",
  website: "",
  contractType: "",
  serviceCategory: "",
  companySize: "",

  address: "",
  city: "",
  state: "",
  country: "Nigeria",

  contactPersons: [
    { id: makeId(), name: "", position: "", email: "", phone: "" },
  ],
  projectName: "",
  projectEstimateBudget: "",
  projectDuration: "",
  projectNotes: "",
  references: [],

  scopeSummary: "",
};

const parseSavedForm = (saved: string | null): FormState => {
  if (!saved) {
    return initialState;
  }

  try {
    const parsed = JSON.parse(saved) as Partial<
      FormState & {
        screeningDate?: string;
        contractorType?: string;
      }
    >;

    return {
      ...initialState,
      ...parsed,
      contractType: parsed.contractType ?? parsed.contractorType ?? initialState.contractType,
      appointmentDate:
        parsed.appointmentDate ?? parsed.screeningDate ?? initialState.appointmentDate,
    };
  } catch {
    console.log("Could not load saved draft");
    return initialState;
  }
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
  error,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  error?: string;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-medium text-slate-800">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-invalid={error ? "true" : "false"}
        className={`h-12 rounded-xl border bg-white px-4 text-sm text-slate-900 transition placeholder:text-orange-400/80 focus:outline-none focus:ring-1 ${
          error
            ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500"
            : "border-slate-200 focus:border-orange-500 focus:ring-orange-500"
        }`}
      />
      {error ? <span className="text-xs text-rose-600">{error}</span> : null}
    </label>
  );
}

const PUBLIC_EMAIL_DOMAINS = new Set([
  "gmail.com",
  "googlemail.com",
  "yahoo.com",
  "yahoo.co.uk",
  "yahoo.ca",
  "yahoo.fr",
  "yahoo.de",
  "hotmail.com",
  "outlook.com",
  "live.com",
  "msn.com",
  "icloud.com",
  "me.com",
  "mac.com",
  "aol.com",
  "proton.me",
  "protonmail.com",
  "pm.me",
  "gmx.com",
  "mail.com",
  "zoho.com",
  "yandex.com",
]);

const getContactEmailError = (email: string) => {
  const trimmedEmail = email.trim().toLowerCase();

  if (!trimmedEmail) {
    return "";
  }

  const emailParts = trimmedEmail.split("@");
  if (emailParts.length !== 2 || !emailParts[1]) {
    return "Enter a valid company email address.";
  }

  if (PUBLIC_EMAIL_DOMAINS.has(emailParts[1])) {
    return "Use a company email address. Public email domains are not accepted.";
  }

  return "";
};

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
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="grid gap-2" ref={dropdownRef}>
      <span className="text-sm font-medium text-slate-800">{label}</span>
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`relative flex min-h-[48px] w-full items-center justify-between rounded-xl border bg-white px-4 py-2 text-left text-sm shadow-sm transition focus:outline-none focus:ring-1 focus:ring-orange-500 ${
            isOpen
              ? "border-orange-500 ring-1 ring-orange-500"
              : "border-slate-200 hover:border-orange-300"
          } ${!value ? "text-slate-500" : "text-slate-900"}`}
        >
          <span className="block pr-6 leading-relaxed line-clamp-2">
            {value || "Select option"}
          </span>
          <span className="pointer-events-none absolute right-4 flex items-center">
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDownIcon />
            </motion.div>
          </span>
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="absolute z-50 mt-1 max-h-72 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white py-1 shadow-lg shadow-slate-900/10 thin-scrollbar"
            >
              <button
                type="button"
                onClick={() => {
                  onChange("");
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-3 flex items-start text-left text-sm transition-colors hover:bg-orange-50 ${
                  !value
                    ? "bg-orange-50/50 text-orange-700 font-medium"
                    : "text-slate-700"
                }`}
              >
                <span className="block whitespace-normal break-words flex-1 pr-2 leading-relaxed">
                  Select option
                </span>
                {!value && (
                  <span className="flex items-center text-orange-600 mt-0.5">
                    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                    </svg>
                  </span>
                )}
              </button>
              {options.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    onChange(option);
                    setIsOpen(false);
                  }}
                  className={`w-full px-4 py-3 flex items-start text-left text-sm transition-colors hover:bg-orange-50 ${
                    value === option
                      ? "bg-orange-50/50 text-orange-700 font-medium"
                      : "text-slate-700"
                  }`}
                >
                  <span className="block whitespace-normal break-words flex-1 pr-2 leading-relaxed">
                    {option}
                  </span>
                  {value === option && (
                    <span className="flex items-center text-orange-600 mt-0.5">
                      <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                      </svg>
                    </span>
                  )}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
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
  const [form, setForm] = useState<FormState>(() => {
    if (typeof window === "undefined") {
      return initialState;
    }

    return parseSavedForm(
      localStorage.getItem(STORAGE_KEY) ??
        LEGACY_STORAGE_KEYS.map((key) => localStorage.getItem(key)).find(Boolean) ??
        null
    );
  });
  const [showToast, setShowToast] = useState(false);
  const [activeSection, setActiveSection] = useState(sectionIds[0]);

  const companyInformationRef = useRef<HTMLElement | null>(null);
  const contactsLocationRef = useRef<HTMLElement | null>(null);
  const projectDetailsRef = useRef<HTMLElement | null>(null);

  const refs = {
    "Company Information": companyInformationRef,
    "Contacts & Location": contactsLocationRef,
    "Project Details": projectDetailsRef,
  };

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

  const addRow = (key: "contactPersons" | "references") => {
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

      return {
        ...prev,
        references: [
          ...prev.references,
          { id: makeId(), company: "", contact: "", phone: "", email: "" },
        ],
      };
    });
  };

  const removeRow = (key: "contactPersons" | "references", id: string) => {
    setForm((prev) => ({
      ...prev,
      [key]: prev[key].filter((item) => item.id !== id),
    }));
  };

  const clearForm = () => {
    setForm(initialState);
    localStorage.removeItem(STORAGE_KEY);
    LEGACY_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));
  };

  const handleResetClick = () => {
    clearForm();
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  return (
    <main className="flex-1 flex flex-col min-h-0 relative w-full lg:overflow-y-auto bg-slate-50 thin-scrollbar">
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -20, x: "-50%" }}
            className="fixed top-24 left-1/2 z-[100] rounded-full bg-slate-900 px-6 py-2.5 text-sm font-medium text-white shadow-xl shadow-slate-900/10"
          >
            Form has been cleared
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mx-auto flex flex-none w-full max-w-[1600px] flex-col lg:flex-row lg:gap-6 px-4 md:px-8 lg:px-8 pb-6 pt-6 lg:pt-8">
        <aside className="w-full lg:w-[240px] xl:w-[260px] shrink-0 sticky top-[10px] z-40 bg-slate-50/95 lg:bg-transparent -mx-4 px-4 pt-1.5 pb-1 lg:mx-0 lg:px-0 lg:py-0 lg:border-none lg:pr-4 border-b border-slate-200 lg:max-h-[calc(100vh-120px)] lg:overflow-y-auto thin-scrollbar self-start">
          <div className="flex flex-col gap-1 lg:gap-3 lg:pr-2">
            <div className="hidden lg:block w-full">
              <ProgressTabs
                sections={sectionIds}
                activeSection={activeSection}
                onClick={scrollToSection}
              />
            </div>

            <button
              type="button"
              onClick={handleResetClick}
              className="self-end rounded-lg border border-dotted border-slate-400 bg-slate-50 px-4 py-2 text-xs font-medium text-slate-600 transition hover:border-red-400 hover:bg-red-50 hover:text-red-600 cursor-pointer mt-1"
            >
              Reset Form
            </button>
          </div>
        </aside>

        <div className="flex flex-col flex-1 pb-10 lg:py-0 lg:px-2" id="form-container">
          <div className="space-y-6 pb-12">
            <section ref={companyInformationRef}>
              <SectionCard
                title="Company Information"
                subtitle="Capture core contractor identity, business profile, and service classification."
              >
                <div className="grid gap-4 md:grid-cols-2">
                  <Input
                    label="Appointment Date"
                    type="date"
                    value={form.appointmentDate}
                    onChange={(value) => updateField("appointmentDate", value)}
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
                    label="Website"
                    value={form.website}
                    onChange={(value) => updateField("website", value)}
                    placeholder="https://company.com"
                  />
                  <Select
                    label="Contract Type"
                    value={form.contractType}
                    onChange={(value) => updateField("contractType", value)}
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

            <section ref={contactsLocationRef}>
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
                            error={getContactEmailError(person.email)}
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

            <section ref={projectDetailsRef}>
              <SectionCard
                title="Project Details"
                subtitle="Share optional details about the contract or project you want to propose."
              >
                <div className="grid gap-5">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Input
                      label="Project / Contract Title"
                      value={form.projectName}
                      onChange={(value) => updateField("projectName", value)}
                      placeholder="Optional project title"
                    />
                    <Input
                      label="Estimated Budget"
                      value={form.projectEstimateBudget}
                      onChange={(value) => updateField("projectEstimateBudget", value)}
                      placeholder="Optional estimate"
                    />
                    <Input
                      label="Estimated Duration"
                      value={form.projectDuration}
                      onChange={(value) => updateField("projectDuration", value)}
                      placeholder="e.g. 8 weeks"
                    />
                  </div>

                  <TextArea
                    label="Project Notes"
                    value={form.projectNotes}
                    onChange={(value) => updateField("projectNotes", value)}
                    placeholder="Optional project details, assumptions, delivery notes, or anything else the company should know."
                  />
                </div>

                <div className="mt-8">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div>
                      <h3 className="text-base font-semibold text-slate-900">
                        Client References
                      </h3>
                      <p className="text-sm text-slate-500">
                        Optional references you want the company to contact.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => addRow("references")}
                      className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                    >
                      Add Reference
                    </button>
                  </div>

                  {form.references.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-500">
                      No client references added.
                    </div>
                  ) : (
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
                            <button
                              type="button"
                              onClick={() => removeRow("references", reference.id)}
                              className="text-sm font-medium text-rose-600 hover:text-rose-700"
                            >
                              Remove
                            </button>
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
                  )}
                </div>
              </SectionCard>
            </section>
          </div>
        </div>
      </div>
      <div className="mt-auto shrink-0 w-full">
        <Footer />
      </div>
    </main>
  );
}
