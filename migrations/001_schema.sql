-- buonApp: schema iniziale (MySQL / MariaDB su Tophost).
-- Eseguire a mano in phpMyAdmin. Fasce, diete e menu li riempie l'importatore da src/Calendari.php.

CREATE TABLE IF NOT EXISTS fasce (
  id      VARCHAR(20)  NOT NULL PRIMARY KEY,
  nome    VARCHAR(60)  NOT NULL,
  gruppo  VARCHAR(60)  NOT NULL,
  colore  VARCHAR(20)  NOT NULL,
  ordine  INT          NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS diete (
  id      VARCHAR(30)  NOT NULL PRIMARY KEY,
  nome    VARCHAR(60)  NOT NULL,
  ordine  INT          NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS menu (
  id             INT          NOT NULL AUTO_INCREMENT PRIMARY KEY,
  fascia_id      VARCHAR(20)  NOT NULL,
  dieta_id       VARCHAR(30)  NOT NULL,
  calendar_id    VARCHAR(100) NOT NULL,
  attivo         TINYINT(1)   NOT NULL DEFAULT 1,
  ultimo_import  DATETIME     NULL,
  ultimo_errore  VARCHAR(255) NULL,
  UNIQUE KEY uq_menu (fascia_id, dieta_id),
  CONSTRAINT fk_menu_fascia FOREIGN KEY (fascia_id) REFERENCES fasce (id),
  CONSTRAINT fk_menu_dieta  FOREIGN KEY (dieta_id)  REFERENCES diete (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS giorni (
  menu_id  INT          NOT NULL,
  data     DATE         NOT NULL,
  piatti   TEXT         NOT NULL,  -- JSON: elenco dei piatti già ripuliti
  testo    TEXT         NOT NULL,  -- titolo originale dell'evento del Comune
  PRIMARY KEY (menu_id, data),
  CONSTRAINT fk_giorni_menu FOREIGN KEY (menu_id) REFERENCES menu (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
