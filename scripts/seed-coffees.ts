import mongoose from 'mongoose';

import { Coffee, CoffeeSchema } from '../src/coffees/entities/coffee.entity';

const brands = [
  'Starbucks',
  'Lavazza',
  'Illy',
  "Peet's Coffee",
  'Blue Bottle',
  'Intelligentsia',
  'Counter Culture',
  'Stumptown',
  'Death Wish',
  'Cafe Bustelo',
];

const flavors = [
  'Chocolate',
  'Caramel',
  'Vanilla',
  'Hazelnut',
  'Cinnamon',
  'Nutty',
  'Fruity',
  'Floral',
  'Spicy',
  'Earthy',
];

function generateRandomCoffee() {
  const brand = brands[Math.floor(Math.random() * brands.length)];
  const numFlavors = Math.floor(Math.random() * 3) + 1; // 1-3 flavors
  const selectedFlavors = new Set<string>();

  while (selectedFlavors.size < numFlavors) {
    const flavor = flavors[Math.floor(Math.random() * flavors.length)];
    selectedFlavors.add(flavor);
  }

  return {
    name: `${brand} Blend ${Math.floor(Math.random() * 1000)}`,
    brand,
    flavors: Array.from(selectedFlavors),
  };
}

async function seedCoffees(count: number = 100) {
  try {
    console.log('🚀 Starting coffee seeding process...');

    // Connect to MongoDB
    const mongoUri =
      process.env.MONGODB_URI || 'mongodb://localhost:27017/iluvcoffee';
    await mongoose.connect(mongoUri);
    console.log('🔌 Connected to MongoDB successfully');

    // Get the Coffee model
    const CoffeeModel = mongoose.model<Coffee>('Coffee', CoffeeSchema);

    // Clear existing data
    await CoffeeModel.deleteMany({});
    console.log('🧹 Cleared existing coffee data');

    // Generate and insert new data
    console.log(`☕ Generating ${count} random coffees...`);
    const coffees = Array.from({ length: count }, () => generateRandomCoffee());
    await CoffeeModel.insertMany(coffees);
    console.log(`✨ Successfully seeded ${count} coffees into database`);

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');

    console.log('✅ Seeding process completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding coffees:', error);
    process.exit(1);
  }
}

// Get count from command line argument or use default
const count = process.argv[2] ? parseInt(process.argv[2], 10) : 100;
console.log('🌱 Starting seed script...');
seedCoffees(count);
