#!/usr/bin/env python3
"""Genera l'informativa privacy di buonApp in italiano, inglese, francese, spagnolo e arabo.

Una pagina sola, senza file esterni, scritta in due posti:
  - privacy.html                           (dentro l'app, /buonapp/privacy.html)
  - play-store/privacy/buonapp/index.html  (da caricare in /privacy/buonapp/, l'indirizzo dato a Google Play)

Uso: python3 docs/privacy/genera.py
La lingua si sceglie dal menu, da ?lang=xx, dalla scelta fatta nell'app o dalla lingua del telefono.
"""
import html
import pathlib

RADICE = pathlib.Path(__file__).resolve().parents[2]
EMAIL = 'info@entratadisicurezza.com'
APP = 'https://www.entratadisicurezza.com/buonapp/'
GOAT = 'https://www.goatcounter.com/privacy'

# Per ogni lingua: nome, direzione, titolo, data, «torna all'app», poi le sezioni (titolo, paragrafi).
# {email} e {goat} diventano collegamenti.
LINGUE = {
    'it': {
        'nome': 'Italiano', 'dir': 'ltr',
        'titolo': 'Informativa sulla privacy',
        'data': 'Ultimo aggiornamento: 15 novembre 2026',
        'torna': 'Torna a buonApp',
        'intro': 'La presente informativa descrive come buonApp, nella versione web e nella versione per Android '
                 'distribuita tramite Google Play, tratta le informazioni degli utenti, ai sensi del Regolamento (UE) 2016/679 («GDPR»).',
        'sezioni': [
            ('Titolare', ['Il titolare del servizio è il gestore del sito entratadisicurezza.com, che può essere contattato all\'indirizzo {email}.']),
            ('Nessun dato personale raccolto', [
                'buonApp mostra i menu della ristorazione scolastica della Città di Torino. Per farlo non richiede registrazione, non contiene '
                'moduli da compilare e non raccoglie, conserva o condivide dati personali degli utenti né dei bambini e delle bambine. '
                'L\'applicazione non utilizza cookie, pubblicità o sistemi di profilazione, non contiene acquisti e non vende né cede dati a terzi.']),
            ('Statistiche di visita', [
                'Per sapere quante persone usano l\'applicazione, le visite sono contate con GoatCounter, un servizio di statistica che non usa '
                'cookie e non salva informazioni sul dispositivo. Il servizio non conserva l\'indirizzo IP: lo utilizza solo per ricavare il paese '
                'di provenienza e, insieme al tipo di browser, per calcolare un codice temporaneo tenuto in memoria per poche ore, che serve a non '
                'contare due volte la stessa visita. Sono registrati in forma aggregata la pagina visitata, il sito di provenienza, il tipo di browser '
                'e di sistema operativo, la lingua, le dimensioni dello schermo, il paese e l\'uso del pulsante «Installa l\'app».',
                'Questi dati non permettono di identificare una persona, non sono utilizzati per pubblicità o profilazione e non sono condivisi con '
                'altri soggetti; GoatCounter agisce come fornitore del servizio. La base giuridica è il legittimo interesse del titolare a conoscere, '
                'in forma aggregata, quanto viene usata l\'applicazione (art. 6, par. 1, lett. f del GDPR). Informativa del servizio: {goat}.']),
            ('Informazioni salvate sul dispositivo', [
                'I menu scelti come preferiti e la lingua scelta sono salvati esclusivamente nella memoria del dispositivo dell\'utente e non vengono '
                'trasmessi al server. Allo stesso modo, per consentire la consultazione anche in assenza di connessione, l\'applicazione conserva sul '
                'dispositivo una copia dei menu già visualizzati. Tali informazioni possono essere eliminate in qualsiasi momento cancellando i dati '
                'dell\'applicazione o del sito, oppure disinstallando l\'applicazione.']),
            ('Dati tecnici di navigazione', [
                'Come avviene per qualsiasi sito internet, il fornitore del servizio di hosting può registrare in modo automatico, nei propri log '
                'tecnici, alcune informazioni relative alle richieste ricevute (ad esempio indirizzo IP, data e ora, pagina richiesta). Tali dati sono '
                'trattati dal fornitore al solo fine di garantire il funzionamento e la sicurezza del servizio, per il tempo previsto dalle sue '
                'procedure. buonApp non li utilizza per identificare gli utenti né li associa ad altre informazioni.']),
            ('Collegamenti esterni', [
                'L\'applicazione contiene il collegamento «Vai al calendario ufficiale», che apre i calendari pubblicati dalla Città di Torino sul '
                'servizio Google Calendar. Una volta aperto il collegamento si applicano le condizioni e l\'informativa privacy di Google. '
                'Il download dell\'applicazione da Google Play è regolato dalle condizioni di Google.']),
            ('Minori', [
                'buonApp è rivolta ai genitori e alle famiglie, non ai bambini. In ogni caso non raccoglie dati personali di alcun utente, '
                'qualunque sia la sua età.']),
            ('Fonte dei menu', [
                'I menu sono ricavati dai calendari pubblici della Città di Torino. buonApp non è un\'applicazione ufficiale della Città di Torino. '
                'In caso di differenze, fa fede quanto comunicato dalla Città di Torino e dalla scuola.']),
            ('Diritti dell\'utente', [
                'Il GDPR riconosce il diritto di accedere ai propri dati, di farli correggere o cancellare, di limitarne il trattamento e di opporsi. '
                'Poiché buonApp non conserva dati che permettano di riconoscere una persona, non vi sono dati personali da consultare, correggere o '
                'cancellare. Per qualsiasi richiesta o chiarimento è possibile scrivere a {email}. Resta salvo il diritto di proporre reclamo al '
                'Garante per la protezione dei dati personali (www.garanteprivacy.it).']),
            ('Modifiche', ['Eventuali modifiche alla presente informativa saranno pubblicate su questa pagina, con l\'indicazione della data di aggiornamento.']),
        ],
    },
    'en': {
        'nome': 'English', 'dir': 'ltr',
        'titolo': 'Privacy policy',
        'data': 'Last updated: 15 November 2026',
        'torna': 'Back to buonApp',
        'intro': 'This policy explains how buonApp, in its web version and in the Android version distributed through Google Play, '
                 'handles users\' information under Regulation (EU) 2016/679 (“GDPR”).',
        'sezioni': [
            ('Data controller', ['The service is run by the operator of the website entratadisicurezza.com, who can be contacted at {email}.']),
            ('No personal data collected', [
                'buonApp shows the school meal menus of the City of Turin. To do so it requires no registration, contains no forms to fill in and '
                'does not collect, store or share personal data of users or of children. The app uses no cookies, advertising or profiling, '
                'contains no purchases and does not sell or pass data on to third parties.']),
            ('Visit statistics', [
                'To know how many people use the app, visits are counted with GoatCounter, a statistics service that uses no cookies and stores '
                'nothing on the device. The service does not keep the IP address: it uses it only to work out the country of origin and, together '
                'with the browser type, to compute a temporary code kept in memory for a few hours so that the same visit is not counted twice. '
                'The following are recorded in aggregate form: the page visited, the referring site, the browser and operating system, the language, '
                'the screen size, the country and the use of the “Install the app” button.',
                'This data cannot identify a person, is not used for advertising or profiling and is not shared with anyone else; GoatCounter acts '
                'as a service provider. The legal basis is the controller\'s legitimate interest in knowing, in aggregate form, how much the app is '
                'used (Art. 6(1)(f) GDPR). The service\'s own policy: {goat}.']),
            ('Information stored on the device', [
                'The menus chosen as favourites and the chosen language are stored only in the memory of the user\'s device and are not sent to the '
                'server. Likewise, so that the app can be used without a connection, it keeps on the device a copy of the menus already viewed. '
                'This information can be deleted at any time by clearing the app or site data, or by uninstalling the app.']),
            ('Technical browsing data', [
                'As with any website, the hosting provider may automatically record in its technical logs some information about the requests it '
                'receives (for example IP address, date and time, page requested). The provider processes this data only to keep the service '
                'working and secure, for the time set by its procedures. buonApp does not use it to identify users or combine it with other information.']),
            ('External links', [
                'The app contains the link “Open the official calendar”, which opens the calendars published by the City of Turin on Google Calendar. '
                'Once the link is opened, Google\'s terms and privacy policy apply. Downloading the app from Google Play is governed by Google\'s terms.']),
            ('Children', [
                'buonApp is aimed at parents and families, not at children. In any case it collects no personal data from any user, whatever their age.']),
            ('Source of the menus', [
                'The menus are taken from the public calendars of the City of Turin. buonApp is not an official app of the City of Turin. '
                'In case of differences, what the City of Turin and the school communicate prevails.']),
            ('Your rights', [
                'The GDPR gives you the right to access your data, to have it corrected or erased, to restrict its processing and to object. '
                'Since buonApp keeps no data that can identify a person, there is no personal data to consult, correct or erase. For any request or '
                'question you can write to {email}. You also have the right to lodge a complaint with the Italian data protection authority '
                '(Garante per la protezione dei dati personali, www.garanteprivacy.it).']),
            ('Changes', ['Any changes to this policy will be published on this page, with the date of the update.']),
        ],
    },
    'fr': {
        'nome': 'Français', 'dir': 'ltr',
        'titolo': 'Politique de confidentialité',
        'data': 'Dernière mise à jour : 15 novembre 2026',
        'torna': 'Retour à buonApp',
        'intro': 'Cette politique décrit comment buonApp, dans sa version web et dans sa version Android distribuée sur Google Play, '
                 'traite les informations des utilisateurs, conformément au Règlement (UE) 2016/679 (« RGPD »).',
        'sezioni': [
            ('Responsable du traitement', ['Le responsable du service est le gestionnaire du site entratadisicurezza.com, que l\'on peut contacter à l\'adresse {email}.']),
            ('Aucune donnée personnelle collectée', [
                'buonApp affiche les menus de la restauration scolaire de la Ville de Turin. Pour cela, elle ne demande aucune inscription, ne contient '
                'aucun formulaire et ne collecte, ne conserve ni ne partage aucune donnée personnelle des utilisateurs ou des enfants. L\'application '
                'n\'utilise ni cookies, ni publicité, ni profilage, ne propose aucun achat et ne vend ni ne cède aucune donnée à des tiers.']),
            ('Statistiques de visite', [
                'Pour savoir combien de personnes utilisent l\'application, les visites sont comptées avec GoatCounter, un service de statistiques qui '
                'n\'utilise pas de cookies et n\'enregistre rien sur l\'appareil. Le service ne conserve pas l\'adresse IP : il l\'utilise uniquement '
                'pour en déduire le pays d\'origine et, avec le type de navigateur, pour calculer un code temporaire gardé en mémoire quelques heures, '
                'afin de ne pas compter deux fois la même visite. Sont enregistrés sous forme agrégée : la page visitée, le site de provenance, '
                'le navigateur et le système d\'exploitation, la langue, la taille de l\'écran, le pays et l\'utilisation du bouton « Installer l\'appli ».',
                'Ces données ne permettent pas d\'identifier une personne, ne servent ni à la publicité ni au profilage et ne sont partagées avec '
                'personne ; GoatCounter agit en tant que prestataire. La base juridique est l\'intérêt légitime du responsable à connaître, sous forme '
                'agrégée, l\'utilisation de l\'application (art. 6, par. 1, point f du RGPD). Politique du service : {goat}.']),
            ('Informations enregistrées sur l\'appareil', [
                'Les menus choisis comme favoris et la langue choisie sont enregistrés uniquement dans la mémoire de l\'appareil de l\'utilisateur et ne '
                'sont pas transmis au serveur. De même, pour permettre la consultation sans connexion, l\'application conserve sur l\'appareil une copie '
                'des menus déjà consultés. Ces informations peuvent être supprimées à tout moment en effaçant les données de l\'application ou du site, '
                'ou en désinstallant l\'application.']),
            ('Données techniques de navigation', [
                'Comme pour tout site internet, l\'hébergeur peut enregistrer automatiquement, dans ses journaux techniques, certaines informations sur '
                'les requêtes reçues (par exemple adresse IP, date et heure, page demandée). L\'hébergeur traite ces données uniquement pour assurer le '
                'fonctionnement et la sécurité du service, pendant la durée prévue par ses procédures. buonApp ne les utilise pas pour identifier les '
                'utilisateurs et ne les associe à aucune autre information.']),
            ('Liens externes', [
                'L\'application contient le lien « Ouvrir le calendrier officiel », qui ouvre les calendriers publiés par la Ville de Turin sur '
                'Google Agenda. Une fois le lien ouvert, les conditions et la politique de confidentialité de Google s\'appliquent. Le téléchargement de '
                'l\'application depuis Google Play est régi par les conditions de Google.']),
            ('Mineurs', [
                'buonApp s\'adresse aux parents et aux familles, pas aux enfants. Dans tous les cas, elle ne collecte aucune donnée personnelle, '
                'quel que soit l\'âge de l\'utilisateur.']),
            ('Source des menus', [
                'Les menus proviennent des calendriers publics de la Ville de Turin. buonApp n\'est pas une application officielle de la Ville de Turin. '
                'En cas de différence, ce que communiquent la Ville de Turin et l\'école fait foi.']),
            ('Droits de l\'utilisateur', [
                'Le RGPD reconnaît le droit d\'accéder à ses données, de les faire rectifier ou effacer, d\'en limiter le traitement et de s\'y opposer. '
                'Comme buonApp ne conserve aucune donnée permettant de reconnaître une personne, il n\'y a pas de données personnelles à consulter, '
                'rectifier ou effacer. Pour toute demande ou précision, vous pouvez écrire à {email}. Vous conservez le droit d\'introduire une '
                'réclamation auprès de l\'autorité italienne de protection des données (Garante per la protezione dei dati personali, www.garanteprivacy.it).']),
            ('Modifications', ['Toute modification de cette politique sera publiée sur cette page, avec la date de mise à jour.']),
        ],
    },
    'es': {
        'nome': 'Español', 'dir': 'ltr',
        'titolo': 'Política de privacidad',
        'data': 'Última actualización: 15 de noviembre de 2026',
        'torna': 'Volver a buonApp',
        'intro': 'Esta política describe cómo buonApp, en su versión web y en la versión para Android distribuida a través de Google Play, '
                 'trata la información de los usuarios, conforme al Reglamento (UE) 2016/679 («RGPD»).',
        'sezioni': [
            ('Responsable', ['El responsable del servicio es el gestor del sitio entratadisicurezza.com, con quien se puede contactar en {email}.']),
            ('No se recogen datos personales', [
                'buonApp muestra los menús del comedor escolar del Ayuntamiento de Turín. Para ello no pide registro, no contiene formularios y no '
                'recoge, conserva ni comparte datos personales de los usuarios ni de los niños y niñas. La aplicación no utiliza cookies, publicidad '
                'ni sistemas de elaboración de perfiles, no contiene compras y no vende ni cede datos a terceros.']),
            ('Estadísticas de visitas', [
                'Para saber cuántas personas usan la aplicación, las visitas se cuentan con GoatCounter, un servicio de estadísticas que no usa cookies '
                'y no guarda nada en el dispositivo. El servicio no conserva la dirección IP: la utiliza solo para deducir el país de procedencia y, '
                'junto con el tipo de navegador, para calcular un código temporal que se mantiene en memoria unas horas y sirve para no contar dos '
                'veces la misma visita. Se registran de forma agregada la página visitada, el sitio de procedencia, el navegador y el sistema '
                'operativo, el idioma, el tamaño de la pantalla, el país y el uso del botón «Instalar la app».',
                'Estos datos no permiten identificar a una persona, no se utilizan para publicidad ni para elaborar perfiles y no se comparten con '
                'nadie más; GoatCounter actúa como proveedor del servicio. La base jurídica es el interés legítimo del responsable en conocer, de forma '
                'agregada, cuánto se usa la aplicación (art. 6, apdo. 1, letra f del RGPD). Política del servicio: {goat}.']),
            ('Información guardada en el dispositivo', [
                'Los menús elegidos como favoritos y el idioma elegido se guardan únicamente en la memoria del dispositivo del usuario y no se envían '
                'al servidor. Del mismo modo, para poder consultarla sin conexión, la aplicación conserva en el dispositivo una copia de los menús ya '
                'vistos. Esta información se puede eliminar en cualquier momento borrando los datos de la aplicación o del sitio, o desinstalando la aplicación.']),
            ('Datos técnicos de navegación', [
                'Como ocurre con cualquier sitio web, el proveedor de alojamiento puede registrar automáticamente, en sus registros técnicos, alguna '
                'información sobre las solicitudes recibidas (por ejemplo dirección IP, fecha y hora, página solicitada). El proveedor trata estos '
                'datos únicamente para garantizar el funcionamiento y la seguridad del servicio, durante el tiempo previsto en sus procedimientos. '
                'buonApp no los utiliza para identificar a los usuarios ni los asocia a otra información.']),
            ('Enlaces externos', [
                'La aplicación contiene el enlace «Abrir el calendario oficial», que abre los calendarios publicados por el Ayuntamiento de Turín en '
                'Google Calendar. Una vez abierto el enlace se aplican las condiciones y la política de privacidad de Google. La descarga de la '
                'aplicación desde Google Play se rige por las condiciones de Google.']),
            ('Menores', [
                'buonApp está dirigida a los padres y a las familias, no a los niños. En cualquier caso, no recoge datos personales de ningún usuario, '
                'sea cual sea su edad.']),
            ('Fuente de los menús', [
                'Los menús proceden de los calendarios públicos del Ayuntamiento de Turín. buonApp no es una aplicación oficial del Ayuntamiento de '
                'Turín. En caso de diferencias, prevalece lo que comuniquen el Ayuntamiento de Turín y el colegio.']),
            ('Derechos del usuario', [
                'El RGPD reconoce el derecho a acceder a los propios datos, a rectificarlos o suprimirlos, a limitar su tratamiento y a oponerse. '
                'Como buonApp no conserva datos que permitan reconocer a una persona, no hay datos personales que consultar, rectificar o suprimir. '
                'Para cualquier solicitud o aclaración se puede escribir a {email}. Se mantiene el derecho a presentar una reclamación ante la '
                'autoridad italiana de protección de datos (Garante per la protezione dei dati personali, www.garanteprivacy.it).']),
            ('Cambios', ['Cualquier cambio en esta política se publicará en esta página, con la fecha de actualización.']),
        ],
    },
    'ar': {
        'nome': 'العربية', 'dir': 'rtl',
        'titolo': 'سياسة الخصوصية',
        'data': 'آخر تحديث: 15 نوفمبر 2026',
        'torna': 'العودة إلى buonApp',
        'intro': 'توضّح هذه السياسة كيف يتعامل تطبيق buonApp، في نسخته على الويب وفي نسخته لنظام أندرويد الموزَّعة عبر Google Play، '
                 'مع معلومات المستخدمين، وفقًا للّائحة الأوروبية (EU) 2016/679 (اللائحة العامة لحماية البيانات «GDPR»).',
        'sezioni': [
            ('المسؤول عن المعالجة', ['المسؤول عن الخدمة هو مدير موقع entratadisicurezza.com، ويمكن التواصل معه على العنوان {email}.']),
            ('لا تُجمع أي بيانات شخصية', [
                'يعرض buonApp قوائم طعام المطاعم المدرسية لبلدية تورينو. ولا يتطلّب ذلك أي تسجيل، ولا يحتوي التطبيق على نماذج للتعبئة، ولا يجمع '
                'أو يحفظ أو يشارك أي بيانات شخصية للمستخدمين أو للأطفال. لا يستخدم التطبيق ملفات تعريف الارتباط (الكوكيز) ولا الإعلانات ولا أنظمة '
                'التنميط، ولا يحتوي على مشتريات، ولا يبيع البيانات ولا يسلّمها لأطراف أخرى.']),
            ('إحصاءات الزيارات', [
                'لمعرفة عدد الأشخاص الذين يستخدمون التطبيق، تُحصى الزيارات بواسطة GoatCounter، وهي خدمة إحصاءات لا تستخدم الكوكيز ولا تحفظ أي '
                'شيء على الجهاز. لا تحتفظ الخدمة بعنوان IP: تستخدمه فقط لمعرفة بلد الزائر، ومع نوع المتصفح لحساب رمز مؤقت يبقى في الذاكرة بضع '
                'ساعات حتى لا تُحسب الزيارة نفسها مرتين. وتُسجَّل بصورة مجمّعة: الصفحة التي تمت زيارتها، والموقع المُحيل، ونوع المتصفح ونظام '
                'التشغيل، واللغة، وحجم الشاشة، والبلد، واستخدام زر «ثبّت التطبيق».',
                'لا تسمح هذه البيانات بتحديد هوية أي شخص، ولا تُستخدم للإعلانات أو التنميط، ولا تُشارَك مع أي جهة أخرى؛ وتعمل GoatCounter بصفتها '
                'مزوّد خدمة. الأساس القانوني هو المصلحة المشروعة للمسؤول في معرفة مدى استخدام التطبيق بصورة مجمّعة (المادة 6، الفقرة 1، البند (و) '
                'من اللائحة). سياسة الخدمة: {goat}.']),
            ('المعلومات المحفوظة على الجهاز', [
                'القوائم المختارة كمفضّلة واللغة المختارة تُحفظ فقط في ذاكرة جهاز المستخدم ولا تُرسل إلى الخادم. وكذلك، لإتاحة التصفح دون اتصال، '
                'يحتفظ التطبيق على الجهاز بنسخة من القوائم التي سبق عرضها. يمكن حذف هذه المعلومات في أي وقت بمسح بيانات التطبيق أو الموقع، '
                'أو بإلغاء تثبيت التطبيق.']),
            ('بيانات التصفح التقنية', [
                'كما في أي موقع على الإنترنت، قد يسجّل مزوّد خدمة الاستضافة تلقائيًا، في سجلاته التقنية، بعض المعلومات عن الطلبات الواردة (مثل '
                'عنوان IP والتاريخ والوقت والصفحة المطلوبة). يعالج المزوّد هذه البيانات فقط لضمان عمل الخدمة وأمنها، وللمدة التي تحددها إجراءاته. '
                'لا يستخدمها buonApp لتحديد هوية المستخدمين ولا يربطها بأي معلومات أخرى.']),
            ('الروابط الخارجية', [
                'يحتوي التطبيق على الرابط «افتح التقويم الرسمي»، الذي يفتح التقاويم التي تنشرها بلدية تورينو على خدمة Google Calendar. بعد فتح '
                'الرابط تنطبق شروط Google وسياسة الخصوصية الخاصة بها. تنزيل التطبيق من Google Play يخضع لشروط Google.']),
            ('القاصرون', [
                'buonApp موجَّه إلى أولياء الأمور والعائلات، وليس إلى الأطفال. وفي كل الأحوال لا يجمع بيانات شخصية لأي مستخدم مهما كان عمره.']),
            ('مصدر قوائم الطعام', [
                'قوائم الطعام مأخوذة من التقاويم العامة لبلدية تورينو. buonApp ليس تطبيقًا رسميًا لبلدية تورينو. عند وجود اختلاف، يُعتمد ما تبلّغه '
                'بلدية تورينو والمدرسة.']),
            ('حقوق المستخدم', [
                'تمنح اللائحة العامة لحماية البيانات حق الوصول إلى البيانات الشخصية وتصحيحها أو حذفها وتقييد معالجتها والاعتراض عليها. وبما أن '
                'buonApp لا يحتفظ ببيانات تسمح بالتعرّف على شخص، فلا توجد بيانات شخصية للاطلاع عليها أو تصحيحها أو حذفها. لأي طلب أو استفسار '
                'يمكن الكتابة إلى {email}. ويبقى لكم الحق في تقديم شكوى إلى الهيئة الإيطالية لحماية البيانات الشخصية '
                '(Garante per la protezione dei dati personali، www.garanteprivacy.it).']),
            ('التعديلات', ['أي تعديل على هذه السياسة سيُنشر في هذه الصفحة مع ذكر تاريخ التحديث.']),
        ],
    },
}

