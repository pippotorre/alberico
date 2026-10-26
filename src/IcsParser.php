<?php
// Legge un feed iCal (RFC 5545) e restituisce un piatto del giorno per data.
// Gestisce solo ciò che usano i calendari del Comune: eventi di un giorno con i piatti nel SUMMARY.

final class IcsParser
{
    /**
     * @return array<string, array{uid: string, testo: string}> data (Y-m-d) => evento
     */
    public static function giorni(string $ics, string $fuso = 'Europe/Rome'): array
    {
        $giorni = [];
        foreach (self::eventi($ics) as $ev) {
            if (strtoupper($ev['STATUS']['valore'] ?? '') === 'CANCELLED') {
                continue;
            }
            $data = self::data($ev['DTSTART'] ?? null, $fuso);
            $testo = trim($ev['SUMMARY']['valore'] ?? '');
            if ($data === null || $testo === '') {
                continue;
            }
            // Due eventi nello stesso giorno: si tengono entrambi i testi.
            if (isset($giorni[$data])) {
                $giorni[$data]['testo'] .= ', ' . $testo;
                continue;
            }
            $giorni[$data] = ['uid' => $ev['UID']['valore'] ?? '', 'testo' => $testo];
        }
        ksort($giorni);
        return $giorni;
    }

    /** @return list<array<string, array{param: string, valore: string}>> */
    private static function eventi(string $ics): array
    {
        // Le righe lunghe continuano sulla riga seguente che inizia con spazio o tab.
        $ics = preg_replace("/\r?\n[ \t]/", '', $ics);
        $eventi = [];
        $corrente = null;
        foreach (preg_split("/\r?\n/", $ics) as $riga) {
            if ($riga === 'BEGIN:VEVENT') {
                $corrente = [];
            } elseif ($riga === 'END:VEVENT') {
                if ($corrente !== null) {
                    $eventi[] = $corrente;
                }
                $corrente = null;
            } elseif ($corrente !== null && ($pos = strpos($riga, ':')) !== false) {
                $chiave = substr($riga, 0, $pos);
                $param = '';
                if (($pv = strpos($chiave, ';')) !== false) {
                    $param = substr($chiave, $pv + 1);
                    $chiave = substr($chiave, 0, $pv);
                }
                $corrente[strtoupper($chiave)] = [
                    'param' => $param,
                    'valore' => self::sblocca(substr($riga, $pos + 1)),
                ];
            }
        }
        return $eventi;
    }

    private static function sblocca(string $v): string
    {
        return strtr($v, ['\\n' => ' ', '\\N' => ' ', '\\,' => ',', '\\;' => ';', '\\\\' => '\\']);
    }

    /** @param array{param: string, valore: string}|null $prop */
    private static function data(?array $prop, string $fuso): ?string
    {
        if ($prop === null) {
            return null;
        }
        $v = $prop['valore'];
        if (preg_match('/^(\d{4})(\d{2})(\d{2})$/', $v, $m)) {
            return "$m[1]-$m[2]-$m[3]";
        }
        if (preg_match('/^(\d{8}T\d{6})(Z?)$/', $v, $m)) {
            $tz = $m[2] === 'Z' ? new DateTimeZone('UTC') : self::fusoDa($prop['param'], $fuso);
            $dt = DateTime::createFromFormat('Ymd\THis', $m[1], $tz);
            return $dt ? $dt->setTimezone(new DateTimeZone($fuso))->format('Y-m-d') : null;
        }
        return null;
    }

    private static function fusoDa(string $param, string $predefinito): DateTimeZone
    {
        if (preg_match('/TZID=([^;]+)/', $param, $m)) {
            try {
                return new DateTimeZone($m[1]);
            } catch (Exception $e) {
            }
        }
        return new DateTimeZone($predefinito);
    }
}
