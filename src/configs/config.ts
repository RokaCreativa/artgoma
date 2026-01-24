const db = process.env.DATABASE_URL;

// Minio configuracion eliminada por migracion a Supabase Storage

const appConfig = {
  db,
};

export default appConfig;
