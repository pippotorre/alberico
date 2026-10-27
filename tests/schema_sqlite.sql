-- Stesso schema di migrations/001_schema.sql, nella sintassi di SQLite (solo per le prove).
CREATE TABLE fasce (id TEXT PRIMARY KEY, nome TEXT NOT NULL, gruppo TEXT NOT NULL, colore TEXT NOT NULL, ordine INTEGER NOT NULL DEFAULT 0);
CREATE TABLE diete (id TEXT PRIMARY KEY, nome TEXT NOT NULL, ordine INTEGER NOT NULL DEFAULT 0);
CREATE TABLE menu (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  fascia_id TEXT NOT NULL REFERENCES fasce (id),
  dieta_id TEXT NOT NULL REFERENCES diete (id),
  calendar_id TEXT NOT NULL,
  attivo INTEGER NOT NULL DEFAULT 1,
  ultimo_import TEXT NULL,
  ultimo_errore TEXT NULL,
  UNIQUE (fascia_id, dieta_id)
);
CREATE TABLE giorni (
  menu_id INTEGER NOT NULL REFERENCES menu (id) ON DELETE CASCADE,
  data TEXT NOT NULL,
  piatti TEXT NOT NULL,
  testo TEXT NOT NULL,
  PRIMARY KEY (menu_id, data)
);
