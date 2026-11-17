
const categoryNames = {
  faucets: "Faucets",
  toilets: "Toilets",
  heaters: "Water heaters",
  pipes: "PPR pipes"
};

const products = [
  {
    id: 1,
    category: "faucets",
    code: "L4319-3",
    name: "Kitchen faucet LEDEME L4319-3",
    note: "Two-handle, for sink",
    description: "A classic two-handle kitchen faucet for a sink. Hot and cold water are set with two separate handles, a simple design that is easy to repair.",
    price: 19500,
    unit: "pcs",
    rating: 4.5,
    stock: 10,
    image: "https://avatars.mds.yandex.net/i?id=cc6be79473fc30b30256a627cbe24729f1ceb5cc-5232206-images-thumbs&n=13"
  },
  {
    id: 2,
    category: "faucets",
    code: "L4398",
    name: "Kitchen faucet LEDEME L4398",
    note: "Chrome, for sink",
    description: "A chrome kitchen faucet for a sink. The chrome finish is easy to wipe clean and goes with most kitchens.",
    price: 21000,
    unit: "pcs",
    rating: 4.7,
    stock: 10,
    image: "https://avatars.mds.yandex.net/i?id=b8caf676a9e8d1a6c7d7da9dff2947fc490a41f3-5173517-images-thumbs&n=13"
  },
  {
    id: 3,
    category: "faucets",
    code: "L4069B",
    name: "Kitchen faucet LEDEME L4069B",
    note: "Black, single-lever",
    description: "A black single-lever kitchen faucet. One lever sets both the temperature and the flow, which is handy when your hands are busy.",
    price: 28730,
    unit: "pcs",
    rating: 4.4,
    stock: 10,
    image: "https://avatars.mds.yandex.net/i?id=8ffaed387ff25b675368f7d122f2d5a89bb3713b-10576628-images-thumbs&n=13"
  },
  {
    id: 4,
    category: "faucets",
    code: "L74004-2",
    name: "Kitchen faucet LEDEME L74004-2",
    note: "Black, single-lever",
    description: "A black single-lever kitchen faucet with a modern look. One lever sets both the temperature and the flow.",
    price: 30300,
    unit: "pcs",
    rating: 4.6,
    stock: 0,
    image: "https://avatars.mds.yandex.net/i?id=9e0af054c9fb756e2698fee7d4df567806c73912-8356716-images-thumbs&n=13"
  },
  {
    id: 5,
    category: "toilets",
    code: "LR360",
    name: "Floor-standing toilet Lara LR360",
    note: "Without tank",
    description: "A floor-standing toilet bowl sold without a tank. Choose a matching cistern separately.",
    price: 40000,
    unit: "pcs",
    rating: 4.2,
    stock: 3,
    image: "https://avatars.mds.yandex.net/i?id=88e4121ebc869a43954b9fe1f613f155238054a1-5221577-images-thumbs&n=13"
  },
  {
    id: 6,
    category: "toilets",
    code: "Rosa Standard",
    name: "Compact toilet Rosa Standard",
    note: "Angled outlet",
    description: "A compact floor-standing toilet with an angled outlet. The compact size suits a small bathroom; check that your drain matches the angled outlet.",
    price: 39590,
    unit: "pcs",
    rating: 4.3,
    stock: 10,
    image: "https://avatars.mds.yandex.net/i?id=495d76ba73fba623a84bb3e9a00ad810ea1f553f-8244093-images-thumbs&n=13"
  },
  {
    id: 7,
    category: "toilets",
    code: "Rosa Lira",
    name: "Compact toilet Rosa Lira",
    note: "Tank included",
    description: "A compact toilet with the tank included, so it is ready to install. The compact size suits a small bathroom.",
    price: 45990,
    unit: "pcs",
    rating: 4.6,
    stock: 10,
    image: "https://avatars.mds.yandex.net/i?id=a555abe2337454ffbb6c648d1c9c95148784a44c-4366165-images-thumbs&n=13"
  },
  {
    id: 8,
    category: "toilets",
    code: "Mito Grey",
    name: "Compact toilet Cersanit Mito Grey",
    note: "Dual flush, grey",
    description: "A compact toilet with a dual flush button: a small flush saves water, a full flush handles the rest. Grey finish.",
    price: 37170,
    unit: "pcs",
    rating: 4.1,
    stock: 0,
    image: "https://avatars.mds.yandex.net/i?id=398844ecf66ffd9d8b3d7ccacbcfa9e111071566-8340947-images-thumbs&n=13"
  },
  {
    id: 9,
    category: "heaters",
    code: "BLU1 R",
    name: "Water heater Ariston BLU1 R ABS 50 V",
    note: "50 L, storage tank",
    description: "A 50-litre storage water heater from Ariston. The tank keeps hot water ready, which suits a family flat. Our plumber can mount and connect it.",
    price: 69990,
    unit: "pcs",
    rating: 4.7,
    stock: 10,
    image: "https://avatars.mds.yandex.net/i?id=3b43df82f513bbf261c3703926c0b74a54e5b6e9-5624761-images-thumbs&n=13"
  },
  {
    id: 10,
    category: "heaters",
    code: "PRO R",
    name: "Water heater Ariston ABS PRO R 50 V",
    note: "50 L, storage tank",
    description: "A 50-litre storage water heater from Ariston. The tank keeps hot water ready for the whole family. Our plumber can mount and connect it.",
    price: 62990,
    unit: "pcs",
    rating: 4.5,
    stock: 10,
    image: "https://avatars.mds.yandex.net/i?id=c8c028e1bd5c2cb6332604e9cffddf75e52a29ab-10936100-images-thumbs&n=13"
  },
  {
    id: 11,
    category: "heaters",
    code: "VELIS TECH",
    name: "Water heater Ariston VELIS TECH PW ABSE 50",
    note: "50 L, flat",
    description: "A flat 50-litre water heater from the Ariston VELIS TECH line. The flat shape takes less room on the wall than a round tank.",
    price: 146000,
    unit: "pcs",
    rating: 4.8,
    stock: 0,
    image: "https://avatars.mds.yandex.net/i?id=75c03cd6273dd395365c70744667b2fa52cc138a-5257754-images-thumbs&n=13"
  },
  {
    id: 12,
    category: "pipes",
    code: "Ø20",
    name: "PPR pipe PN20 Ø20 mm, glass-fibre",
    note: "For hot water and heating",
    description: "A glass-fibre reinforced PPR pipe, Ø20 mm, PN20, for hot water and heating lines in homes. Sold by the meter.",
    price: 286,
    unit: "m",
    rating: 4.6,
    stock: 100,
    image: "https://avatars.mds.yandex.net/i?id=05fa8c07430f9db11b88f796bcca0e70b0e2a19b-4483957-images-thumbs&n=13"
  },
  {
    id: 13,
    category: "pipes",
    code: "Ø32",
    name: "PPR pipe PN20 Kontur Ø32 mm",
    note: "For water supply",
    description: "A PPR pipe, Ø32 mm, PN20, Kontur brand, for water supply lines in apartments and houses. Sold by the meter.",
    price: 1412,
    unit: "m",
    rating: 4.5,
    stock: 100,
    image: "https://avatars.mds.yandex.net/i?id=78a5d5c12b5a8c504d2e1ba9b0a28d860d4fe553-5876418-images-thumbs&n=13"
  }
];


