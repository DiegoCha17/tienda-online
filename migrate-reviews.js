const { sql } = require('@vercel/postgres');
require('dotenv').config({ path: '.env.local' });

async function migrate() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS product_reviews (
        id SERIAL PRIMARY KEY,
        product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
        author_name VARCHAR(100) NOT NULL,
        rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
        comment TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log("Tabla product_reviews creada existosamente.");
  } catch (error) {
    console.error("Error creando tabla: ", error);
  }
}

migrate();
