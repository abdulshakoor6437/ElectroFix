import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding ElectroFix database...");

  const services = [
    {
      serviceName: "Wiring & Short Circuit Fault Finding",
      description:
        "Struggling with tripping breakers, flickering lights, or dead sockets? Shakoor diagnoses and fixes electrical short circuits quickly and safely.",
      imageUrl: null,
      priceInternal: 1500,
      sortOrder: 1,
    },
    {
      serviceName: "DB Board & Circuit Breaker Repair",
      description:
        "Distribution board repairs, main switch replacements, breaker installs, and surge protection for residential and commercial premises in Rawalpindi.",
      imageUrl: null,
      priceInternal: 2500,
      sortOrder: 2,
    },
    {
      serviceName: "Ceiling Fan, Chandelier & Light Fixtures",
      description:
        "Professional installation and wiring for ceiling fans, fancy lights, SMD panel lights, chandeliers, and outdoor security lighting.",
      imageUrl: null,
      priceInternal: 800,
      sortOrder: 3,
    },
    {
      serviceName: "Inverter, UPS & Solar Backup Wiring",
      description:
        "Complete wiring and setup for home UPS, hybrid solar inverters, and battery bank connections for uninterrupted power backup.",
      imageUrl: null,
      priceInternal: 3000,
      sortOrder: 4,
    },
    {
      serviceName: "AC Points & Heavy Power Plugs",
      description:
        "Dedicated electrical wiring, breakers, and heavy-duty socket outlets for Air Conditioners, water heaters, and high-load appliances.",
      imageUrl: null,
      priceInternal: 1200,
      sortOrder: 5,
    },
    {
      serviceName: "Complete House / Shop Rewiring",
      description:
        "Full house electrical conduit wiring, switchboard fitting, earthing system setup, and safety inspection for new builds or renovations.",
      imageUrl: null,
      priceInternal: 8000,
      sortOrder: 6,
    },
  ];

  for (const service of services) {
    await prisma.service.upsert({
      where: { id: services.indexOf(service) + 1 },
      update: service,
      create: service,
    });
  }

  console.log(`✅ Seeded ${services.length} services`);
  console.log("✅ Seed complete");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
