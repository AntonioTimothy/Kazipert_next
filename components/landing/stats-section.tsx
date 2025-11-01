export function StatsSection() {
  const stats = [
    { value: "10,000+", label: "Active Workers" },
    { value: "5,000+", label: "Employers" },
    { value: "98%", label: "Success Rate" },
    { value: "50+", label: "Partner Services" },
  ]

  return (
    <section className="border-y border-border bg-muted/30 py-12">
      <div className="container">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="mb-2 text-4xl font-bold text-primary md:text-5xl">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
