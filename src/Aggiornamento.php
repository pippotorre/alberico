<?php
// Aggiornamento automatico dei menu, avviato dalle visite all'app (Tophost non accetta
// chiamate da GitHub Actions e non offre un cron). Al massimo un tentativo ogni ORE ore:
// chi "prenota" il tentativo lo esegue, le altre richieste rispondono subito.

final class Aggiornamento
{
    public const ORE = 6;
    private const CHIAVE = 'ultimo_tentativo';

    /** Prenota il prossimo tentativo se l'ultimo è più vecchio di $ore. Una sola richiesta vince. */
    public static function prenota(PDO $pdo, DateTimeImmutable $ora, int $ore = self::ORE): bool
    {
        $adesso = $ora->format('Y-m-d H:i:s');
        $soglia = $ora->modify("-$ore hours")->format('Y-m-d H:i:s');
        $u = $pdo->prepare('UPDATE buonapp_stato SET valore = ? WHERE chiave = ? AND valore < ?');
        $u->execute([$adesso, self::CHIAVE, $soglia]);
        if ($u->rowCount() === 1) {
            return true;
        }
        // Riga mancante (migrazione eseguita senza INSERT): la crea chi arriva per primo.
        if (self::ultimoTentativo($pdo) === null) {
            try {
                $pdo->prepare('INSERT INTO buonapp_stato (chiave, valore) VALUES (?, ?)')->execute([self::CHIAVE, $adesso]);
                return true;
            } catch (PDOException $e) {
                return false;
            }
        }
        return false;
    }

    public static function ultimoTentativo(PDO $pdo): ?string
    {
        $s = $pdo->prepare('SELECT valore FROM buonapp_stato WHERE chiave = ?');
        $s->execute([self::CHIAVE]);
        $v = $s->fetchColumn();
        return $v === false ? null : $v;
    }
}