const services = [
  {
    id: 101, name: "Call-out and diagnosis", price: 2000, time: "30 to 60 minutes",
    text: "A plumber comes, finds the problem and tells you the cost before any work starts.",
    details: "The plumber visits your address, checks pipes, taps, fittings and water pressure, finds the cause of the problem and names the price before any work begins. You decide whether to order the repair.",
    includes: ["Check of pipes, taps and fittings", "Cause of the problem found", "Price named before any work"]
  },
  {
    id: 102, name: "Leaks and small repairs", price: 3000, time: "1 to 2 hours",
    text: "Dripping tap, leaking pipe or toilet tank, worn gaskets and seals.",
    details: "A dripping tap, a leaking connection or a toilet tank that keeps running. The plumber replaces worn gaskets, seals and small parts and checks that everything is dry afterwards.",
    includes: ["Replacement of gaskets and seals", "Tightening of connections", "Dry test after the repair"]
  },
  {
    id: 103, name: "Install a faucet, sink or toilet", price: 5000, time: "1 to 3 hours",
    text: "We remove the old one and fit the new one, with flexible hoses and a leak check.",
    details: "The old fixture is removed and the new one is fitted and connected with flexible hoses. Buy the fixture from our catalog or bring your own.",
    includes: ["Removal of the old fixture", "Connection with flexible hoses", "Leak check under pressure"]
  },
  {
    id: 104, name: "Unclog a drain", price: 10000, time: "1 to 2 hours",
    text: "Blocked sink, bathtub or toilet, cleaned out mechanically.",
    details: "A blocked sink, bathtub or toilet is cleared mechanically with a plumbing snake, without harsh chemicals that damage old pipes.",
    includes: ["Mechanical cleaning of the blockage", "Flow test with running water", "Advice on how to avoid a new blockage"]
  },
  {
    id: 105, name: "Water heater installation", price: 0, time: "2 to 4 hours",
    text: "Mounting on the wall, connecting to water and electricity, and a test run.",
    details: "The heater is mounted on a wall, connected to the water supply and to electricity, filled and tested. The price depends on the wall, the pipes and the heater model, so it is agreed after inspection.",
    includes: ["Wall mounting", "Water and electric connection", "Test run and safety valve check"]
  },
  {
    id: 106, name: "PPR pipe laying", price: 0, time: "from 1 day",
    text: "New water lines in an apartment or house, welded from PPR pipes.",
    details: "New water lines for an apartment or a house, welded from PPR pipes. The plumber measures the route, welds the joints and tests the line under pressure. The price depends on the length and the number of fittings.",
    includes: ["Measuring the route", "Welding of pipes and fittings", "Pressure test of the finished line"]
  }
];

