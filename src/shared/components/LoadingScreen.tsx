export function LoadingScreen({ message = 'Cargando…' }: { message?: string }) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4">
      <div
        className="h-10 w-10 animate-spin rounded-full border-2 border-teal-200 border-t-teal-600"
        aria-hidden
      />
      <p className="text-sm font-medium text-slate-600">{message}</p>
    </div>
  );
}
