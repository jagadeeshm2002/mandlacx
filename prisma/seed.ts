// prisma/seed.ts
import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

// Helper function to create timestamps for today's timeline
const createTimestamp = (timeString: string): Date => {
  const [hours, minutes] = timeString.split(":").map(Number);
  const today = new Date();
  today.setHours(hours, minutes, 0, 0);
  return today;
};

// Threat level mapping based on incident type
const getThreatLevel = (type: string): number => {
  const threatMap: { [key: string]: number } = {
    gun: 5, // Critical
    blacklisted: 5, // Critical
    intrusion: 5, // Critical
    unauthorised: 4, // High
    aggressive: 4, // High
    shoplifting: 4, // High
    suspicious: 3, // Medium
    face: 3, // Medium
    multiple: 3, // Medium
    abandoned: 3, // Medium
    tailgating: 3, // Medium
    mask: 3, // Medium
    "face-not-recognized": 2, // Low-Medium
    loitering: 2, // Low-Medium
    traffic: 1, // Low
  };
  return threatMap[type] || 3;
};

async function main() {
  console.log(" Starting database seed...");

  // Clear existing data
  console.log("  Clearing existing data...");
  await prisma.incident.deleteMany();
  await prisma.camera.deleteMany();

  // Create cameras first
  console.log(" Creating cameras...");
  const cameras = await Promise.all([
    prisma.camera.create({
      data: {
        name: "Camera - 01",
        location: "Main Building Entrance",
        liveStreamUrl: "/videos/camara2.mp4",
      },
    }),
    prisma.camera.create({
      data: {
        name: "Camera - 02",
        location: "North Side Corridor",
        liveStreamUrl: "/videos/camara1.mp4",
      },
    }),
    prisma.camera.create({
      data: {
        name: "Camera - 03",
        location: "Ground Floor Lobby",
        liveStreamUrl: "/videos/camara3.mp4",
      },
    }),
    prisma.camera.create({
      data: {
        name: "Camera - 04",
        location: "Retail Area",
        liveStreamUrl: "/videos/camara2.mp4",
      },
    }),
    prisma.camera.create({
      data: {
        name: "Camera - 05",
        location: "Reception Desk",
        liveStreamUrl: "/videos/camara1.mp4",
      },
    }),
    prisma.camera.create({
      data: {
        name: "Camera - 06",
        location: "Storage/Back Area",
        liveStreamUrl: "/videos/camara2.mp4",
      },
    }),
  ]);

  console.log(`✅ Created ${cameras.length} cameras`);

  // Event data matching your timeline structure
  const eventRows = [
    {
      cameraIndex: 0, // Camera - 01
      events: [
        {
          type: "unauthorised",
          tsStart: "00:05",
          tsEnd: "00:07",
        },
        {
          type: "face",
          tsStart: "01:10",
          tsEnd: "01:12",
        },
        {
          type: "multiple",
          tsStart: "02:15",
          tsEnd: "02:17",
        },
        {
          type: "gun",
          tsStart: "03:20",
          tsEnd: "03:22",
        },
        {
          type: "unauthorised",
          tsStart: "04:25",
          tsEnd: "04:27",
        },
      ],
    },
    {
      cameraIndex: 1, // Camera - 02
      events: [
        {
          type: "unauthorised",
          tsStart: "05:30",
          tsEnd: "05:32",
        },
        {
          type: "face",
          tsStart: "06:35",
          tsEnd: "06:37",
        },
        {
          type: "aggressive",
          tsStart: "06:35",
          tsEnd: "06:37",
        },
        {
          type: "loitering",
          tsStart: "07:40",
          tsEnd: "07:42",
        },
      ],
    },
    {
      cameraIndex: 2, // Camera - 03
      events: [
        {
          type: "traffic",
          tsStart: "08:00",
          tsEnd: "08:02",
        },
        {
          type: "unauthorised",
          tsStart: "09:05",
          tsEnd: "09:07",
        },
        {
          type: "blacklisted",
          tsStart: "10:10",
          tsEnd: "10:12",
        },
        {
          type: "intrusion",
          tsStart: "11:15",
          tsEnd: "11:17",
        },
      ],
    },
    {
      cameraIndex: 3, // Camera - 04
      events: [
        {
          type: "suspicious",
          tsStart: "12:20",
          tsEnd: "12:22",
        },
        {
          type: "abandoned",
          tsStart: "13:25",
          tsEnd: "13:27",
        },
        {
          type: "shoplifting",
          tsStart: "14:30",
          tsEnd: "14:32",
        },
        {
          type: "shoplifting",
          tsStart: "14:30",
          tsEnd: "14:32",
        },
        {
          type: "shoplifting",
          tsStart: "14:30",
          tsEnd: "14:32",
        },
        {
          type: "shoplifting",
          tsStart: "14:30",
          tsEnd: "14:32",
        },
      ],
    },
    {
      cameraIndex: 4, // Camera - 05
      events: [
        {
          type: "gun",
          tsStart: "15:35",
          tsEnd: "15:37",
        },
        {
          type: "face",
          tsStart: "16:40",
          tsEnd: "16:42",
        },
        {
          type: "unauthorised",
          tsStart: "17:45",
          tsEnd: "17:47",
        },
        {
          type: "tailgating",
          tsStart: "18:50",
          tsEnd: "18:52",
        },
      ],
    },
    {
      cameraIndex: 5, // Camera - 06
      events: [
        {
          type: "mask",
          tsStart: "19:55",
          tsEnd: "19:57",
        },
        {
          type: "face-not-recognized",
          tsStart: "20:00",
          tsEnd: "20:02",
        },
        {
          type: "unauthorised",
          tsStart: "21:05",
          tsEnd: "21:07",
        },
        {
          type: "gun",
          tsStart: "21:05",
          tsEnd: "21:07",
        },
        {
          type: "aggressive",
          tsStart: "22:10",
          tsEnd: "22:12",
        },
      ],
    },
  ];

  // Create incidents
  console.log("🚨 Creating incidents...");
  let totalIncidents = 0;

  for (const row of eventRows) {
    const camera = cameras[row.cameraIndex];

    for (let i = 0; i < row.events.length; i++) {
      const event = row.events[i];

      await prisma.incident.create({
        data: {
          cameraId: camera.id,
          type: event.type,
          threatLevel: getThreatLevel(event.type),
          tsStart: createTimestamp(event.tsStart),
          tsEnd: createTimestamp(event.tsEnd),
          thumbnailUrl: `/incident/image${
            Math.floor(Math.random() * 3) + 1
          }.jpg`,
          resolved: Math.random() > 0.7, // 30% chance of being resolved
        },
      });

      totalIncidents++;
    }
  }

  console.log(` Created ${totalIncidents} incidents`);

  // Verify the seeded data
  console.log("🔍 Verifying seeded data...");
  const cameraCount = await prisma.camera.count();
  const incidentCount = await prisma.incident.count();

  console.log(
    `📊 Final count: ${cameraCount} cameras, ${incidentCount} incidents`
  );

  // Show incidents by camera
  const camerasWithIncidents = await prisma.camera.findMany({
    include: {
      incidents: {
        orderBy: { tsStart: "asc" },
      },
    },
  });

  console.log("Incidents per camera:");
  camerasWithIncidents.forEach((camera) => {
    console.log(
      `  ${camera.name} (${camera.location}): ${camera.incidents.length} incidents`
    );
  });

  console.log("Database seeding completed");
}

main()
  .catch((e) => {
    console.error("❌ Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