// Plumbers: the factor changes the price of a service, the hourly rate is shown for jobs priced after inspection
const plumbers = [
  { id: "mardan", name: "Mardan", rating: 4.9, factor: 1.3, hourly: 7000, note: "Top rated. Higher price, careful work." },
  { id: "aleksey", name: "Aleksey", rating: 4.6, factor: 1.0, hourly: 5500, note: "Standard rate for all jobs." },
  { id: "samat", name: "Samat", rating: 4.3, factor: 0.85, hourly: 4000, note: "Budget friendly, good for small repairs." }
];


const pipeSizes = [
  { size: 20, perMeter: 427, inStock: true },
  { size: 32, perMeter: 1412, inStock: true },
  { size: 40, perMeter: 2176, inStock: true },
  { size: 50, perMeter: 3540, inStock: true },
  { size: 75, perMeter: 7588, inStock: false }
];


const pipeQuestions = [
  { question: "What do I need to weld PPR pipes?", answer: "A PPR welding iron with nozzles of the right size, pipe scissors and the fittings. Our plumber can do the welding for you." },
  { question: "How do I connect PPR pipes to a metal tap or a water heater?", answer: "Use a fitting with a threaded brass insert. One side is welded to the pipe, the other screws onto the tap or the heater." },
  { question: "Can I hide PPR pipes inside a wall?", answer: "Yes. A welded joint is permanent, so the pipes can go inside a wall or a floor. Wrap hot-water pipes in insulation so they lose less heat." }
];
