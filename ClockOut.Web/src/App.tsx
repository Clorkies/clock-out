function Box({ className = '' }: { className?: string }) {
  return (
    <div className={`rounded-xl border border-slate-200 bg-white ${className}`} />
  )
}

function App() {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-4 md:px-6 md:py-6">
        <header className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4">
          <Box className="h-12" />
          <Box className="h-12" />
          <Box className="h-12 md:col-span-2" />
        </header>

        <div className="grid flex-1 gap-4 lg:grid-cols-[16rem_1fr]">
          <aside className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4">
            <Box className="h-8" />
            <Box className="h-8" />
            <Box className="h-8" />
            <Box className="h-8" />
            <Box className="mt-4 h-24" />
          </aside>

          <main className="space-y-4">
            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <Box className="h-28" />
              <Box className="h-28" />
              <Box className="h-28 md:col-span-2 xl:col-span-1" />
            </section>

            <section className="grid gap-4 xl:grid-cols-3">
              <Box className="h-72 xl:col-span-2" />
              <div className="space-y-4">
                <Box className="h-36" />
                <Box className="h-36" />
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4">
                <Box className="h-8" />
                <Box className="h-8" />
                <Box className="h-8" />
                <Box className="h-8" />
              </div>
              <div className="space-y-3">
                <Box className="h-12" />
                <Box className="h-12" />
                <Box className="h-12" />
                <Box className="h-12" />
              </div>
            </section>
          </main>
        </div>

        <footer className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
          <Box className="h-10" />
          <Box className="h-10" />
          <Box className="h-10" />
          <Box className="h-10" />
        </footer>
      </div>
    </div>
  )
}

export default App
