import { prisma } from "../src/libs/prisma.client";
import { OrderStatus } from "../src/generated/prisma/client";

const propertiesData = [
  // A. KABUPATEN BOJONEGORO
  { city: "KABUPATEN BOJONEGORO", name: "Kayangan Residence", category: "Apartment", desc: "Modern apartment with a peaceful city atmosphere.",
    rooms: [{ name: "Studio Comfort", desc: "Cozy studio with practical living space.", basePrice: 250000 }, { name: "Deluxe Apartment", desc: "Spacious apartment with a separate lounge.", basePrice: 375000 }],
    images: ["https://res.cloudinary.com/jkqcg6ur/image/upload/v1791777461/prop1a_rbxgot.jpg", "https://res.cloudinary.com/jkqcg6ur/image/upload/v1791777462/prop1b_vtzlql.jpg"] },
  { city: "KABUPATEN BOJONEGORO", name: "Bengawan Heritage Hotel", category: "Hotel", desc: "Comfortable hotel inspired by local heritage.",
    rooms: [{ name: "Superior Room", desc: "Comfortable room with essential modern amenities.", basePrice: 300000 }, { name: "Executive Room", desc: "Elegant room with extra space and comfort.", basePrice: 450000 }],
    images: ["https://res.cloudinary.com/jkqcg6ur/image/upload/v1791777496/prop2a_sqnof7.jpg", "https://res.cloudinary.com/jkqcg6ur/image/upload/v1791777517/prop2b_fnzmzw.jpg"] },
  { city: "KABUPATEN BOJONEGORO", name: "Alas Asri Villa", category: "Villa", desc: "Private villa surrounded by lush tropical greenery.",
    rooms: [{ name: "Garden Suite", desc: "Relaxing suite with views of the garden.", basePrice: 400000 }, { name: "Family Suite", desc: "Spacious suite ideal for a family getaway.", basePrice: 600000 }],
    images: ["https://res.cloudinary.com/jkqcg6ur/image/upload/v1791777518/prop3a_qvxbyx.jpg", "https://res.cloudinary.com/jkqcg6ur/image/upload/v1791777518/prop3b_xflkvz.jpg"] },
  { city: "KABUPATEN BOJONEGORO", name: "Rajawali Business Hotel", category: "Hotel", desc: "Practical accommodation for business and leisure.",
    rooms: [{ name: "Business Twin", desc: "Functional twin room for business travelers.", basePrice: 275000 }, { name: "Business King", desc: "King room with a comfortable work area.", basePrice: 425000 }],
    images: ["https://res.cloudinary.com/jkqcg6ur/image/upload/v1791777519/prop4a_qaiywj.jpg", "https://res.cloudinary.com/jkqcg6ur/image/upload/v1791777519/prop4b_lv2imz.jpg"] },
  { city: "KABUPATEN BOJONEGORO", name: "Sumber Rejeki Villa", category: "Villa", desc: "Serene private retreat for a relaxing escape.",
    rooms: [{ name: "Classic Retreat", desc: "Simple private room with a cozy interior.", basePrice: 350000 }, { name: "Premium Retreat", desc: "Spacious private room with upgraded furnishings.", basePrice: 525000 }],
    images: ["https://res.cloudinary.com/jkqcg6ur/image/upload/v1791777520/prop5a_dfin4e.jpg", "https://res.cloudinary.com/jkqcg6ur/image/upload/v1791777521/prop5b_gznh9c.jpg"] },

  // B. KOTA SURABAYA
  { city: "KOTA SURABAYA", name: "Tunjungan City Suites", category: "Apartment", desc: "Contemporary suites near the bustling city center.",
    rooms: [{ name: "Urban Studio", desc: "Compact studio designed for city explorers.", basePrice: 350000 }, { name: "Premier Suite", desc: "Refined suite with extra living space.", basePrice: 500000 }],
    images: ["https://res.cloudinary.com/jkqcg6ur/image/upload/v1791777522/prop6a_npyjkn.jpg", "https://res.cloudinary.com/jkqcg6ur/image/upload/v1791777522/prop6b_jswdmm.jpg"] },
  { city: "KOTA SURABAYA", name: "Pahlawan Grand Hotel", category: "Hotel", desc: "Welcoming city hotel with contemporary comforts.",
    rooms: [{ name: "Classic Double", desc: "Inviting double room with modern essentials.", basePrice: 400000 }, { name: "Grand Deluxe", desc: "Upscale room with generous space and comfort.", basePrice: 650000 }],
    images: ["https://res.cloudinary.com/jkqcg6ur/image/upload/v1791777523/prop7a_fc2cnc.jpg", "https://res.cloudinary.com/jkqcg6ur/image/upload/v1791777524/prop7b_hb4bd8.jpg"] },
  { city: "KOTA SURABAYA", name: "Kenjeran Coastal Villa", category: "Villa", desc: "Private villa offering a refreshing coastal escape.",
    rooms: [{ name: "Coastal Room", desc: "Airy room with a relaxed coastal atmosphere.", basePrice: 500000 }, { name: "Ocean Family Room", desc: "Spacious room for a comfortable family stay.", basePrice: 750000 }],
    images: ["https://res.cloudinary.com/jkqcg6ur/image/upload/v1791777525/prop8a_a2n5wq.jpg", "https://res.cloudinary.com/jkqcg6ur/image/upload/v1791777525/prop8b_ctwsnz.jpg"] },
  { city: "KOTA SURABAYA", name: "Darmo Urban Living", category: "Apartment", desc: "Stylish apartment for convenient urban living.",
    rooms: [{ name: "Smart Studio", desc: "Efficient studio with a modern minimalist layout.", basePrice: 325000 }, { name: "Urban Two-Room", desc: "Two-room layout suited for longer stays.", basePrice: 475000 }],
    images: ["https://res.cloudinary.com/jkqcg6ur/image/upload/v1791777526/prop9a_khrjen.jpg", "https://res.cloudinary.com/jkqcg6ur/image/upload/v1791777526/prop9b_gu5wvr.jpg"] },
  { city: "KOTA SURABAYA", name: "Surabaya Heritage Inn", category: "Hotel", desc: "Boutique hotel blending heritage with modern comfort.",
    rooms: [{ name: "Heritage Twin", desc: "Classic twin room with warm wooden accents.", basePrice: 375000 }, { name: "Heritage King", desc: "Elegant king room with refined furnishings.", basePrice: 550000 }],
    images: ["https://res.cloudinary.com/jkqcg6ur/image/upload/v1791777527/prop10a_q4qzvy.jpg", "https://res.cloudinary.com/jkqcg6ur/image/upload/v1791777528/prop10b_aosked.jpg"] },

  // C. KOTA MEDAN
  { city: "KOTA MEDAN", name: "Merdeka Urban Apartments", category: "Apartment", desc: "Modern apartments for comfortable city stays.",
    rooms: [{ name: "Studio Living", desc: "Compact studio with functional furnishings.", basePrice: 300000 }, { name: "Executive Living", desc: "Spacious apartment with a separate lounge.", basePrice: 450000 }],
    images: ["https://res.cloudinary.com/jkqcg6ur/image/upload/v1791777528/prop11a_yze3bf.jpg", "https://res.cloudinary.com/jkqcg6ur/image/upload/v1791777529/prop11b_bpxkas.jpg"] },
  { city: "KOTA MEDAN", name: "Kesawan Premier Hotel", category: "Hotel", desc: "Refined hotel near Medan's historic district.",
    rooms: [{ name: "Superior Queen", desc: "Comfortable queen room with modern amenities.", basePrice: 350000 }, { name: "Premier King", desc: "Spacious king room with upgraded comforts.", basePrice: 525000 }],
    images: ["https://res.cloudinary.com/jkqcg6ur/image/upload/v1791777530/prop12a_w9hhxm.jpg", "https://res.cloudinary.com/jkqcg6ur/image/upload/v1791777530/prop12b_vg5qca.jpg"] },

  // D. KOTA DENPASAR
  { city: "KOTA DENPASAR", name: "Renon Garden Apartments", category: "Apartment", desc: "Peaceful apartments surrounded by tropical greenery.",
    rooms: [{ name: "Garden Studio", desc: "Bright studio with a calming garden atmosphere.", basePrice: 325000 }, { name: "Garden Deluxe", desc: "Larger apartment with a relaxed living area.", basePrice: 475000 }],
    images: ["https://res.cloudinary.com/jkqcg6ur/image/upload/v1791777531/prop13a_kmryyf.jpg", "https://res.cloudinary.com/jkqcg6ur/image/upload/v1791777532/prop13b_iju2iq.jpg"] },
  { city: "KOTA DENPASAR", name: "Sanur Palm Villa", category: "Villa", desc: "Tropical villa with a tranquil private courtyard.",
    rooms: [{ name: "Palm Suite", desc: "Relaxing suite surrounded by tropical greenery.", basePrice: 550000 }, { name: "Poolside Suite", desc: "Spacious suite beside a private swimming pool.", basePrice: 850000 }],
    images: ["https://res.cloudinary.com/jkqcg6ur/image/upload/v1791777532/prop14a_z1wqt9.jpg", "https://res.cloudinary.com/jkqcg6ur/image/upload/v1791777533/prop14b_ercykj.jpg"] },

  // E. KOTA MATARAM
  { city: "KOTA MATARAM", name: "Mandalika City Hotel", category: "Hotel", desc: "Comfortable hotel for exploring the island city.",
    rooms: [{ name: "Standard Twin", desc: "Practical twin room for a pleasant stay.", basePrice: 275000 }, { name: "Deluxe Double", desc: "Spacious double room with added comfort.", basePrice: 425000 }],
    images: ["https://res.cloudinary.com/jkqcg6ur/image/upload/v1791777534/prop15a_sjhk1f.jpg", "https://res.cloudinary.com/jkqcg6ur/image/upload/v1791777535/prop15b_y6jwgd.jpg"] },
  { city: "KOTA MATARAM", name: "Rinjani Breeze Villa", category: "Villa", desc: "Relaxing villa inspired by Lombok's natural beauty.",
    rooms: [{ name: "Breeze Suite", desc: "Airy suite with a light tropical interior.", basePrice: 450000 }, { name: "Mountain Suite", desc: "Spacious suite designed for restful escapes.", basePrice: 675000 }],
    images: ["https://res.cloudinary.com/jkqcg6ur/image/upload/v1791777535/prop16a_vp1pkn.jpg", "https://res.cloudinary.com/jkqcg6ur/image/upload/v1791777536/prop16b_pac4iq.jpg"] },

  // F. KOTA SAMARINDA
  { city: "KOTA SAMARINDA", name: "Mahakam Riverside Apartments", category: "Apartment", desc: "Contemporary apartments near the riverside district.",
    rooms: [{ name: "Riverside Studio", desc: "Compact studio with an open, airy layout.", basePrice: 300000 }, { name: "Riverside Suite", desc: "Spacious suite with a separate lounge area.", basePrice: 450000 }],
    images: ["https://res.cloudinary.com/jkqcg6ur/image/upload/v1791777537/prop17a_hg6ikb.jpg", "https://res.cloudinary.com/jkqcg6ur/image/upload/v1791777537/prop17b_o9gzor.jpg"] },
  { city: "KOTA SAMARINDA", name: "Borneo Central Hotel", category: "Hotel", desc: "Convenient city hotel for business and leisure.",
    rooms: [{ name: "Business Twin", desc: "Practical room with comfortable twin beds.", basePrice: 325000 }, { name: "Premier Double", desc: "Refined double room with extra amenities.", basePrice: 475000 }],
    images: ["https://res.cloudinary.com/jkqcg6ur/image/upload/v1791777538/prop18a_aopf59.jpg", "https://res.cloudinary.com/jkqcg6ur/image/upload/v1791777539/prop18b_yzicvu.jpg"] },

  // G. KOTA MAKASSAR
  { city: "KOTA MAKASSAR", name: "Losari Urban Apartments", category: "Apartment", desc: "Stylish apartments close to Makassar's urban attractions.",
    rooms: [{ name: "City Studio", desc: "Modern studio with practical living essentials.", basePrice: 350000 }, { name: "City Residence", desc: "Spacious apartment with separate living space.", basePrice: 500000 }],
    images: ["https://res.cloudinary.com/jkqcg6ur/image/upload/v1791777539/prop19a_hh7kvk.jpg", "https://res.cloudinary.com/jkqcg6ur/image/upload/v1791777540/prop19b_gmkyib.jpg"] },
  { city: "KOTA MAKASSAR", name: "Akkarena Seaside Villa", category: "Villa", desc: "Private villa with a refreshing seaside atmosphere.",
    rooms: [{ name: "Seaside Suite", desc: "Bright suite with a breezy coastal feel.", basePrice: 500000 }, { name: "Family Villa Suite", desc: "Spacious suite for families and small groups.", basePrice: 750000 }],
    images: ["https://res.cloudinary.com/jkqcg6ur/image/upload/v1791777541/prop20a_uvkuta.jpg", "https://res.cloudinary.com/jkqcg6ur/image/upload/v1791777541/prop20b_y2swqi.jpg"] },

  // H. KOTA KUPANG
  { city: "KOTA KUPANG", name: "Timor Bay Hotel", category: "Hotel", desc: "Welcoming hotel with a relaxed island atmosphere.",
    rooms: [{ name: "Island Twin", desc: "Comfortable twin room with simple furnishings.", basePrice: 300000 }, { name: "Bay Deluxe", desc: "Spacious room with upgraded modern amenities.", basePrice: 450000 }],
    images: ["https://res.cloudinary.com/jkqcg6ur/image/upload/v1791777542/prop21a_cevypr.jpg", "https://res.cloudinary.com/jkqcg6ur/image/upload/v1791777543/prop21b_ym4ofe.jpg"] },
  { city: "KOTA KUPANG", name: "Nusa Cendana Villa", category: "Villa", desc: "Peaceful private villa inspired by island living.",
    rooms: [{ name: "Cendana Suite", desc: "Cozy suite with warm natural furnishings.", basePrice: 400000 }, { name: "Sunset Suite", desc: "Spacious suite designed for relaxing evenings.", basePrice: 600000 }],
    images: ["https://res.cloudinary.com/jkqcg6ur/image/upload/v1791777544/prop22a_qmkdcv.jpg", "https://res.cloudinary.com/jkqcg6ur/image/upload/v1791777544/prop22b_ix2adr.jpg"] },

  // I. KOTA AMBON
  { city: "KOTA AMBON", name: "Pattimura City Apartments", category: "Apartment", desc: "Convenient apartments for comfortable city living.",
    rooms: [{ name: "City Compact", desc: "Compact studio with essential modern furnishings.", basePrice: 275000 }, { name: "City Deluxe", desc: "Spacious apartment with a separate lounge area.", basePrice: 425000 }],
    images: ["https://res.cloudinary.com/jkqcg6ur/image/upload/v1791777545/prop23a_kyimca.jpg", "https://res.cloudinary.com/jkqcg6ur/image/upload/v1791777545/prop23b_ed0onv.jpg"] },
  { city: "KOTA AMBON", name: "Spice Island Hotel", category: "Hotel", desc: "Island-inspired hotel with warm welcoming interiors.",
    rooms: [{ name: "Spice Standard", desc: "Comfortable room with a clean modern design.", basePrice: 325000 }, { name: "Spice Premium", desc: "Elegant room with upgraded furnishings and space.", basePrice: 475000 }],
    images: ["https://res.cloudinary.com/jkqcg6ur/image/upload/v1791777546/prop24a_iclmvu.jpg", "https://res.cloudinary.com/jkqcg6ur/image/upload/v1791777547/prop24b_iewrhy.jpg"] },

  // J. KOTA JAYAPURA
  { city: "KOTA JAYAPURA", name: "Cycloop Heights Apartments", category: "Apartment", desc: "Modern apartments inspired by Papua's green highlands.",
    rooms: [{ name: "Highland Studio", desc: "Bright studio with an efficient layout.", basePrice: 350000 }, { name: "Highland Suite", desc: "Spacious suite with a separate living area.", basePrice: 525000 }],
    images: ["https://res.cloudinary.com/jkqcg6ur/image/upload/v1791777548/prop25a_mqcogq.jpg", "https://res.cloudinary.com/jkqcg6ur/image/upload/v1791777548/prop25b_sohjg9.jpg"] },
  { city: "KOTA JAYAPURA", name: "Hamadi Bay Villa", category: "Villa", desc: "Private villa with a peaceful coastal setting.",
    rooms: [{ name: "Bay Retreat", desc: "Relaxing room with a fresh coastal atmosphere.", basePrice: 475000 }, { name: "Bay Residence", desc: "Spacious suite for a comfortable private stay.", basePrice: 700000 }],
    images: ["https://res.cloudinary.com/jkqcg6ur/image/upload/v1791777549/prop26a_ppsnqb.jpg", "https://res.cloudinary.com/jkqcg6ur/image/upload/v1791777549/prop26b_ulfppx.jpg"] },

  // K. KOTA MALANG
  { city: "KOTA MALANG", name: "Ijen Boutique Hotel", category: "Hotel", desc: "Boutique hotel with a calm and elegant atmosphere.",
    rooms: [{ name: "Classic Queen", desc: "Cozy queen room with warm interior details.", basePrice: 350000 }, { name: "Ijen Deluxe", desc: "Spacious deluxe room with refined furnishings.", basePrice: 525000 }],
    images: ["https://res.cloudinary.com/jkqcg6ur/image/upload/v1791777550/prop27a_defkwc.jpg", "https://res.cloudinary.com/jkqcg6ur/image/upload/v1791777551/prop27b_fdpukc.jpg"] },
  { city: "KOTA MALANG", name: "Arjuna Highland Villa", category: "Villa", desc: "Peaceful highland villa surrounded by lush gardens.",
    rooms: [{ name: "Mountain Suite", desc: "Cozy suite for a restful highland escape.", basePrice: 450000 }, { name: "Highland Family Suite", desc: "Spacious suite for a relaxing family retreat.", basePrice: 675000 }],
    images: ["https://res.cloudinary.com/jkqcg6ur/image/upload/v1791777552/prop28a_ibanci.jpg", "https://res.cloudinary.com/jkqcg6ur/image/upload/v1791777552/prop28b_battyo.jpg"] },

  // L. KOTA SEMARANG
  { city: "KOTA SEMARANG", name: "Simpang Lima City Apartments", category: "Apartment", desc: "Urban apartments near Semarang's central attractions.",
    rooms: [{ name: "Central Studio", desc: "Practical studio for convenient city stays.", basePrice: 325000 }, { name: "Central Suite", desc: "Spacious apartment with comfortable living space.", basePrice: 475000 }],
    images: ["https://res.cloudinary.com/jkqcg6ur/image/upload/v1791777553/prop29a_ufawbt.jpg", "https://res.cloudinary.com/jkqcg6ur/image/upload/v1791777554/prop29b_uof0dz.jpg"] },
  { city: "KOTA SEMARANG", name: "Candi Hills Villa", category: "Villa", desc: "Private villa with a tranquil hillside atmosphere.",
    rooms: [{ name: "Candi Garden Suite", desc: "Comfortable suite with a peaceful garden feel.", basePrice: 425000 }, { name: "Candi Grand Suite", desc: "Spacious suite with premium interior comforts.", basePrice: 650000 }],
    images: ["https://res.cloudinary.com/jkqcg6ur/image/upload/v1791777554/prop30a_yzomcs.jpg", "https://res.cloudinary.com/jkqcg6ur/image/upload/v1791777557/prop30b_orifpt.jpg"] }
];