CSS = """
:root{--giallo:#fcbb21;--verde:#7c9b3d;--rosso:#b8292d;--acqua:#63bba2;--arancio:#eb8829;
--sfondo:#fffaf0;--carta:#fff;--testo:#1f1d1a;--tenue:#5b554c;--bordo:#e8dfcf}
@media (prefers-color-scheme:dark){:root{--sfondo:#1b1915;--carta:#26231e;--testo:#f4efe6;--tenue:#c2b9aa;--bordo:#3a352d}}
*{box-sizing:border-box}html{-webkit-text-size-adjust:100%}
body{margin:0;background:var(--sfondo);color:var(--testo);
font:17px/1.6 system-ui,-apple-system,"Segoe UI",Roboto,"Noto Sans Arabic","Helvetica Neue",Arial,sans-serif}
header{background:var(--giallo);color:#1f1d1a;padding:calc(14px + env(safe-area-inset-top)) 16px 0}
.riga{max-width:680px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;gap:12px;padding-bottom:16px}
.marchio{font-weight:800;font-size:1.5rem;color:#b8292d;text-decoration:none}
.strisce{height:10px;margin:0 -16px;background:linear-gradient(90deg,var(--verde) 0 25%,var(--rosso) 25% 50%,var(--arancio) 50% 75%,var(--acqua) 75% 100%)}
select{font:inherit;font-size:.9rem;min-height:40px;padding:4px 10px;border-radius:999px;border:1px solid rgb(31 29 26/.35);background:rgb(255 255 255/.8);color:#1f1d1a}
main{max-width:680px;margin:0 auto;padding:16px 16px 48px}
h1{font-size:1.5rem;line-height:1.2;margin:16px 0 4px}h2{font-size:1.1rem;line-height:1.3;margin:28px 0 8px}
p{margin:0 0 12px}.data,.torna{color:var(--tenue)}.torna{display:inline-block;margin-top:8px}
a{color:inherit}a:focus-visible,select:focus-visible{outline:3px solid var(--arancio);outline-offset:2px}
article + article{border-top:1px solid var(--bordo);margin-top:40px;padding-top:8px}
.js article{display:none}.js article.attiva{display:block;border:0;margin:0;padding:0}
"""

