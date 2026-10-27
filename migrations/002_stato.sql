-- buonApp: stato dell'aggiornamento automatico.
-- Eseguire in phpMyAdmin dopo 001_schema.sql.
-- L'app chiede di aggiornare i menu quando viene aperta; questa riga impedisce di farlo
-- più di una volta ogni poche ore e di avviare due aggiornamenti insieme.

CREATE TABLE IF NOT EXISTS buonapp_stato (
  chiave  VARCHAR(50)  NOT NULL PRIMARY KEY,
  valore  VARCHAR(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO buonapp_stato (chiave, valore) VALUES ('ultimo_tentativo', '2000-01-01 00:00:00');