async function main() {
  console.log("Fetching existing users and categories...");

  const user1 = await prisma.user.findUniqueOrThrow({ where: { email: "delivered+user1@resend.dev" } });
  const tenant1 = await prisma.user.findUniqueOrThrow({ where: { email: "delivered+user2@resend.dev" } });
  const user2 = await prisma.user.findUniqueOrThrow({ where: { email: "delivered+user3@resend.dev" } });
  const tenant2 = await prisma.user.findUniqueOrThrow({ where: { email: "delivered+user4@resend.dev" } });

  const categoryNames = ["Hotel", "Villa", "Apartment"];
  const categories = await Promise.all(
    categoryNames.map((name) => prisma.category.upsert({ where: { name }, update: {}, create: { name } }))
  );

  const getCategory = (name: string) => categories.find(c => c.name === name)!.id;

  await prisma.order.deleteMany();
  await prisma.property.deleteMany();

  console.log("Creating 30 Properties with Rooms and Images...");
  const createdProperties = [];
  
  for (let i = 0; i < propertiesData.length; i++) {
    const pData = propertiesData[i];
    const ownerId = i < 15 ? tenant1.id : tenant2.id;
    
    const property = await prisma.property.create({
      data: {
        tenantId: ownerId,
        categoryId: getCategory(pData.category),
        name: pData.name,
        city: pData.city,
        address: `Jl. Raya ${pData.city} No. ${i + 1}`,
        description: pData.desc,
        pictures: {
          create: pData.images.map(url => ({ pictureUrl: url }))
        },
        rooms: {
          create: pData.rooms.map(room => ({
            name: room.name,
            description: room.desc,
            basePrice: room.basePrice,
            guestCapacity: 2
          }))
        }
      },
      include: { rooms: true }
    });
    createdProperties.push(property);
  }

  console.log("Creating 30 Transactions (ALL DIPROSES) with Specific Dates...");
  
  const paymentProofUrl = "https://res.cloudinary.com/jkqcg6ur/image/upload/v1791777425/payment_yhwgsa.jpg";

  for (let i = 0; i < 30; i++) {
    const property = createdProperties[i];
    const room = property.rooms[0];
    
    const buyerId = i < 15 ? user1.id : user2.id;
    
    const monthIndexProcessed = Math.floor(i / 5) + 3; 
    const createdAt = new Date(2026, monthIndexProcessed, 15, 10, 0, 0);

    const monthIndexCheckIn = Math.floor(i / 10) + 9; 
    const checkIn = new Date(2026, monthIndexCheckIn, (i % 10) + 10, 14, 0, 0); 
    const checkOut = new Date(checkIn);
    checkOut.setDate(checkIn.getDate() + 1);

    await prisma.order.create({
      data: {
        orderNumber: `ORD-${Date.now()}-${i}`,
        userId: buyerId,
        roomId: room.id,
        createdAt: createdAt,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        totalPrice: room.basePrice,
        status: OrderStatus.DIPROSES,
        paymentExpiresAt: new Date(createdAt.getTime() + 60 * 60 * 1000),
        paymentProofUrl: paymentProofUrl,
        paymentProofUploadedAt: new Date(createdAt.getTime() + 30 * 60 * 1000)
      }
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