JS = """
(function(){var L=%s,d=document,h=d.documentElement,scelta='it',p=new URLSearchParams(location.search).get('lang'),s=null;
try{s=localStorage.getItem('buonapp.lingua')}catch(e){}
var c=[p,s].concat(navigator.languages||[navigator.language]);
for(var i=0;i<c.length;i++){var x=String(c[i]||'').toLowerCase().split('-')[0];if(L[x]){scelta=x;break}}
function mostra(l){h.lang=l;h.dir=L[l].dir;d.title=L[l].titolo+' · buonApp';
d.querySelectorAll('article').forEach(function(a){a.classList.toggle('attiva',a.lang===l)});
d.getElementById('lingua').value=l;d.getElementById('lingua').setAttribute('aria-label',L[l].etichetta)}
h.classList.add('js');d.addEventListener('DOMContentLoaded',function(){var sel=d.getElementById('lingua');sel.hidden=false;
sel.addEventListener('change',function(){mostra(sel.value);history.replaceState(null,'','?lang='+sel.value)});mostra(scelta)});})();
"""

ETICHETTE = {'it': 'Lingua', 'en': 'Language', 'fr': 'Langue', 'es': 'Idioma', 'ar': 'اللغة'}


def paragrafo(testo):
    t = html.escape(testo, quote=False)
    t = t.replace('{email}', f'<a href="mailto:{EMAIL}" dir="ltr">{EMAIL}</a>')
    t = t.replace('{goat}', f'<a href="{GOAT}" dir="ltr" rel="noopener">goatcounter.com/privacy</a>')
    return f'    <p>{t}</p>'


