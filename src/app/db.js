// db.js
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://PhoneDealDB_owner:npg_KMuzf05woIHr@ep-muddy-unit-a9dn3bnn-pooler.gwc.azure.neon.tech/PhoneDealDB?sslmode=require&channel_binding=require'
  // Mets ici l’URL de connexion fournie par Neon
});

module.exports = pool;