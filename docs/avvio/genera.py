# Genera le schermate di avvio per iPhone e iPad (apple-touch-startup-image) in img/avvio/
# e stampa i tag <link> da mettere in index.html. Uso: python3 docs/avvio/genera.py
from pathlib import Path
from PIL import Image, ImageDraw

RADICE = Path(__file__).resolve().parents[2]
GIALLO = (0xfc, 0xbb, 0x21)
PIATTO = (0xff, 0xfa, 0xf0)  # le lettere gialle della padella non si vedrebbero sul giallo
# (larghezza CSS, altezza CSS, densità) in verticale; gli iPad anche in orizzontale.
IPHONE = [(375, 667, 2), (414, 736, 3), (375, 812, 3), (414, 896, 2), (414, 896, 3), (390, 844, 3),
          (428, 926, 3), (393, 852, 3), (430, 932, 3), (402, 874, 3), (440, 956, 3)]
IPAD = [(768, 1024, 2), (810, 1080, 2), (820, 1180, 2), (834, 1112, 2), (834, 1194, 2), (744, 1133, 2),
        (834, 1210, 2), (1024, 1366, 2), (1032, 1376, 2)]

padella = Image.open(RADICE / 'img/padella.png').convert('RGBA')
cartella = RADICE / 'img/avvio'
cartella.mkdir(exist_ok=True)
for f in cartella.glob('avvio-*.png'):
    f.unlink()

def crea(w, h, d, orientamento):
    pw, ph = (w * d, h * d) if orientamento == 'portrait' else (h * d, w * d)
    fondo = Image.new('RGB', (pw, ph), GIALLO)
    larghezza = int(min(pw, ph) * 0.62)
    p = padella.resize((larghezza, round(padella.height * larghezza / padella.width)), Image.LANCZOS)
    # Piatto chiaro dietro le lettere, spostato a destra come la padella.
    r = int(larghezza * 0.42)
    cx, cy = pw // 2 + int(larghezza * 0.12), ph // 2 - int(p.height * 0.08)
    ImageDraw.Draw(fondo).ellipse((cx - r, cy - r, cx + r, cy + r), fill=PIATTO)
    fondo.paste(p, ((pw - p.width) // 2, (ph - p.height) // 2), p)
    nome = f'avvio-{pw}x{ph}.png'
    fondo.save(cartella / nome, optimize=True)
    print(f'  <link rel="apple-touch-startup-image" href="img/avvio/{nome}" media="(device-width: {w}px) and '
          f'(device-height: {h}px) and (-webkit-device-pixel-ratio: {d}) and (orientation: {orientamento})">')

# Stessa composizione su fondo trasparente, per la schermata di avvio in HTML (Android e altri browser):
# quadrato 1,2 volte la padella (il piatto sporge a destra), da mostrare al centro largo 74.4vmin (= 62 × 1,2).
L = 600
p = padella.resize((L, round(padella.height * L / padella.width)), Image.LANCZOS)
Q = int(L * 1.2)
quadro = Image.new('RGBA', (Q, Q), (0, 0, 0, 0))
r = int(L * 0.42)
cx, cy = Q // 2 + int(L * 0.12), Q // 2 - int(p.height * 0.08)
ImageDraw.Draw(quadro).ellipse((cx - r, cy - r, cx + r, cy + r), fill=PIATTO + (255,))
quadro.alpha_composite(p, ((Q - p.width) // 2, (Q - p.height) // 2))
quadro.save(RADICE / 'img/padella-piatto.png', optimize=True)

for w, h, d in IPHONE:
    crea(w, h, d, 'portrait')
for w, h, d in IPAD:
    crea(w, h, d, 'portrait')
    crea(w, h, d, 'landscape')