def pagina():
    articoli = []
    for codice, l in LINGUE.items():
        righe = [f'  <article lang="{codice}" dir="{l["dir"]}">',
                 f'    <h1>{html.escape(l["titolo"])}</h1>',
                 f'    <p class="data">{html.escape(l["data"])}</p>',
                 paragrafo(l['intro'])]
        for titolo, paragrafi in l['sezioni']:
            righe.append(f'    <h2>{html.escape(titolo, quote=False)}</h2>')
            righe += [paragrafo(p) for p in paragrafi]
        righe.append(f'    <p><a class="torna" href="{APP}?lang={codice}">{html.escape(l["torna"])}</a></p>')
        righe.append('  </article>')
        articoli.append('\n'.join(righe))
    opzioni = ''.join(f'<option value="{c}" lang="{c}">{l["nome"]}</option>' for c, l in LINGUE.items())
    dati = '{' + ','.join(
        f'{c}:{{dir:"{l["dir"]}",titolo:"{l["titolo"]}",etichetta:"{ETICHETTE[c]}"}}' for c, l in LINGUE.items()) + '}'
    return f"""<!doctype html>
<!-- File generato da docs/privacy/genera.py: non modificarlo a mano. -->
<html lang="it" dir="ltr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Informativa sulla privacy · buonApp</title>
<meta name="description" content="buonApp: informativa sulla privacy / privacy policy / politique de confidentialité / política de privacidad / سياسة الخصوصية">
<meta name="theme-color" content="#fcbb21">
<style>{CSS}</style>
<script>{JS % dati}</script>
</head>
<body>
<header>
  <div class="riga">
    <a class="marchio" href="{APP}">buonApp</a>
    <select id="lingua" aria-label="Lingua" hidden>{opzioni}</select>
  </div>
  <div class="strisce" aria-hidden="true"></div>
</header>
<main>
{chr(10).join(articoli)}
</main>
</body>
</html>
"""


if __name__ == '__main__':
    testo = pagina()
    for destinazione in ('privacy.html', 'play-store/privacy/buonapp/index.html'):
        f = RADICE / destinazione
        f.parent.mkdir(parents=True, exist_ok=True)
        f.write_text(testo, encoding='utf-8')
        print('scritto', destinazione)
