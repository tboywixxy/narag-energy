"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

export default function Navbar() {
  const pathname = usePathname();

  const isIncident = pathname === "/incident";

  return (
    <nav className="sticky top-0 z-50 shrink-0 border-b border-slate-200 bg-white/95 backdrop-blur-sm shadow-sm overflow-hidden">
      <div className="mx-auto flex min-h-[4rem] max-w-7xl items-center justify-between gap-8 px-4 py-2 md:px-8 lg:px-10">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <a href="https://www.naragenergy.com/" target="_blank" rel="noopener noreferrer" className="flex items-center hover:opacity-80 transition-opacity">
              <div className="h-10 w-24">
                <img 
                  src="/narag.png" 
                  alt="Narag Energy" 
                  className="h-full w-full object-contain"
                />
              </div>
            </a>
          </div>
          
          <div className="hidden md:flex items-center gap-6">
            <Link 
              href="/" 
              className={`text-sm font-medium transition ${!isIncident ? "text-slate-900 border-l-2 border-orange-600 pl-2" : "text-slate-500 hover:text-slate-800 border-l-2 border-transparent pl-2"}`}
            >
              Contractor Request
            </Link>
            <Link 
              href="/incident" 
              className={`text-sm font-medium transition ${isIncident ? "text-slate-900 border-l-2 border-orange-600 pl-2" : "text-slate-500 hover:text-slate-800 border-l-2 border-transparent pl-2"}`}
            >
              Incident Report
            </Link>
          </div>
        </div>

        {/* Dynamic Title Area on the Right */}
        <div className="relative flex flex-1 items-center justify-end h-full">
          <AnimatePresence mode="wait">
            {!isIncident ? (
              <motion.div
                key="contractor-title"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className="text-right"
              >
                <h2 className="text-sm md:text-base font-semibold tracking-tight text-slate-900">
                  Contractor Pre-Screening Form
                </h2>
                <p className="text-xs text-slate-500 hidden sm:block">
                  Submit vendor details, compliance documents, and technical assessments.
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="incident-title"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className="text-right"
              >
                <h2 className="text-sm md:text-base font-semibold tracking-tight text-slate-900">
                  Incident Report Form
                </h2>
                <p className="text-xs text-slate-500 hidden sm:block">
                  Log an incident, near miss, accident, or hazard to notify safety teams immediately.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      {/* Mobile navigation row if needed, below the top row */}
      <div className="flex md:hidden border-t border-slate-100 bg-slate-50/50 px-4 py-2 gap-4">
        <Link 
          href="/" 
          className={`text-xs font-medium transition ${!isIncident ? "text-orange-600" : "text-slate-500"}`}
        >
          Contractor Request
        </Link>
        <Link 
          href="/incident" 
          className={`text-xs font-medium transition ${isIncident ? "text-orange-600" : "text-slate-500"}`}
        >
          Incident Report
        </Link>
      </div>
    </nav>
  );
}
