import Header from "@/src/components/header"
import LeadsTable from "@/src/components/lead-table"

export default function DashboardPage() {
  return (
    <main className="min-h-dvh bg-background text-foreground">
      <Header />
      <section className="container mx-auto px-4 py-6">
        <LeadsTable />
      </section>
    </main>
  )
}
