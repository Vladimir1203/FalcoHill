export default function Footer() {
  return (
    <footer className="bg-primary-dark text-white py-12 border-t border-white/5">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col items-center md:items-start gap-2">
            <img
              src="logo.png"
              alt="Tik Invest"
              className="h-16 w-auto filter brightness-0 invert opacity-80"
            />
          </div>

          <div className="text-center md:text-right">
            <p className="text-slate-400 mb-2 font-light">Savremeni stambeni objekat - Raška</p>
            <p className="text-sm text-slate-600 font-light">
              © {new Date().getFullYear()} Tik Invest. Sva prava zadržana.
            </p>
          </div>
        </div>

        <div className="border-t border-white/5 mt-8 pt-8 text-center">
          <p className="text-xs text-slate-600 font-light">
            Dizajn i razvoj: Tik Invest Tim
          </p>
        </div>
      </div>
    </footer>
  );
}
