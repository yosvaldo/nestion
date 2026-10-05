import { prisma } from "../src/libs/prisma.client";
import { Role, OrderStatus } from "../src/generated/prisma/client";

const FALLBACK_CITIES = ["SURABAYA", "MALANG", "JAKARTA", "BANDUNG", "BALI"];

async function getCities(): Promise<string[]> {
  try {
    const response = await fetch("https://www.emsifa.com/api-wilayah-indonesia/api/regencies/35.json");
    if (!response.ok) throw new Error("API failed");
    const data = await response.json();
    return data.map((item: { name: string }) => item.name);
  } catch (error) {
    console.log("Failed to fetch cities from API, using fallback.");
    return FALLBACK_CITIES;
  }
}

async function main() {
  console.log("Seeding database...");

  const dummyPassword = "$2b$10$X7m6L8w1y6f2pW9M.1hE5.2Q5qK0J9d1z1x3/wJ7m6L8w1y6f2pW9M";
  
  const tenant = await prisma.user.upsert({
    where: { email: "tenant@nestion.com" },
    update: {},
    create: {
      email: "tenant@nestion.com",
      password: dummyPassword,
      fullName: "Nestion Tenant",
      role: Role.TENANT,
      isVerified: true,
    },
  });

  const buyer = await prisma.user.upsert({
    where: { email: "user@nestion.com" },
    update: {},
    create: {
      email: "user@nestion.com",
      password: dummyPassword,
      fullName: "Nestion User",
      role: Role.USER,
      isVerified: true,
    },
  });

  const categoryNames = ["Hotel", "Villa", "Apartment"];
  const categories = await Promise.all(
    categoryNames.map((name) =>
      prisma.category.upsert({
        where: { name },
        update: {},
        create: { name },
      })
    )
  );

  const cities = await getCities();
  const properties = [];

  console.log("Creating 30 Properties with 2 Rooms each...");
  for (let i = 1; i <= 30; i++) {
    const randomCity = cities[Math.floor(Math.random() * cities.length)];
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    
    const property = await prisma.property.create({
      data: {
        tenantId: tenant.id,
        categoryId: randomCategory.id,
        name: `${randomCategory.name} ${randomCity} ${i}`,
        city: randomCity,
        address: `Jl. Raya ${randomCity} No. ${i}`,
        description: `This is a beautiful ${randomCategory.name} located in the heart of ${randomCity}. Perfect for your stay.`,
        pictures: {
          create: [{ pictureUrl: `https://placehold.co/800x600?text=${randomCategory.name}+${i}` }],
        },
        rooms: {
          create: [
            { name: "Standard Room", description: "Cozy standard room", basePrice: 300000, guestCapacity: 2 },
            { name: "Deluxe Room", description: "Spacious deluxe room", basePrice: 750000, guestCapacity: 4 },
          ],
        },
      },
      include: { rooms: true },
    });
    properties.push(property);
  }

  console.log("Creating 30 Transactions...");
  const statuses = [
    OrderStatus.DIPROSES,
    OrderStatus.MENUNGGU_PEMBAYARAN,
    OrderStatus.MENUNGGU_KONFIRMASI_PEMBAYARAN,
    OrderStatus.DIBATALKAN
  ];

  for (let i = 0; i < 30; i++) {
    const property = properties[i];
    const room = property.rooms[0];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    
    const checkIn = new Date();
    checkIn.setDate(checkIn.getDate() + (i % 10));
    const checkOut = new Date(checkIn);
    checkOut.setDate(checkIn.getDate() + 1);

    await prisma.order.create({
      data: {
        orderNumber: `ORD-${Date.now()}-${i}`,
        userId: buyer.id,
        roomId: room.id,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        totalPrice: room.basePrice,
        status: randomStatus,
        paymentExpiresAt: new Date(Date.now() + 60 * 60 * 1000),
        paymentProofUrl: randomStatus === OrderStatus.MENUNGGU_KONFIRMASI_PEMBAYARAN || randomStatus === OrderStatus.DIPROSES 
          ? "https://placehold.co/400x600?text=Payment+Proof" 
          : null,
      },
    });
  }

  console.log("Seeding finished successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });