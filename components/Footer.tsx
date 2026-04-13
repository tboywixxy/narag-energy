export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-200 bg-white py-12 px-4 md:px-8 lg:px-10 mt-auto">
      <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        <div className="flex flex-col space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 tracking-wide uppercase mb-1">Narag Energy Solutions</h3>
            <p className="text-sm text-slate-500 max-w-xs leading-relaxed">
              Serving our partners with unparalleled excellence.
            </p>
          </div>
          <p className="text-xs text-slate-400 mt-2 font-medium">
            &copy; Narag Energy Solutions Limited, {new Date().getFullYear()}
          </p>
        </div>

        <div className="flex flex-col space-y-2 text-sm text-slate-600">
          <h4 className="font-semibold text-slate-900 mb-2 border-b border-orange-500/20 pb-2 inline-block w-fit">
            Lagos - Nigeria
          </h4>
          <p>11 Remilade Opadokun Street</p>
          <p>Ikate Lekki Phase 1, Lagos</p>
          <p>Nigeria.</p>
          <div className="pt-2">
            <span className="block text-slate-500 text-xs uppercase tracking-wider mb-1">Email / Phone</span>
            <a href="mailto:info@naragenergy.com" className="text-orange-600 hover:text-orange-700 transition">info@naragenergy.com</a>
            <p className="mt-0.5">+234 (817) 357 4149, +234 906 692 3072</p>
          </div>
        </div>

        <div className="flex flex-col space-y-2 text-sm text-slate-600">
          <h4 className="font-semibold text-slate-900 mb-2 border-b border-orange-500/20 pb-2 inline-block w-fit">
            Calgary - Canada
          </h4>
          <p>128 West Coach Place SW</p>
          <p>Calgary, AB T3H 0M8</p>
          <div className="pt-2 mt-auto">
            <span className="block text-slate-500 text-xs uppercase tracking-wider mb-1">Email / Phone</span>
            <a href="mailto:info@naragenergy.com" className="text-orange-600 hover:text-orange-700 transition">info@naragenergy.com</a>
            <p className="mt-0.5">+1 587 707 4233</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
