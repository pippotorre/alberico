<?php
// Legge src/config.php (o il file indicato in BUONAPP_CONFIG, usato dalle prove).
// Il nome è ConfigLoader e non Config per non avere due file che differiscono solo per le maiuscole.

final class ConfigLoader
{
    private static ?array $config = null;

    public static function get(): array
    {
        if (self::$config === null) {
            $file = getenv('BUONAPP_CONFIG') ?: __DIR__ . '/config.php';
            if (!is_file($file)) {
                throw new RuntimeException('Configurazione mancante: copiare src/config.example.php in src/config.php');
            }
            self::$config = require $file;
        }
        return self::$config;
    }

    public static function pdo(): PDO
    {
        static $pdo = null;
        if ($pdo === null) {
            $db = self::get()['db'];
            $pdo = new PDO($db['dsn'], $db['utente'] ?? null, $db['password'] ?? null, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            ]);
        }
        return $pdo;
    }

    public static function fuso(): string
    {
        return self::get()['fuso'] ?? 'Europe/Rome';
    }
}
