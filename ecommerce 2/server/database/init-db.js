import { initDatabase, db } from './db.js';

async function main() {
  console.log('🚀 Initializing NexaCart AI Database...');
  await initDatabase();
  console.log(`Current active database engine: [${db.getEngine().toUpperCase()}]`);

  const products = await db.getProducts();
  const categories = await db.getCategories();

  console.log(`✔ Verified ${categories.length} categories available`);
  console.log(`✔ Verified ${products.length} AI products loaded`);
  console.log('\nDefault Test Accounts:');
  console.log('  Admin:    admin@nexacart.ai / Password123!');
  console.log('  Customer: alex@nexacart.ai  / Password123!');
  process.exit(0);
}

main().catch(err => {
  console.error('Fatal initialization error:', err);
  process.exit(1);
});

