<?php
// Trasforma il titolo dell'evento del Comune in un elenco di piatti leggibile.
// "PASTA ALLE ZUCCHINE, POLPETTE. DI BOVINO IN UMIDO, PANE" → ["Pasta alle zucchine", "Polpette di bovino in umido", "Pane"]

final class Piatti
{
    /** @return list<string> */
    public static function daTesto(string $testo): array
    {
        $piatti = [];
        foreach (explode(',', $testo) as $parte) {
            $p = preg_replace('/\s+/u', ' ', $parte);
            // Punto rimasto nel mezzo di un nome ("POLPETTE. DI BOVINO").
            $p = preg_replace('/(\p{L})\.\s+(?=\p{L})/u', '$1 ', $p);
            $p = trim($p, " .\t");
            if ($p === '') {
                continue;
            }
            $piatti[] = self::maiuscolaIniziale($p);
        }
        return $piatti;
    }

    private static function maiuscolaIniziale(string $p): string
    {
        // Il Comune scrive in maiuscolo: si porta tutto in minuscolo con l'iniziale maiuscola.
        $p = mb_strtolower($p);
        return mb_strtoupper(mb_substr($p, 0, 1)) . mb_substr($p, 1);
    }
}
