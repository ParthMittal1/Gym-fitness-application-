/**
 * GYM FITNESS — Prisma Seed Script
 * Run via:  npx prisma db seed
 * Or:       npx tsx prisma/seed.ts
 *
 * Order matters for FK constraints:
 *   Plans → GymLocations → Exercises → WorkoutPlans → WorkoutExercises
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ─── Helpers ──────────────────────────────────────────────────────────────────
const j = (arr: string[]) => JSON.stringify(arr);
const slug = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

// =============================================================================
// 1. PLANS
// =============================================================================
const planData = [
  {
    name: "Silver",
    slug: "silver",
    price: 999,
    duration: 1,
    tier: "SILVER",
    description: "Perfect for beginners starting their fitness journey.",
    popular: false,
    active: true,
    features: j([
      "Access to home gym only",
      "Basic workout plans",
      "Locker room access",
      "Free fitness assessment",
      "Mobile app access",
      "24/7 workout library",
    ]),
  },
  {
    name: "Gold",
    slug: "gold",
    price: 1999,
    duration: 1,
    tier: "GOLD",
    description: "Our most popular plan — unlimited access across India.",
    popular: true,
    active: true,
    features: j([
      "All-India gym access (25+ locations)",
      "All Silver benefits",
      "Group fitness classes",
      "Nutrition tracking app",
      "2 guest passes per month",
      "Priority class booking",
      "Body composition analysis",
      "Access to swimming pool",
    ]),
  },
  {
    name: "Platinum",
    slug: "platinum",
    price: 3499,
    duration: 1,
    tier: "PLATINUM",
    description: "Elite performance with dedicated personal training.",
    popular: false,
    active: true,
    features: j([
      "All-India gym access (25+ locations)",
      "All Gold benefits",
      "4 personal trainer sessions/month",
      "Custom nutrition plan",
      "Monthly body composition scan",
      "Unlimited guest passes",
      "Dedicated locker",
      "Recovery & spa access",
      "Priority support",
    ]),
  },
];

// =============================================================================
// 2. GYM LOCATIONS (25 across major Indian cities)
// =============================================================================
const locationData = [
  // ── Mumbai ──────────────────────────────────────────────────────────────
  {
    name: "GYM Fitness – Bandra West",
    city: "Mumbai",
    state: "Maharashtra",
    address: "15, Linking Road, Bandra West, Mumbai 400050",
    phone: "+91-22-4001-1001",
    email: "bandra@gymfitness.app",
    lat: 19.0596, lng: 72.8295,
    amenities: j(["WiFi", "Pool", "Sauna", "Café", "Cardio Zone", "CrossFit", "Parking"]),
    timings: "Mon-Sat 5:30am-11pm · Sun 7am-9pm",
    rating: 4.8, active: true,
    imageUrl: "/locations/mumbai-bandra.jpg",
  },
  {
    name: "GYM Fitness – Andheri East",
    city: "Mumbai",
    state: "Maharashtra",
    address: "MIDC Road, Andheri East, Mumbai 400069",
    phone: "+91-22-4001-1002",
    email: "andheri@gymfitness.app",
    lat: 19.1136, lng: 72.8697,
    amenities: j(["WiFi", "Cardio Zone", "Group Classes", "Locker Room", "Parking"]),
    timings: "Mon-Sat 5am-11pm · Sun 7am-9pm",
    rating: 4.6, active: true,
    imageUrl: "/locations/mumbai-andheri.jpg",
  },
  {
    name: "GYM Fitness – Lower Parel",
    city: "Mumbai",
    state: "Maharashtra",
    address: "High Street Phoenix, Lower Parel, Mumbai 400013",
    phone: "+91-22-4001-1003",
    email: "lowerparel@gymfitness.app",
    lat: 18.9949, lng: 72.8307,
    amenities: j(["WiFi", "Pool", "Spa", "Café", "CrossFit", "Boxing Ring", "Valet Parking"]),
    timings: "Mon-Sun 5am-12am",
    rating: 4.9, active: true,
    imageUrl: "/locations/mumbai-lowerparel.jpg",
  },
  // ── Delhi / NCR ─────────────────────────────────────────────────────────
  {
    name: "GYM Fitness – Connaught Place",
    city: "Delhi",
    state: "Delhi",
    address: "N-Block, Connaught Place, New Delhi 110001",
    phone: "+91-11-4001-2001",
    email: "cp@gymfitness.app",
    lat: 28.6315, lng: 77.2167,
    amenities: j(["WiFi", "Cardio Zone", "Group Classes", "Juice Bar", "Locker Room"]),
    timings: "Mon-Sat 5:30am-11pm · Sun 7am-9pm",
    rating: 4.7, active: true,
    imageUrl: "/locations/delhi-cp.jpg",
  },
  {
    name: "GYM Fitness – Vasant Kunj",
    city: "Delhi",
    state: "Delhi",
    address: "DLF Promenade Mall, Vasant Kunj, New Delhi 110070",
    phone: "+91-11-4001-2002",
    email: "vasantkunj@gymfitness.app",
    lat: 28.5230, lng: 77.1559,
    amenities: j(["WiFi", "Pool", "Sauna", "Café", "Cardio Zone", "Yoga Studio", "Parking"]),
    timings: "Mon-Sun 5am-11pm",
    rating: 4.5, active: true,
    imageUrl: "/locations/delhi-vasantkunj.jpg",
  },
  // ── Gurugram ────────────────────────────────────────────────────────────
  {
    name: "GYM Fitness – Cyber City",
    city: "Gurugram",
    state: "Haryana",
    address: "Tower B, DLF Cyber City, Gurugram 122002",
    phone: "+91-124-4001-3001",
    email: "cybercity@gymfitness.app",
    lat: 28.4950, lng: 77.0890,
    amenities: j(["WiFi", "CrossFit", "Cardio Zone", "Café", "Shower Rooms", "Parking"]),
    timings: "Mon-Fri 5am-11pm · Sat-Sun 6am-10pm",
    rating: 4.8, active: true,
    imageUrl: "/locations/gurugram-cybercity.jpg",
  },
  {
    name: "GYM Fitness – Golf Course Road",
    city: "Gurugram",
    state: "Haryana",
    address: "South Point Mall, Golf Course Road, Gurugram 122001",
    phone: "+91-124-4001-3002",
    email: "golfcourse@gymfitness.app",
    lat: 28.4421, lng: 77.1026,
    amenities: j(["WiFi", "Pool", "Sauna", "Spa", "Café", "Group Classes", "Parking"]),
    timings: "Mon-Sun 5am-11pm",
    rating: 4.6, active: true,
    imageUrl: "/locations/gurugram-golfcourse.jpg",
  },
  // ── Bengaluru ───────────────────────────────────────────────────────────
  {
    name: "GYM Fitness – Indiranagar",
    city: "Bengaluru",
    state: "Karnataka",
    address: "100 Feet Road, Indiranagar, Bengaluru 560038",
    phone: "+91-80-4001-4001",
    email: "indiranagar@gymfitness.app",
    lat: 12.9784, lng: 77.6408,
    amenities: j(["WiFi", "CrossFit", "Boxing", "Juice Bar", "Cardio Zone", "Parking"]),
    timings: "Mon-Sat 5am-11pm · Sun 7am-9pm",
    rating: 4.9, active: true,
    imageUrl: "/locations/bengaluru-indiranagar.jpg",
  },
  {
    name: "GYM Fitness – Koramangala",
    city: "Bengaluru",
    state: "Karnataka",
    address: "Forum Mall, 80 Feet Road, Koramangala, Bengaluru 560034",
    phone: "+91-80-4001-4002",
    email: "koramangala@gymfitness.app",
    lat: 12.9279, lng: 77.6271,
    amenities: j(["WiFi", "Pool", "Yoga Studio", "Café", "Cardio Zone", "Sauna"]),
    timings: "Mon-Sun 5am-11pm",
    rating: 4.7, active: true,
    imageUrl: "/locations/bengaluru-koramangala.jpg",
  },
  {
    name: "GYM Fitness – Whitefield",
    city: "Bengaluru",
    state: "Karnataka",
    address: "Prestige Tech Park, Whitefield, Bengaluru 560066",
    phone: "+91-80-4001-4003",
    email: "whitefield@gymfitness.app",
    lat: 12.9698, lng: 77.7500,
    amenities: j(["WiFi", "Cardio Zone", "Group Classes", "Locker Room", "Shower Rooms"]),
    timings: "Mon-Fri 5:30am-11pm · Sat-Sun 6am-10pm",
    rating: 4.5, active: true,
    imageUrl: "/locations/bengaluru-whitefield.jpg",
  },
  // ── Pune ────────────────────────────────────────────────────────────────
  {
    name: "GYM Fitness – Baner",
    city: "Pune",
    state: "Maharashtra",
    address: "Baner-Pashan Link Road, Baner, Pune 411045",
    phone: "+91-20-4001-5001",
    email: "baner@gymfitness.app",
    lat: 18.5590, lng: 73.7868,
    amenities: j(["WiFi", "CrossFit", "Cardio Zone", "Café", "Parking"]),
    timings: "Mon-Sat 5am-11pm · Sun 7am-9pm",
    rating: 4.6, active: true,
    imageUrl: "/locations/pune-baner.jpg",
  },
  {
    name: "GYM Fitness – Viman Nagar",
    city: "Pune",
    state: "Maharashtra",
    address: "Phoenix Marketcity, Viman Nagar, Pune 411014",
    phone: "+91-20-4001-5002",
    email: "vimannagar@gymfitness.app",
    lat: 18.5679, lng: 73.9143,
    amenities: j(["WiFi", "Pool", "Yoga Studio", "Juice Bar", "Cardio Zone", "Sauna"]),
    timings: "Mon-Sun 5am-11pm",
    rating: 4.8, active: true,
    imageUrl: "/locations/pune-vimannagar.jpg",
  },
  // ── Hyderabad ───────────────────────────────────────────────────────────
  {
    name: "GYM Fitness – Banjara Hills",
    city: "Hyderabad",
    state: "Telangana",
    address: "Road No. 12, Banjara Hills, Hyderabad 500034",
    phone: "+91-40-4001-6001",
    email: "banjarahills@gymfitness.app",
    lat: 17.4126, lng: 78.4480,
    amenities: j(["WiFi", "Pool", "Sauna", "Café", "Cardio Zone", "Boxing", "Parking"]),
    timings: "Mon-Sun 5am-11pm",
    rating: 4.7, active: true,
    imageUrl: "/locations/hyderabad-banjarahills.jpg",
  },
  {
    name: "GYM Fitness – HITEC City",
    city: "Hyderabad",
    state: "Telangana",
    address: "Cyber Towers, HITEC City, Hyderabad 500081",
    phone: "+91-40-4001-6002",
    email: "hiteccity@gymfitness.app",
    lat: 17.4435, lng: 78.3772,
    amenities: j(["WiFi", "CrossFit", "Cardio Zone", "Juice Bar", "Shower Rooms"]),
    timings: "Mon-Fri 5am-11pm · Sat-Sun 6am-10pm",
    rating: 4.5, active: true,
    imageUrl: "/locations/hyderabad-hitec.jpg",
  },
  // ── Chennai ─────────────────────────────────────────────────────────────
  {
    name: "GYM Fitness – Anna Nagar",
    city: "Chennai",
    state: "Tamil Nadu",
    address: "2nd Avenue, Anna Nagar, Chennai 600040",
    phone: "+91-44-4001-7001",
    email: "annanagar@gymfitness.app",
    lat: 13.0850, lng: 80.2101,
    amenities: j(["WiFi", "Pool", "Yoga Studio", "Café", "Cardio Zone"]),
    timings: "Mon-Sat 5:30am-11pm · Sun 7am-9pm",
    rating: 4.6, active: true,
    imageUrl: "/locations/chennai-annanagar.jpg",
  },
  {
    name: "GYM Fitness – Velachery",
    city: "Chennai",
    state: "Tamil Nadu",
    address: "Phoenix MarketCity, Velachery, Chennai 600042",
    phone: "+91-44-4001-7002",
    email: "velachery@gymfitness.app",
    lat: 12.9815, lng: 80.2180,
    amenities: j(["WiFi", "CrossFit", "Cardio Zone", "Juice Bar", "Locker Room", "Parking"]),
    timings: "Mon-Sun 5am-11pm",
    rating: 4.4, active: true,
    imageUrl: "/locations/chennai-velachery.jpg",
  },
  // ── Ahmedabad ───────────────────────────────────────────────────────────
  {
    name: "GYM Fitness – SG Highway",
    city: "Ahmedabad",
    state: "Gujarat",
    address: "ISCON Mega Mall, SG Highway, Ahmedabad 380015",
    phone: "+91-79-4001-8001",
    email: "sghighway@gymfitness.app",
    lat: 23.0465, lng: 72.5074,
    amenities: j(["WiFi", "Pool", "Sauna", "Café", "Cardio Zone", "Group Classes"]),
    timings: "Mon-Sun 5am-11pm",
    rating: 4.5, active: true,
    imageUrl: "/locations/ahmedabad-sghighway.jpg",
  },
  {
    name: "GYM Fitness – Prahlad Nagar",
    city: "Ahmedabad",
    state: "Gujarat",
    address: "Shapath V, Prahlad Nagar, Ahmedabad 380015",
    phone: "+91-79-4001-8002",
    email: "prahladnagar@gymfitness.app",
    lat: 23.0252, lng: 72.5069,
    amenities: j(["WiFi", "CrossFit", "Cardio Zone", "Juice Bar", "Shower Rooms"]),
    timings: "Mon-Sat 5:30am-11pm · Sun 7am-9pm",
    rating: 4.3, active: true,
    imageUrl: "/locations/ahmedabad-prahladnagar.jpg",
  },
  // ── Kolkata ─────────────────────────────────────────────────────────────
  {
    name: "GYM Fitness – Salt Lake",
    city: "Kolkata",
    state: "West Bengal",
    address: "Sector V, Salt Lake City, Kolkata 700091",
    phone: "+91-33-4001-9001",
    email: "saltlake@gymfitness.app",
    lat: 22.5768, lng: 88.4342,
    amenities: j(["WiFi", "Cardio Zone", "Group Classes", "Juice Bar", "Locker Room"]),
    timings: "Mon-Sat 5:30am-11pm · Sun 7am-9pm",
    rating: 4.4, active: true,
    imageUrl: "/locations/kolkata-saltlake.jpg",
  },
  {
    name: "GYM Fitness – Park Street",
    city: "Kolkata",
    state: "West Bengal",
    address: "Stephen Court, Park Street, Kolkata 700016",
    phone: "+91-33-4001-9002",
    email: "parkstreet@gymfitness.app",
    lat: 22.5519, lng: 88.3521,
    amenities: j(["WiFi", "Pool", "Yoga Studio", "Café", "Cardio Zone", "Sauna"]),
    timings: "Mon-Sun 5am-11pm",
    rating: 4.6, active: true,
    imageUrl: "/locations/kolkata-parkstreet.jpg",
  },
  // ── Jaipur ──────────────────────────────────────────────────────────────
  {
    name: "GYM Fitness – Vaishali Nagar",
    city: "Jaipur",
    state: "Rajasthan",
    address: "Vaishali Nagar, Jaipur 302021",
    phone: "+91-141-4001-1101",
    email: "vaishali@gymfitness.app",
    lat: 26.9124, lng: 75.7318,
    amenities: j(["WiFi", "CrossFit", "Cardio Zone", "Juice Bar", "Parking"]),
    timings: "Mon-Sat 5am-11pm · Sun 7am-9pm",
    rating: 4.3, active: true,
    imageUrl: "/locations/jaipur-vaishali.jpg",
  },
  // ── Chandigarh ──────────────────────────────────────────────────────────
  {
    name: "GYM Fitness – Sector 17",
    city: "Chandigarh",
    state: "Chandigarh",
    address: "Sector 17-C, Chandigarh 160017",
    phone: "+91-172-4001-1201",
    email: "sector17@gymfitness.app",
    lat: 30.7414, lng: 76.7816,
    amenities: j(["WiFi", "Pool", "Sauna", "Café", "Cardio Zone", "Group Classes"]),
    timings: "Mon-Sun 5am-11pm",
    rating: 4.5, active: true,
    imageUrl: "/locations/chandigarh-sector17.jpg",
  },
  // ── Surat ───────────────────────────────────────────────────────────────
  {
    name: "GYM Fitness – Vesu",
    city: "Surat",
    state: "Gujarat",
    address: "VR Surat Mall, Vesu, Surat 395007",
    phone: "+91-261-4001-1301",
    email: "vesu@gymfitness.app",
    lat: 21.1591, lng: 72.7760,
    amenities: j(["WiFi", "CrossFit", "Cardio Zone", "Juice Bar", "Shower Rooms", "Parking"]),
    timings: "Mon-Sat 5:30am-11pm · Sun 7am-9pm",
    rating: 4.2, active: true,
    imageUrl: "/locations/surat-vesu.jpg",
  },
  // ── Noida ───────────────────────────────────────────────────────────────
  {
    name: "GYM Fitness – Sector 18",
    city: "Noida",
    state: "Uttar Pradesh",
    address: "Atta Market, Sector 18, Noida 201301",
    phone: "+91-120-4001-1401",
    email: "sector18@gymfitness.app",
    lat: 28.5674, lng: 77.3214,
    amenities: j(["WiFi", "Pool", "Yoga Studio", "Café", "Cardio Zone", "Parking"]),
    timings: "Mon-Sun 5am-11pm",
    rating: 4.6, active: true,
    imageUrl: "/locations/noida-sector18.jpg",
  },
];

// =============================================================================
// 3. EXERCISES (22 exercises across 7 muscle groups)
// =============================================================================
type ExerciseSeed = {
  name: string; muscleGroup: string; equipment: string;
  difficulty: string; instructions: string; tips: string;
  videoUrl?: string; imageUrl?: string;
};

const exerciseData: ExerciseSeed[] = [
  // ── CHEST (3) ──────────────────────────────────────────────────────────
  {
    name: "Barbell Bench Press",
    muscleGroup: "Chest",
    equipment: "Barbell",
    difficulty: "INTERMEDIATE",
    instructions: "1. Lie flat on bench, eyes below bar.\n2. Grip bar slightly wider than shoulder-width.\n3. Unrack and lower bar to mid-chest with control (2 sec).\n4. Press explosively back to start.\n5. Lock out elbows at top without hyperextending.",
    tips: j(["Keep feet flat on floor", "Maintain slight arch in lower back", "Retract shoulder blades before unracking", "Don't bounce bar off chest"]),
    videoUrl: "/videos/bench-press.mp4",
    imageUrl: "/exercises/bench-press.jpg",
  },
  {
    name: "Incline Dumbbell Press",
    muscleGroup: "Chest",
    equipment: "Dumbbell",
    difficulty: "INTERMEDIATE",
    instructions: "1. Set bench to 30-45° incline.\n2. Hold dumbbells at chest level, palms facing forward.\n3. Press up and in until arms are extended.\n4. Lower slowly, feeling the stretch at the bottom.",
    tips: j(["Use 30° for more upper chest emphasis", "Keep wrists straight throughout", "Control the eccentric phase"]),
    videoUrl: "/videos/incline-db-press.mp4",
    imageUrl: "/exercises/incline-db-press.jpg",
  },
  {
    name: "Cable Chest Fly",
    muscleGroup: "Chest",
    equipment: "Cable Machine",
    difficulty: "BEGINNER",
    instructions: "1. Set cables to shoulder height.\n2. Stand in split stance, grab handles.\n3. Bring hands together in a wide arc in front of chest.\n4. Hold the peak contraction 1 sec, then return slowly.",
    tips: j(["Keep slight bend in elbows throughout", "Think 'hugging a tree' arc motion", "Don't let weight stack fully touch between reps"]),
    imageUrl: "/exercises/cable-fly.jpg",
  },
  // ── BACK (3) ───────────────────────────────────────────────────────────
  {
    name: "Deadlift",
    muscleGroup: "Back",
    equipment: "Barbell",
    difficulty: "ADVANCED",
    instructions: "1. Stand with feet hip-width, bar over mid-foot.\n2. Hinge at hips, grip bar just outside legs.\n3. Big breath, brace core, push floor away.\n4. Keep bar dragging up shins and thighs.\n5. Lock out hips and knees simultaneously at top.\n6. Hinge back down with control.",
    tips: j(["Keep spine neutral — no rounding lower back", "Engage lats before pulling ('protect your armpits')", "Drive hips through at the top", "Use chalk or straps for grip above 80% 1RM"]),
    videoUrl: "/videos/deadlift.mp4",
    imageUrl: "/exercises/deadlift.jpg",
  },
  {
    name: "Pull-Up",
    muscleGroup: "Back",
    equipment: "Pull-Up Bar",
    difficulty: "INTERMEDIATE",
    instructions: "1. Hang from bar with overhand grip, shoulder-width.\n2. Depress and retract scapulae (activate lats).\n3. Pull elbows down and back until chin clears bar.\n4. Lower fully with control — full dead hang between reps.",
    tips: j(["Avoid kipping for strength development", "Cross ankles and squeeze glutes for stability", "Think 'elbows to back pockets'", "Add weight with belt when bodyweight is easy"]),
    imageUrl: "/exercises/pull-up.jpg",
  },
  {
    name: "Seated Cable Row",
    muscleGroup: "Back",
    equipment: "Cable Machine",
    difficulty: "BEGINNER",
    instructions: "1. Sit at cable row station, feet on platform.\n2. Grab handle, slight bend in knees.\n3. Row handle to lower sternum, squeeze shoulder blades.\n4. Extend arms back slowly — feel full stretch.",
    tips: j(["Don't lean back excessively", "Lead with elbows, not hands", "Pause at the peak of contraction"]),
    imageUrl: "/exercises/cable-row.jpg",
  },
  // ── SHOULDERS (3) ──────────────────────────────────────────────────────
  {
    name: "Overhead Press",
    muscleGroup: "Shoulders",
    equipment: "Barbell",
    difficulty: "INTERMEDIATE",
    instructions: "1. Stand with bar on upper chest, grip just outside shoulders.\n2. Brace core, squeeze glutes.\n3. Press bar straight up, tilting head slightly back.\n4. Lock out overhead — bar over mid-foot.\n5. Lower bar under control back to clavicles.",
    tips: j(["Keep ribs down — don't flare", "Squeeze glutes to protect lower back", "Full lockout at top for shoulder health"]),
    videoUrl: "/videos/ohp.mp4",
    imageUrl: "/exercises/ohp.jpg",
  },
  {
    name: "Lateral Raise",
    muscleGroup: "Shoulders",
    equipment: "Dumbbell",
    difficulty: "BEGINNER",
    instructions: "1. Stand holding dumbbells at sides.\n2. With slight elbow bend, raise arms to shoulder height.\n3. Lead with pinkies (internally rotate slightly) for medial delt.\n4. Lower slowly over 3 seconds.",
    tips: j(["Don't go above shoulder height", "Use lighter weight with strict form", "Avoid swinging torso"]),
    imageUrl: "/exercises/lateral-raise.jpg",
  },
  {
    name: "Face Pull",
    muscleGroup: "Shoulders",
    equipment: "Cable Machine",
    difficulty: "BEGINNER",
    instructions: "1. Set rope attachment at face height.\n2. Pull rope toward face, hands splitting apart.\n3. Externally rotate — finish with hands behind ears.\n4. Hold 1 sec, return slowly.",
    tips: j(["Great for rotator cuff health and posture", "Keep elbows high throughout", "Light weight, high reps"]),
    imageUrl: "/exercises/face-pull.jpg",
  },
  // ── ARMS (3) ───────────────────────────────────────────────────────────
  {
    name: "Barbell Curl",
    muscleGroup: "Arms",
    equipment: "Barbell",
    difficulty: "BEGINNER",
    instructions: "1. Stand with underhand grip, hands shoulder-width.\n2. Keep elbows pinned to sides.\n3. Curl bar to shoulder level, peak contract.\n4. Lower slowly — full extension at bottom.",
    tips: j(["Don't swing torso to lift", "Full range of motion every rep", "Try EZ-bar for wrist comfort"]),
    imageUrl: "/exercises/barbell-curl.jpg",
  },
  {
    name: "Tricep Pushdown",
    muscleGroup: "Arms",
    equipment: "Cable Machine",
    difficulty: "BEGINNER",
    instructions: "1. Stand at cable with rope or bar attachment at chest height.\n2. Keep elbows at sides.\n3. Push attachment down to full extension.\n4. Squeeze triceps, return slowly.",
    tips: j(["Keep elbows stationary — they are the pivot", "Full lockout at bottom for maximum contraction", "Lean slightly forward for better leverage"]),
    imageUrl: "/exercises/tricep-pushdown.jpg",
  },
  {
    name: "Dips",
    muscleGroup: "Arms",
    equipment: "Parallel Bars",
    difficulty: "INTERMEDIATE",
    instructions: "1. Mount parallel bars, arms straight.\n2. Lower by bending elbows, leaning slightly forward.\n3. Descend until upper arm is parallel to floor.\n4. Press back up to lockout.",
    tips: j(["Lean forward for more chest, stay upright for triceps", "Don't go too deep to protect shoulders", "Add weight with a dip belt when bodyweight is easy"]),
    imageUrl: "/exercises/dips.jpg",
  },
  // ── LEGS (4) ───────────────────────────────────────────────────────────
  {
    name: "Barbell Back Squat",
    muscleGroup: "Legs",
    equipment: "Barbell",
    difficulty: "INTERMEDIATE",
    instructions: "1. Bar on upper traps, stance shoulder-width.\n2. Brace core, chest up.\n3. Break at hips and knees simultaneously.\n4. Descend until thighs are parallel to floor.\n5. Drive through heels to stand.",
    tips: j(["Keep chest up and knees tracking over toes", "Take a big breath before each rep", "Video yourself from the side to check depth"]),
    videoUrl: "/videos/squat.mp4",
    imageUrl: "/exercises/squat.jpg",
  },
  {
    name: "Romanian Deadlift",
    muscleGroup: "Legs",
    equipment: "Barbell",
    difficulty: "INTERMEDIATE",
    instructions: "1. Hold bar at hips, soft knee bend.\n2. Hinge at hips, pushing them back.\n3. Lower bar along thighs until hamstring stretch (shin-level).\n4. Drive hips forward to return.",
    tips: j(["Feel hamstring stretch — not lower back", "Keep bar close to legs throughout", "Don't round the lower back"]),
    imageUrl: "/exercises/rdl.jpg",
  },
  {
    name: "Leg Press",
    muscleGroup: "Legs",
    equipment: "Machine",
    difficulty: "BEGINNER",
    instructions: "1. Sit in leg press, feet hip-width at mid-platform.\n2. Unlock safety, lower sled until knees reach 90°.\n3. Press through heels back to start.\n4. Don't lock knees at top.",
    tips: j(["High foot placement targets glutes/hams", "Low foot placement targets quads", "Never let lower back peel off seat"]),
    imageUrl: "/exercises/leg-press.jpg",
  },
  {
    name: "Walking Lunge",
    muscleGroup: "Legs",
    equipment: "Dumbbell",
    difficulty: "BEGINNER",
    instructions: "1. Hold dumbbells at sides.\n2. Step forward into a lunge — rear knee hovers 2 cm above floor.\n3. Push through front heel to bring rear foot forward.\n4. Alternate legs for each step.",
    tips: j(["Keep torso upright", "Front knee stays over ankle", "Take longer strides for more glute activation"]),
    imageUrl: "/exercises/lunge.jpg",
  },
  // ── CORE (3) ───────────────────────────────────────────────────────────
  {
    name: "Plank",
    muscleGroup: "Core",
    equipment: "None",
    difficulty: "BEGINNER",
    instructions: "1. Forearms on floor, elbows under shoulders.\n2. Extend legs, toes on floor.\n3. Keep body in a straight line from head to heel.\n4. Hold, breathing steadily.",
    tips: j(["Don't let hips sag or pike", "Squeeze glutes and quads", "Build duration progressively — 10 sec increments"]),
    imageUrl: "/exercises/plank.jpg",
  },
  {
    name: "Cable Crunch",
    muscleGroup: "Core",
    equipment: "Cable Machine",
    difficulty: "BEGINNER",
    instructions: "1. Kneel below cable with rope attachment.\n2. Hold rope beside ears.\n3. Crunch elbows toward thighs, rounding spine.\n4. Hold peak, return slowly.",
    tips: j(["Don't pull with arms — the abs do the work", "Keep hips stationary throughout", "Full stretch at top — don't rush"]),
    imageUrl: "/exercises/cable-crunch.jpg",
  },
  {
    name: "Hanging Leg Raise",
    muscleGroup: "Core",
    equipment: "Pull-Up Bar",
    difficulty: "INTERMEDIATE",
    instructions: "1. Hang from pull-up bar, arms straight.\n2. Keeping legs together, raise them to 90° (or higher).\n3. Lower slowly — don't swing.",
    tips: j(["Posterior pelvic tilt at top to maximize abs contraction", "Bend knees to regress", "Use ab straps to focus less on grip"]),
    imageUrl: "/exercises/leg-raise.jpg",
  },
  // ── FULL BODY (3) ──────────────────────────────────────────────────────
  {
    name: "Kettlebell Swing",
    muscleGroup: "Full Body",
    equipment: "Kettlebell",
    difficulty: "INTERMEDIATE",
    instructions: "1. Stand with KB between feet, hinge to grip.\n2. Hike KB back between legs like a football.\n3. Drive hips explosively forward — KB floats to chest height.\n4. Let it swing back and repeat immediately.",
    tips: j(["This is a hip hinge, not a squat", "Squeeze glutes hard at the top lockout", "Keep arms loose — they just guide the bell"]),
    imageUrl: "/exercises/kb-swing.jpg",
  },
  {
    name: "Burpee",
    muscleGroup: "Full Body",
    equipment: "None",
    difficulty: "INTERMEDIATE",
    instructions: "1. Stand → squat and place hands on floor.\n2. Jump feet back to plank position.\n3. Perform a push-up.\n4. Jump feet to hands.\n5. Explode upward into jump, clap overhead.",
    tips: j(["Scale by removing push-up or jump", "Keep core braced throughout", "Breathe out on the jump"]),
    imageUrl: "/exercises/burpee.jpg",
  },
  {
    name: "Box Jump",
    muscleGroup: "Full Body",
    equipment: "Plyo Box",
    difficulty: "INTERMEDIATE",
    instructions: "1. Stand facing box, feet hip-width.\n2. Swing arms back, dip into quarter squat.\n3. Jump explosively, pulling knees up.\n4. Land softly in quarter squat on box.\n5. Step down — don't jump down.",
    tips: j(["Land with soft knees to absorb impact", "Start with a lower box — 20-24 inches", "Full hip extension on each rep"]),
    imageUrl: "/exercises/box-jump.jpg",
  },
];

// =============================================================================
// 4. WORKOUT PLANS + EXERCISE ASSIGNMENTS
// =============================================================================
type WorkoutDef = {
  name: string; category: string; difficulty: string;
  duration: number; calories: number; description: string;
  imageUrl: string; featured: boolean;
  exercises: { name: string; sets: number; reps: string; restSeconds: number; order: number }[];
};

const workoutDefs: WorkoutDef[] = [
  {
    name: "Full Body Blast",
    category: "Strength",
    difficulty: "INTERMEDIATE",
    duration: 60,
    calories: 480,
    description: "A complete full-body strength session hitting every major muscle group. Perfect for 3-day-a-week programming.",
    imageUrl: "/workouts/full-body-blast.jpg",
    featured: true,
    exercises: [
      { name: "Barbell Back Squat",   sets: 4, reps: "8",        restSeconds: 90,  order: 1 },
      { name: "Barbell Bench Press",  sets: 4, reps: "8",        restSeconds: 90,  order: 2 },
      { name: "Deadlift",             sets: 3, reps: "5",        restSeconds: 120, order: 3 },
      { name: "Overhead Press",       sets: 3, reps: "10",       restSeconds: 75,  order: 4 },
      { name: "Pull-Up",              sets: 3, reps: "to failure", restSeconds: 90, order: 5 },
      { name: "Plank",                sets: 3, reps: "45 sec",   restSeconds: 60,  order: 6 },
    ],
  },
  {
    name: "Upper Body Power",
    category: "Strength",
    difficulty: "ADVANCED",
    duration: 55,
    calories: 400,
    description: "Heavy compound movements for maximum upper body strength and hypertrophy.",
    imageUrl: "/workouts/upper-body-power.jpg",
    featured: true,
    exercises: [
      { name: "Barbell Bench Press",   sets: 5, reps: "5",   restSeconds: 120, order: 1 },
      { name: "Overhead Press",        sets: 4, reps: "6",   restSeconds: 120, order: 2 },
      { name: "Pull-Up",               sets: 4, reps: "8",   restSeconds: 90,  order: 3 },
      { name: "Seated Cable Row",      sets: 4, reps: "10",  restSeconds: 75,  order: 4 },
      { name: "Incline Dumbbell Press",sets: 3, reps: "12",  restSeconds: 60,  order: 5 },
      { name: "Face Pull",             sets: 3, reps: "15",  restSeconds: 45,  order: 6 },
    ],
  },
  {
    name: "Leg Day Destroyer",
    category: "Strength",
    difficulty: "ADVANCED",
    duration: 70,
    calories: 560,
    description: "The ultimate lower body session — quads, hamstrings, glutes, calves. Leave nothing on the platform.",
    imageUrl: "/workouts/leg-day.jpg",
    featured: true,
    exercises: [
      { name: "Barbell Back Squat",  sets: 5, reps: "5",   restSeconds: 150, order: 1 },
      { name: "Romanian Deadlift",   sets: 4, reps: "10",  restSeconds: 90,  order: 2 },
      { name: "Leg Press",           sets: 4, reps: "15",  restSeconds: 75,  order: 3 },
      { name: "Walking Lunge",       sets: 3, reps: "12 each", restSeconds: 60, order: 4 },
      { name: "Hanging Leg Raise",   sets: 3, reps: "15",  restSeconds: 60,  order: 5 },
    ],
  },
  {
    name: "Push Day",
    category: "Strength",
    difficulty: "INTERMEDIATE",
    duration: 50,
    calories: 350,
    description: "Classic push-day targeting chest, shoulders, and triceps with progressive overload built in.",
    imageUrl: "/workouts/push-day.jpg",
    featured: false,
    exercises: [
      { name: "Barbell Bench Press",   sets: 4, reps: "8",   restSeconds: 90, order: 1 },
      { name: "Incline Dumbbell Press",sets: 3, reps: "12",  restSeconds: 75, order: 2 },
      { name: "Overhead Press",        sets: 3, reps: "10",  restSeconds: 75, order: 3 },
      { name: "Lateral Raise",         sets: 4, reps: "15",  restSeconds: 45, order: 4 },
      { name: "Cable Chest Fly",       sets: 3, reps: "15",  restSeconds: 45, order: 5 },
      { name: "Tricep Pushdown",       sets: 3, reps: "15",  restSeconds: 45, order: 6 },
      { name: "Dips",                  sets: 3, reps: "to failure", restSeconds: 60, order: 7 },
    ],
  },
  {
    name: "Pull Day",
    category: "Strength",
    difficulty: "INTERMEDIATE",
    duration: 50,
    calories: 340,
    description: "Back and biceps domination — from heavy rows to isolation curls.",
    imageUrl: "/workouts/pull-day.jpg",
    featured: false,
    exercises: [
      { name: "Deadlift",          sets: 4, reps: "5",   restSeconds: 150, order: 1 },
      { name: "Pull-Up",           sets: 4, reps: "8",   restSeconds: 90,  order: 2 },
      { name: "Seated Cable Row",  sets: 4, reps: "10",  restSeconds: 75,  order: 3 },
      { name: "Face Pull",         sets: 3, reps: "15",  restSeconds: 45,  order: 4 },
      { name: "Barbell Curl",      sets: 3, reps: "12",  restSeconds: 60,  order: 5 },
    ],
  },
  {
    name: "HIIT Fat Burner",
    category: "HIIT",
    difficulty: "INTERMEDIATE",
    duration: 30,
    calories: 420,
    description: "30-minute high intensity interval training designed to torch fat and spike your metabolism for hours.",
    imageUrl: "/workouts/hiit-fat-burner.jpg",
    featured: true,
    exercises: [
      { name: "Burpee",            sets: 5, reps: "30 sec on / 15 sec off", restSeconds: 15, order: 1 },
      { name: "Kettlebell Swing",  sets: 5, reps: "20",   restSeconds: 30, order: 2 },
      { name: "Box Jump",          sets: 4, reps: "10",   restSeconds: 30, order: 3 },
      { name: "Walking Lunge",     sets: 3, reps: "20 steps", restSeconds: 30, order: 4 },
      { name: "Plank",             sets: 3, reps: "30 sec",   restSeconds: 20, order: 5 },
    ],
  },
  {
    name: "Core Crusher",
    category: "Core",
    difficulty: "INTERMEDIATE",
    duration: 25,
    calories: 220,
    description: "A focused ab and core workout combining stability, strength, and endurance exercises.",
    imageUrl: "/workouts/core-crusher.jpg",
    featured: false,
    exercises: [
      { name: "Plank",             sets: 4, reps: "60 sec",  restSeconds: 30, order: 1 },
      { name: "Cable Crunch",      sets: 4, reps: "15",      restSeconds: 45, order: 2 },
      { name: "Hanging Leg Raise", sets: 3, reps: "12",      restSeconds: 45, order: 3 },
      { name: "Kettlebell Swing",  sets: 3, reps: "15",      restSeconds: 45, order: 4 },
    ],
  },
  {
    name: "Beginner Full Body",
    category: "Strength",
    difficulty: "BEGINNER",
    duration: 45,
    calories: 300,
    description: "The perfect starting point — basic compound movements with manageable weights to build your foundation.",
    imageUrl: "/workouts/beginner-full-body.jpg",
    featured: false,
    exercises: [
      { name: "Leg Press",          sets: 3, reps: "15",  restSeconds: 60, order: 1 },
      { name: "Seated Cable Row",   sets: 3, reps: "15",  restSeconds: 60, order: 2 },
      { name: "Incline Dumbbell Press",sets: 3, reps: "12", restSeconds: 60, order: 3 },
      { name: "Lateral Raise",      sets: 3, reps: "15",  restSeconds: 45, order: 4 },
      { name: "Tricep Pushdown",    sets: 3, reps: "15",  restSeconds: 45, order: 5 },
      { name: "Barbell Curl",       sets: 3, reps: "12",  restSeconds: 45, order: 6 },
      { name: "Plank",              sets: 3, reps: "30 sec", restSeconds: 30, order: 7 },
    ],
  },
];

// =============================================================================
// MAIN SEED FUNCTION
// =============================================================================
async function main() {
  console.log("🌱  Starting GYM Fitness seed...\n");

  // ── 1. Plans ───────────────────────────────────────────────────────────
  console.log("📦  Seeding plans...");
  for (const plan of planData) {
    await prisma.plan.upsert({
      where: { slug: plan.slug },
      update: plan,
      create: plan,
    });
  }
  console.log(`    ✓ ${planData.length} plans seeded`);

  // ── 2. Gym Locations ───────────────────────────────────────────────────
  console.log("📍  Seeding gym locations...");
  for (const loc of locationData) {
    await prisma.gymLocation.upsert({
      where: { id: slug(loc.name) },   // stable synthetic ID for idempotency
      update: loc,
      create: { id: slug(loc.name), ...loc },
    });
  }
  console.log(`    ✓ ${locationData.length} locations seeded`);

  // ── 3. Exercises ───────────────────────────────────────────────────────
  console.log("🏋️   Seeding exercises...");
  const exerciseIdMap: Record<string, string> = {};
  for (const ex of exerciseData) {
    const exSlug = slug(ex.name);
    const record = await prisma.exercise.upsert({
      where: { slug: exSlug },
      update: ex,
      create: { slug: exSlug, ...ex },
    });
    exerciseIdMap[ex.name] = record.id;
  }
  console.log(`    ✓ ${exerciseData.length} exercises seeded`);

  // ── 4. Workout Plans + WorkoutExercise join rows ───────────────────────
  console.log("📋  Seeding workout plans...");
  for (const wd of workoutDefs) {
    const wpSlug = slug(wd.name);
    const { exercises: exAssignments, ...wpData } = wd;

    const wp = await prisma.workoutPlan.upsert({
      where: { slug: wpSlug },
      update: { ...wpData },
      create: { slug: wpSlug, ...wpData },
    });

    // Clear existing exercise links before re-seeding to stay idempotent
    await prisma.workoutExercise.deleteMany({ where: { workoutPlanId: wp.id } });

    for (const ex of exAssignments) {
      const exerciseId = exerciseIdMap[ex.name];
      if (!exerciseId) {
        console.warn(`    ⚠  Exercise not found: "${ex.name}" — skipping`);
        continue;
      }
      await prisma.workoutExercise.create({
        data: {
          workoutPlanId: wp.id,
          exerciseId,
          sets: ex.sets,
          reps: ex.reps,
          restSeconds: ex.restSeconds,
          order: ex.order,
        },
      });
    }
    console.log(`    ✓ "${wd.name}" — ${exAssignments.length} exercises linked`);
  }

  // ── Summary ────────────────────────────────────────────────────────────
  const [plans, locs, exs, wps, wes] = await Promise.all([
    prisma.plan.count(),
    prisma.gymLocation.count(),
    prisma.exercise.count(),
    prisma.workoutPlan.count(),
    prisma.workoutExercise.count(),
  ]);

  console.log("\n✅  Seed complete!");
  console.log("─────────────────────────────────");
  console.log(`   Plans           : ${plans}`);
  console.log(`   Gym Locations   : ${locs}`);
  console.log(`   Exercises       : ${exs}`);
  console.log(`   Workout Plans   : ${wps}`);
  console.log(`   Exercise Links  : ${wes}`);
  console.log("─────────────────────────────────");
}

main()
  .catch((e) => {
    console.error("❌  Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
