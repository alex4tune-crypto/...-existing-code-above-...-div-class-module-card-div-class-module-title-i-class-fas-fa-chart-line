import { db } from "./index";
import { sectors, users } from "./schema";
import { eq } from "drizzle-orm";

export async function seedDatabase() {
  console.log("🌱 Seeding database...");

  // Check if sectors already exist
  const existingSectors = await db.select().from(sectors);
  
  if (existingSectors.length === 0) {
    console.log("📊 Creating industry sectors...");
    
    const sectorData = [
      {
        id: "sector-retail",
        name: "Retail",
        slug: "retail",
        description: "Retail sector analysis, including supermarkets, shops, and e-commerce",
        icon: "🛒",
        isActive: true,
      },
      {
        id: "sector-telecom",
        name: "Telecom",
        slug: "telecom",
        description: "Telecommunications sector including MTN, Airtel, and internet providers",
        icon: "📱",
        isActive: true,
      },
      {
        id: "sector-finance",
        name: "Finance",
        slug: "finance",
        description: "Financial services including banking, insurance, and microfinance",
        icon: "🏦",
        isActive: true,
      },
      {
        id: "sector-agriculture",
        name: "Agriculture",
        slug: "agriculture",
        description: "Agricultural sector including crops, livestock, and agribusiness",
        icon: "🌾",
        isActive: true,
      },
    ];

    await db.insert(sectors).values(sectorData);
    console.log("✅ Sectors created successfully");
  } else {
    console.log("📊 Sectors already exist, skipping...");
  }

  // Create a demo admin user (password: demo123)
  const existingUsers = await db.select().from(users).where(eq(users.email, "admin@ugandainsights.com"));
  
  if (existingUsers.length === 0) {
    console.log("👤 Creating demo admin user...");
    
    // In production, use bcrypt.hash() for proper hashing
    await db.insert(users).values({
      id: "user-admin",
      email: "admin@ugandainsights.com",
      password: "$2a$10$demo123hashed", // demo123
      name: "Admin User",
      role: "admin",
      subscriptionTier: "pro",
      subscriptionStatus: "active",
      emailVerified: true,
    });
    console.log("✅ Demo user created: admin@ugandainsights.com / demo123");
  }

  console.log("🌱 Seeding complete!");
}

// Run seed if called directly
seedDatabase().catch(console.error);
