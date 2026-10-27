#!/bin/sh
# Crea buonapp.zip con la cartella "buonapp" pronta da caricare su Tophost.
# Uso: sh bin/crea-zip.sh [cartella di destinazione]   (predefinita: dist/)
# Lo ZIP contiene solo i file del sito: niente src/config.php (si carica a parte, compilato),
# niente migrations/ (si eseguono in phpMyAdmin), test, documentazione e file di GitHub.
set -eu

radice=$(cd "$(dirname "$0")/.." && pwd)
dest=${1:-"$radice/dist"}
mkdir -p "$dest"
dest=$(cd "$dest" && pwd)
lavoro=$(mktemp -d)
trap 'rm -rf "$lavoro"' EXIT

php "$radice/tests/run.php" > /dev/null || { echo "Le prove non passano: ZIP non creato." >&2; exit 1; }

mkdir "$lavoro/buonapp"
# Solo i file tracciati da git: niente file locali, copie del database o config.php compilati.
git -C "$radice" archive --format=tar HEAD \
  ':(exclude)tests' ':(exclude)migrations' ':(exclude).github' ':(exclude)docs' \
  ':(exclude)README.md' ':(exclude)SVILUPPO.md' ':(exclude).gitignore' ':(exclude).gitattributes' \
  ':(exclude)src/config.php' ':(exclude)bin/crea-zip.sh' \
  | tar -x -C "$lavoro/buonapp"

rm -f "$dest/buonapp.zip"
(cd "$lavoro" && zip -qr -X "$dest/buonapp.zip" buonapp)
echo "Creato $dest/buonapp.zip ($(git -C "$radice" rev-parse --short HEAD))"
