#!/usr/bin/env python3
"""Ritocchi al progetto Android creato da Bubblewrap, da rifare dopo ogni `bubblewrap update`.

Uso: python3 play-store/personalizza-android.py <cartella del progetto Android>

1. Nome dell'app tradotto (values-en, -fr, -es, -ar); in italiano vale quello di twa-manifest.json.
2. Solo le cinque lingue dell'app nelle risorse (resConfigs).
3. L'app apre solo i link che cominciano con /buonapp, non tutto il dominio:
   su www.entratadisicurezza.com ci sono anche altre app.
4. Niente jcenter (chiuso, e i suoi rinvii a repo1.maven.org rispondono 429): si usa Maven Central
   (prima la sua copia di Google, più stabile da qui, poi l'originale).
"""
import pathlib
import sys

NOMI = {
    'en': 'buonApp – What’s for lunch at school?',
    'fr': 'buonApp – On mange quoi à l’école ?',
    'es': 'buonApp – ¿Qué se come hoy en el cole?',
    'ar': 'buonApp – ماذا نأكل اليوم في المدرسة؟',
}
PERCORSO = '/buonapp'

progetto = pathlib.Path(sys.argv[1])
res = progetto / 'app/src/main/res'
for lingua, nome in NOMI.items():
    cartella = res / f'values-{lingua}'
    cartella.mkdir(exist_ok=True)
    (cartella / 'strings.xml').write_text(
        '<?xml version="1.0" encoding="utf-8"?>\n<resources>\n'
        f'  <string name="appName">{nome}</string>\n</resources>\n', encoding='utf-8')

gradle = progetto / 'app/build.gradle'
testo = gradle.read_text(encoding='utf-8')
if 'resConfigs' not in testo:
    riga = '        versionName "'
    i = testo.index(riga)
    fine = testo.index('\n', i) + 1
    testo = testo[:fine] + '\n        // Lingue dell\'app: italiano (predefinito), inglese, francese, spagnolo, arabo.\n' \
        '        resConfigs "it", "en", "fr", "es", "ar"\n' + testo[fine:]
    gradle.write_text(testo, encoding='utf-8')

manifest = progetto / 'app/src/main/AndroidManifest.xml'
testo = manifest.read_text(encoding='utf-8')
if 'android:pathPrefix' not in testo:
    vecchio = 'android:host="@string/hostName"'
    assert testo.count(vecchio) == 1, 'intent-filter non trovato'
    testo = testo.replace(vecchio, vecchio + f'\n                    android:pathPrefix="{PERCORSO}"')
    manifest.write_text(testo, encoding='utf-8')
for nome in ('build.gradle', 'settings.gradle', 'app/build.gradle'):
    f = progetto / nome
    if f.exists():
        testo = f.read_text(encoding='utf-8')
        if 'jcenter()' in testo:
            f.write_text(testo.replace('jcenter()', "maven { url 'https://maven-central.storage-download.googleapis.com/maven2' }\n"
                                       "        mavenCentral()"), encoding='utf-8')

print('Progetto Android personalizzato:', progetto)
