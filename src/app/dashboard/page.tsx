export default function DashboardPage() {
  return (
    <section className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Aquí irá el contenido principal del dashboard.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border bg-card p-4">
          <p className="text-sm text-muted-foreground">Métrica 1</p>
          <p className="text-2xl font-semibold">--</p>
        </div>

        <div className="rounded-xl border bg-card p-4">
          <p className="text-sm text-muted-foreground">Métrica 2</p>
          <p className="text-2xl font-semibold">--</p>
        </div>

        <div className="rounded-xl border bg-card p-4">
          <p className="text-sm text-muted-foreground">Métrica 3</p>
          <p className="text-2xl font-semibold">--</p>
        </div>
      </div>
    </section>
  );
}
