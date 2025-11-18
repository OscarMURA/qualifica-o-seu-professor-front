export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="text-center">
          <p className="text-sm text-slate-600">
            © {currentYear} Califica a tu Profesor. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
