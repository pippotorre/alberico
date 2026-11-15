// buonApp – testi dell'interfaccia in italiano, inglese, francese, spagnolo e arabo (da destra a sinistra).
// I nomi dei piatti restano in italiano: arrivano così dai calendari della Città di Torino.
// Lingua: scelta salvata sul dispositivo → parametro ?lang=xx → lingua del telefono → italiano.
'use strict';

(function () {
  const CHIAVE = 'buonapp.lingua';
  const LINGUE = {
    it: { nome: 'Italiano', locale: 'it-IT', dir: 'ltr' },
    en: { nome: 'English', locale: 'en-GB', dir: 'ltr' },
    fr: { nome: 'Français', locale: 'fr-FR', dir: 'ltr' },
    es: { nome: 'Español', locale: 'es-ES', dir: 'ltr' },
    // Cifre occidentali anche in arabo, come nelle date dei calendari del Comune.
    ar: { nome: 'العربية', locale: 'ar-u-nu-latn', dir: 'rtl' },
  };

  const TESTI = {
    it: {
      titolo: 'buonApp · Che si mangia oggi a scuola?',
      descrizione: 'Il menu del giorno delle scuole di Torino, dal nido alle medie, per tutte le diete.',
      slogan: 'Che si mangia oggi a scuola?',
      lingua: 'Lingua',
      carico: 'Carico i menu…',
      piede: 'Menu della ristorazione scolastica della Città di Torino, presi dai calendari pubblicati dal Comune. In caso di dubbio vale quanto comunicato dalla scuola.',
      piattiInItaliano: '',
      installa: 'Installa l’app sul telefono',
      privacy: 'Informativa privacy',
      oggi: 'Oggi, {giorno}',
      domani: 'Domani, {giorno}',
      merenda: 'Merenda:',
      calendarioUfficiale: 'Vai al calendario ufficiale',
      nonPubblicato: 'Il menu per questi giorni non è ancora stato pubblicato dalla Città di Torino. Sarà disponibile in questa pagina non appena verrà reso noto.',
      primoPubblicato: 'Il primo menu già pubblicato è quello di {giorno}.',
      erroreMenu: 'Non è stato possibile caricare il menu. Si prega di verificare la connessione e di riprovare.',
      erroreMenuTutti: 'Non è stato possibile caricare i menu. Si prega di verificare la connessione e di riprovare tra qualche minuto.',
      nonTrovato: 'Il menu richiesto non è disponibile. Si prega di tornare alla pagina iniziale e di sceglierne un altro.',
      tuoiMenu: 'I tuoi menu',
      altriMenu: 'Altri menu',
      scegliMenu: 'Scegli il menu',
      scegliMenuNota: 'Puoi salvare fino a due menu preferiti: li troverai qui ogni volta che apri buonApp.',
      tuttaSettimana: 'Tutta la settimana',
      home: 'Home',
      indietro: 'Indietro',
      scegliEta: 'Scegli l’età del bambino o della bambina.',
      scegliDieta: 'Scegli la dieta.',
      fonte: 'Fonte: Città di Torino, ristorazione scolastica.',
      neiPreferiti: '★ Nei preferiti',
      aggiungiPreferiti: '☆ Aggiungi ai preferiti',
      troppiPreferiti: 'Hai già due menu preferiti. Apri uno dei due e toglilo, poi aggiungi questo.',
      settimana: 'Settimana',
      settimanaPrecedente: 'Settimana precedente',
      settimanaSuccessiva: 'Settimana successiva',
      aggiornato: 'Menu aggiornato il {quando}.',
      gruppi: {
        nidi: ['Nidi d’infanzia', '6–9, 9–12 e 12–36 mesi'],
        infanzia: ['Scuole d’infanzia', '3–6 anni'],
        primaria: ['Scuole primarie', 'Elementari'],
        secondaria: ['Scuole secondarie', 'Medie'],
      },
      // In italiano valgono i nomi che arrivano dal sito.
      fasce: {},
      diete: {},
    },

    en: {
      titolo: 'buonApp · What’s for lunch at school today?',
      descrizione: 'Today’s school meal menu in Turin, from nursery to middle school, for every diet.',
      slogan: 'What’s for lunch at school today?',
      lingua: 'Language',
      carico: 'Loading the menus…',
      piede: 'School meal menus of the City of Turin, taken from the calendars published by the City. If in doubt, what the school tells you applies.',
      piattiInItaliano: 'Dish names are shown in Italian, as published by the City of Turin.',
      installa: 'Install the app on your phone',
      privacy: 'Privacy policy',
      oggi: 'Today, {giorno}',
      domani: 'Tomorrow, {giorno}',
      merenda: 'Snack:',
      calendarioUfficiale: 'Open the official calendar',
      nonPubblicato: 'The City of Turin has not yet published the menu for these days. It will appear on this page as soon as it is released.',
      primoPubblicato: 'The first menu already published is for {giorno}.',
      erroreMenu: 'The menu could not be loaded. Please check your connection and try again.',
      erroreMenuTutti: 'The menus could not be loaded. Please check your connection and try again in a few minutes.',
      nonTrovato: 'The menu you asked for is not available. Please go back to the home page and choose another one.',
      tuoiMenu: 'Your menus',
      altriMenu: 'Other menus',
      scegliMenu: 'Choose a menu',
      scegliMenuNota: 'You can save up to two favourite menus: you will find them here every time you open buonApp.',
      tuttaSettimana: 'Whole week',
      home: 'Home',
      indietro: 'Back',
      scegliEta: 'Choose your child’s age.',
      scegliDieta: 'Choose the diet.',
      fonte: 'Source: City of Turin, school meal service.',
      neiPreferiti: '★ In favourites',
      aggiungiPreferiti: '☆ Add to favourites',
      troppiPreferiti: 'You already have two favourite menus. Open one of them and remove it, then add this one.',
      settimana: 'Week',
      settimanaPrecedente: 'Previous week',
      settimanaSuccessiva: 'Next week',
      aggiornato: 'Menu updated on {quando}.',
      gruppi: {
        nidi: ['Nurseries', '6–9, 9–12 and 12–36 months'],
        infanzia: ['Preschools', 'Ages 3–6'],
        primaria: ['Primary schools', 'Ages 6–11'],
        secondaria: ['Middle schools', 'Ages 11–14'],
      },
      fasce: {
        'nido-6-9': 'Nursery 6–9 months',
        'nido-9-12': 'Nursery 9–12 months',
        'nido-12-36': 'Nursery 12–36 months',
        infanzia: 'Preschool',
        primaria: 'Primary school',
        secondaria: 'Middle school',
      },
      diete: {
        ordinario: 'Standard menu',
        'senza-carne': 'No meat',
        'senza-carne-pesce': 'No meat or fish',
        'senza-glutine': 'Gluten-free',
        'senza-proteine-animali': 'No animal protein',
        'senza-bovino': 'No beef',
        'senza-maiale': 'No pork',
      },
    },

    fr: {
      titolo: 'buonApp · Qu’est-ce qu’on mange à l’école aujourd’hui ?',
      descrizione: 'Le menu du jour des écoles de Turin, de la crèche au collège, pour tous les régimes.',
      slogan: 'On mange quoi à l’école aujourd’hui ?',
      lingua: 'Langue',
      carico: 'Chargement des menus…',
      piede: 'Menus de la restauration scolaire de la Ville de Turin, tirés des calendriers publiés par la Ville. En cas de doute, ce que l’école communique fait foi.',
      piattiInItaliano: 'Les noms des plats sont en italien, tels que publiés par la Ville de Turin.',
      installa: 'Installer l’appli sur le téléphone',
      privacy: 'Politique de confidentialité',
      oggi: 'Aujourd’hui, {giorno}',
      domani: 'Demain, {giorno}',
      merenda: 'Goûter :',
      calendarioUfficiale: 'Ouvrir le calendrier officiel',
      nonPubblicato: 'La Ville de Turin n’a pas encore publié le menu de ces jours. Il sera disponible sur cette page dès sa publication.',
      primoPubblicato: 'Le premier menu déjà publié est celui du {giorno}.',
      erroreMenu: 'Le menu n’a pas pu être chargé. Veuillez vérifier la connexion et réessayer.',
      erroreMenuTutti: 'Les menus n’ont pas pu être chargés. Veuillez vérifier la connexion et réessayer dans quelques minutes.',
      nonTrovato: 'Le menu demandé n’est pas disponible. Veuillez revenir à l’accueil et en choisir un autre.',
      tuoiMenu: 'Vos menus',
      altriMenu: 'Autres menus',
      scegliMenu: 'Choisissez le menu',
      scegliMenuNota: 'Vous pouvez enregistrer jusqu’à deux menus favoris : vous les retrouverez ici à chaque ouverture de buonApp.',
      tuttaSettimana: 'Toute la semaine',
      home: 'Accueil',
      indietro: 'Retour',
      scegliEta: 'Choisissez l’âge de l’enfant.',
      scegliDieta: 'Choisissez le régime.',
      fonte: 'Source : Ville de Turin, restauration scolaire.',
      neiPreferiti: '★ Dans les favoris',
      aggiungiPreferiti: '☆ Ajouter aux favoris',
      troppiPreferiti: 'Vous avez déjà deux menus favoris. Ouvrez l’un des deux et retirez-le, puis ajoutez celui-ci.',
      settimana: 'Semaine',
      settimanaPrecedente: 'Semaine précédente',
      settimanaSuccessiva: 'Semaine suivante',
      aggiornato: 'Menu mis à jour le {quando}.',
      gruppi: {
        nidi: ['Crèches', '6–9, 9–12 et 12–36 mois'],
        infanzia: ['Écoles maternelles', '3–6 ans'],
        primaria: ['Écoles primaires', '6–11 ans'],
        secondaria: ['Collèges', '11–14 ans'],
      },
      fasce: {
        'nido-6-9': 'Crèche 6–9 mois',
        'nido-9-12': 'Crèche 9–12 mois',
        'nido-12-36': 'Crèche 12–36 mois',
        infanzia: 'École maternelle',
        primaria: 'École primaire',
        secondaria: 'Collège',
      },
      diete: {
        ordinario: 'Menu standard',
        'senza-carne': 'Sans viande',
        'senza-carne-pesce': 'Sans viande ni poisson',
        'senza-glutine': 'Sans gluten',
        'senza-proteine-animali': 'Sans protéines animales',
        'senza-bovino': 'Sans bœuf',
        'senza-maiale': 'Sans porc',
      },
    },

    es: {
      titolo: 'buonApp · ¿Qué se come hoy en el cole?',
      descrizione: 'El menú del día de los colegios de Turín, de la guardería a la secundaria, para todas las dietas.',
      slogan: '¿Qué se come hoy en el cole?',
      lingua: 'Idioma',
      carico: 'Cargando los menús…',
      piede: 'Menús del comedor escolar del Ayuntamiento de Turín, tomados de los calendarios que publica el Ayuntamiento. En caso de duda, vale lo que comunique el colegio.',
      piattiInItaliano: 'Los nombres de los platos están en italiano, tal como los publica el Ayuntamiento de Turín.',
      installa: 'Instalar la app en el teléfono',
      privacy: 'Política de privacidad',
      oggi: 'Hoy, {giorno}',
      domani: 'Mañana, {giorno}',
      merenda: 'Merienda:',
      calendarioUfficiale: 'Abrir el calendario oficial',
      nonPubblicato: 'El Ayuntamiento de Turín todavía no ha publicado el menú de estos días. Estará disponible en esta página en cuanto se publique.',
      primoPubblicato: 'El primer menú ya publicado es el del {giorno}.',
      erroreMenu: 'No se ha podido cargar el menú. Compruebe la conexión y vuelva a intentarlo.',
      erroreMenuTutti: 'No se han podido cargar los menús. Compruebe la conexión y vuelva a intentarlo dentro de unos minutos.',
      nonTrovato: 'El menú solicitado no está disponible. Vuelva a la página inicial y elija otro.',
      tuoiMenu: 'Tus menús',
      altriMenu: 'Otros menús',
      scegliMenu: 'Elige el menú',
      scegliMenuNota: 'Puedes guardar hasta dos menús favoritos: los encontrarás aquí cada vez que abras buonApp.',
      tuttaSettimana: 'Toda la semana',
      home: 'Inicio',
      indietro: 'Atrás',
      scegliEta: 'Elige la edad del niño o de la niña.',
      scegliDieta: 'Elige la dieta.',
      fonte: 'Fuente: Ayuntamiento de Turín, comedor escolar.',
      neiPreferiti: '★ En favoritos',
      aggiungiPreferiti: '☆ Añadir a favoritos',
      troppiPreferiti: 'Ya tienes dos menús favoritos. Abre uno de los dos y quítalo, después añade este.',
      settimana: 'Semana',
      settimanaPrecedente: 'Semana anterior',
      settimanaSuccessiva: 'Semana siguiente',
      aggiornato: 'Menú actualizado el {quando}.',
      gruppi: {
        nidi: ['Guarderías', '6–9, 9–12 y 12–36 meses'],
        infanzia: ['Escuelas infantiles', '3–6 años'],
        primaria: ['Escuelas primarias', '6–11 años'],
        secondaria: ['Escuelas secundarias', '11–14 años'],
      },
      fasce: {
        'nido-6-9': 'Guardería 6–9 meses',
        'nido-9-12': 'Guardería 9–12 meses',
        'nido-12-36': 'Guardería 12–36 meses',
        infanzia: 'Escuela infantil',
        primaria: 'Escuela primaria',
        secondaria: 'Escuela secundaria',
      },
      diete: {
        ordinario: 'Menú normal',
        'senza-carne': 'Sin carne',
        'senza-carne-pesce': 'Sin carne ni pescado',
        'senza-glutine': 'Sin gluten',
        'senza-proteine-animali': 'Sin proteínas animales',
        'senza-bovino': 'Sin carne de vacuno',
        'senza-maiale': 'Sin carne de cerdo',
      },
    },

    ar: {
      titolo: 'buonApp · ماذا نأكل اليوم في المدرسة؟',
      descrizione: 'قائمة طعام اليوم في مدارس تورينو، من الحضانة إلى الإعدادية، لجميع الأنظمة الغذائية.',
      slogan: 'ماذا نأكل اليوم في المدرسة؟',
      lingua: 'اللغة',
      carico: 'جارٍ تحميل قوائم الطعام…',
      piede: 'قوائم طعام المطاعم المدرسية لبلدية تورينو، مأخوذة من التقاويم التي تنشرها البلدية. عند الشك يُعتمد ما تبلّغه المدرسة.',
      piattiInItaliano: 'أسماء الأطباق معروضة بالإيطالية كما تنشرها بلدية تورينو.',
      installa: 'ثبّت التطبيق على الهاتف',
      privacy: 'سياسة الخصوصية',
      oggi: 'اليوم، {giorno}',
      domani: 'غدًا، {giorno}',
      merenda: 'وجبة خفيفة:',
      calendarioUfficiale: 'افتح التقويم الرسمي',
      nonPubblicato: 'لم تنشر بلدية تورينو بعدُ قائمة الطعام لهذه الأيام. ستظهر في هذه الصفحة فور نشرها.',
      primoPubblicato: 'أول قائمة منشورة هي قائمة يوم {giorno}.',
      erroreMenu: 'تعذّر تحميل قائمة الطعام. يُرجى التحقق من الاتصال والمحاولة من جديد.',
      erroreMenuTutti: 'تعذّر تحميل قوائم الطعام. يُرجى التحقق من الاتصال والمحاولة بعد بضع دقائق.',
      nonTrovato: 'القائمة المطلوبة غير متوفرة. يُرجى العودة إلى الصفحة الرئيسية واختيار قائمة أخرى.',
      tuoiMenu: 'قوائمك',
      altriMenu: 'قوائم أخرى',
      scegliMenu: 'اختر قائمة الطعام',
      scegliMenuNota: 'يمكنك حفظ قائمتين مفضّلتين على الأكثر: ستجدهما هنا كلما فتحت buonApp.',
      tuttaSettimana: 'الأسبوع كاملًا',
      home: 'الرئيسية',
      indietro: 'رجوع',
      scegliEta: 'اختر عمر الطفل أو الطفلة.',
      scegliDieta: 'اختر النظام الغذائي.',
      fonte: 'المصدر: بلدية تورينو، خدمة المطاعم المدرسية.',
      neiPreferiti: '★ في المفضّلة',
      aggiungiPreferiti: '☆ أضف إلى المفضّلة',
      troppiPreferiti: 'لديك قائمتان مفضّلتان بالفعل. افتح إحداهما واحذفها ثم أضف هذه القائمة.',
      settimana: 'الأسبوع',
      settimanaPrecedente: 'الأسبوع السابق',
      settimanaSuccessiva: 'الأسبوع التالي',
      aggiornato: 'آخر تحديث للقائمة: {quando}.',
      gruppi: {
        nidi: ['دور الحضانة', '6–9 و9–12 و12–36 شهرًا'],
        infanzia: ['رياض الأطفال', '3–6 سنوات'],
        primaria: ['المدارس الابتدائية', '6–11 سنة'],
        secondaria: ['المدارس الإعدادية', '11–14 سنة'],
      },
      fasce: {
        'nido-6-9': 'حضانة 6–9 أشهر',
        'nido-9-12': 'حضانة 9–12 شهرًا',
        'nido-12-36': 'حضانة 12–36 شهرًا',
        infanzia: 'روضة الأطفال',
        primaria: 'المدرسة الابتدائية',
        secondaria: 'المدرسة الإعدادية',
      },
      diete: {
        ordinario: 'القائمة العادية',
        'senza-carne': 'بدون لحم',
        'senza-carne-pesce': 'بدون لحم ولا سمك',
        'senza-glutine': 'بدون غلوتين',
        'senza-proteine-animali': 'بدون بروتينات حيوانية',
        'senza-bovino': 'بدون لحم بقر',
        'senza-maiale': 'بدون لحم خنزير',
      },
    },
  };

  function scegli() {
    const param = new URLSearchParams(location.search).get('lang');
    if (param && LINGUE[param.toLowerCase()]) {
      // Un link con ?lang=xx vale come scelta dell'utente.
      try { localStorage.setItem(CHIAVE, param.toLowerCase()); } catch (e) { /* navigazione privata */ }
      return param.toLowerCase();
    }
    try {
      const salvata = localStorage.getItem(CHIAVE);
      if (salvata && LINGUE[salvata]) return salvata;
    } catch (e) { /* navigazione privata */ }
    for (const l of navigator.languages || [navigator.language || 'it']) {
      const codice = String(l).toLowerCase().split('-')[0];
      if (LINGUE[codice]) return codice;
    }
    return 'it';
  }

  const lingua = scegli();
  const testi = TESTI[lingua];

  function t(chiave, valori) {
    let s = testi[chiave];
    if (s === undefined) s = TESTI.it[chiave];
    if (s === undefined) return chiave;
    if (valori) for (const k in valori) s = s.replace('{' + k + '}', valori[k]);
    return s;
  }

  function imposta(nuova) {
    if (!LINGUE[nuova] || nuova === lingua) return;
    try { localStorage.setItem(CHIAVE, nuova); } catch (e) { /* navigazione privata */ }
    // Si toglie un eventuale ?lang= dall'indirizzo, altrimenti vincerebbe sulla scelta.
    const u = new URL(location.href);
    u.searchParams.delete('lang');
    history.replaceState(null, '', u);
    location.reload();
  }

  // Testi fissi della pagina: elementi con data-i18n (testo) e data-i18n-attr="attributo:chiave".
  function applica() {
    const html = document.documentElement;
    html.lang = lingua;
    html.dir = LINGUE[lingua].dir;
    document.title = t('titolo');
    const d = document.querySelector('meta[name="description"]');
    if (d) d.content = t('descrizione');
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const testo = t(el.dataset.i18n);
      el.textContent = testo;
      if (el.hasAttribute('data-i18n-vuoto')) el.hidden = !testo;
    });
    document.querySelectorAll('[data-i18n-attr]').forEach((el) => {
      const [attr, chiave] = el.dataset.i18nAttr.split(':');
      el.setAttribute(attr, t(chiave));
    });
    const sel = document.getElementById('lingua');
    if (sel) {
      sel.innerHTML = Object.keys(LINGUE).map((c) =>
        '<option value="' + c + '" lang="' + c + '"' + (c === lingua ? ' selected' : '') + '>' + LINGUE[c].nome + '</option>').join('');
      sel.addEventListener('change', () => imposta(sel.value));
    }
  }

  window.buonappLingua = {
    codice: lingua,
    locale: LINGUE[lingua].locale,
    rtl: LINGUE[lingua].dir === 'rtl',
    t: t,
    gruppo: (id) => testi.gruppi[id],
    fascia: (f) => testi.fasce[f.id] || f.nome,
    dieta: (d) => testi.diete[d.id] || d.nome,
    applica: applica,
  };

  // La direzione va impostata subito, prima che la pagina sia disegnata.
  document.documentElement.lang = lingua;
  document.documentElement.dir = LINGUE[lingua].dir;
})();
