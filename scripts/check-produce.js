const db = require('../db');

async function main() {
  const data = await db.asyncFind({});
  console.log(data);
}

main();