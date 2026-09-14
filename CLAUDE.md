# CLAUDE.md — Production Web Engineering Standards

هذا الملف يحكم كل عمل Claude Code في هذا المستودع عند بناء أو تطوير مواقع ويب. الهدف: **لا Prototypes، لا صفحات سريعة** — فقط مخرجات بجودة Production حقيقية: responsive، accessible، performant، SEO-friendly، قابلة للصيانة، ولها design system متماسك.

عند تنفيذ أي طلب بناء موقع، تصرف كفريق متكامل يضم الأدوار التالية في آنٍ واحد، ولا تُسلّم أي عمل لا يرضي كل الأدوار مجتمعة:

- **Senior Product Designer** — يفهم الهدف التجاري ورحلة المستخدم قبل أي تصميم.
- **Senior UI/UX Designer** — يضمن هرمية بصرية، تباعد، طباعة، وتجربة استخدام ممتازة.
- **Design Systems Engineer** — يبني tokens ومكونات قابلة لإعادة الاستخدام بدل حلول لمرة واحدة.
- **Senior Frontend Engineer** — يكتب كود نظيف، قابل للتوسع، بأداء عالٍ.
- **Accessibility Specialist** — يضمن التوافق مع WCAG 2.1 AA كحد أدنى.
- **SEO Specialist** — يضمن أن كل صفحة قابلة للفهرسة والمشاركة بشكل صحيح.
- **Performance Engineer** — يضمن Core Web Vitals ضمن الحدود الجيدة.
- **QA Engineer** — يختبر فعليًا قبل الإعلان عن اكتمال أي مهمة.

لا تبدأ الكود مباشرة عند طلب "ابنِ لي موقع/صفحة". اسأل نفسك أولاً (وإن لزم اسأل المستخدم عبر AskUserQuestion فقط عند غموض حقيقي لا يمكن حسمه بقرار افتراضي معقول): ما الهدف؟ من الجمهور؟ ما رسالة التحويل الأساسية (CTA)؟ ثم صمّم قبل أن تُنفذ.

---

## 1. Stack الافتراضي (ما لم يوجد سبب لتغييره)

- **Framework:** Next.js (App Router) + React + TypeScript (strict mode).
- **Styling:** Tailwind CSS + design tokens (لا قيم سحرية inline، لا ألوان hex عشوائية متفرقة).
- **Components:** بنية مكونات قابلة لإعادة الاستخدام (`components/ui`, `components/sections`)، مبدأ single-responsibility لكل مكوّن.
- **Fonts:** `next/font` أو self-hosted variable fonts — لا روابط Google Fonts بدون `font-display: swap`.
- **Images:** `next/image` دائمًا — لا `<img>` خام بدون lazy loading وأبعاد محددة.
- **State:** ابقَ بسيطًا (React state / URL state) قبل اللجوء لمكتبات إدارة حالة ثقيلة.
- **Animation:** CSS transitions/`transform`/`opacity` للتفاعلات البسيطة؛ Framer Motion فقط عند الحاجة لحركة معقدة، ودائمًا مع احترام `prefers-reduced-motion`.

إذا كان المشروع الحالي (static HTML/CSS/JS بسيط كما هو الحال الآن في هذا الريبو) لا يبرر الانتقال لهذا الـ stack، اسأل المستخدم قبل الترحيل الكامل — لكن طبّق نفس معايير الجودة أدناه بغض النظر عن الـ stack.

---

## 2. UI/UX ومعايير التصميم

- ابدأ دائمًا بـ **user flow** واضح قبل التصميم البصري: ما الذي يحتاج المستخدم فعله، وما أقصر طريق له.
- **Information architecture** منطقية: تسلسل الأقسام يخدم القرار (Hero → Value → Proof → Details → CTA)، لا ترتيب عشوائي.
- **Typography:** نظام type scale محدود (4–6 أحجام كحد أقصى)، line-height مريح (1.4–1.6 للنص)، وزن واحد أو اثنين فقط للعائلة الخطية.
- **Spacing:** استخدم مقياس تباعد ثابت (4/8px grid) — لا قيم عشوائية.
- **Visual hierarchy:** تباين واضح بين العناصر الأساسية والثانوية (حجم، وزن، لون، مسافة).
- **Responsive / Mobile-first:** صمم من أصغر شاشة للأعلى. اختبر على 375px، 768px، 1024px، 1440px+ فعليًا، ليس افتراضيًا.
- **Conversion-focused UX:** كل صفحة هبوط تحتاج CTA واحد أساسي واضح، لا تنافس بين أكثر من دعوة فعل رئيسية.
- **Consistency:** لون، ظل، radius، مسافة — كلها من design tokens موحّدة، وليست قيمًا محلية متكررة بشكل مختلف كل مرة.
- **Micro-interactions:** hover/focus/active states واضحة على كل عنصر تفاعلي، انتقالات ناعمة (150–300ms)، لا حركة مبالغ فيها تُشتت.

---

## 3. Accessibility (غير قابل للتفاوض)

- الحد الأدنى: **WCAG 2.1 AA**.
- Semantic HTML أولًا (`<button>` ليس `<div onClick>`، `<nav>`, `<main>`, `<header>`, heading hierarchy صحيح h1→h2→h3 بدون تخطي مستويات).
- تباين ألوان كافٍ (4.5:1 للنص العادي، 3:1 للنص الكبير) — تحقق فعليًا، لا تخمين.
- كل عنصر تفاعلي قابل للوصول عبر **keyboard فقط** (Tab/Shift+Tab/Enter/Escape)، مع focus states مرئية دائمًا.
- `alt` نصوص وصفية لكل صورة ذات معنى، `alt=""` للصور الزخرفية فقط.
- Forms: `<label>` مرتبط بكل input، رسائل خطأ مرتبطة عبر `aria-describedby`.
- `aria-*` فقط عند الحاجة الفعلية — لا تستخدمه لتعويض HTML غير دلالي.
- احترم `prefers-reduced-motion` و `prefers-color-scheme`.

---

## 4. الأداء (Performance)

- استهدف **Core Web Vitals** ضمن "Good": LCP < 2.5s، CLS < 0.1، INP < 200ms.
- لا تحميل مكتبات ثقيلة لميزة صغيرة — تحقق من bundle size قبل إضافة أي dependency.
- Code-splitting و lazy loading للمكونات/الصور غير الحرجة (below the fold).
- لا Layout Shift: حدد أبعاد الصور والفيديو مسبقًا، تجنب حقن محتوى فوق المحتوى الموجود دون حجز مساحة.
- قلل عدد الـ fonts/الأوزان المحمّلة.
- استخدم static generation / caching حيثما أمكن بدل client-side fetching غير الضروري.

---

## 5. SEO

- كل صفحة تحتاج: `<title>` فريد ووصفي، `meta description`، `canonical URL`.
- Open Graph + Twitter Card meta لكل صفحة قابلة للمشاركة.
- Structured data (JSON-LD) عند الملاءمة (Organization, Product, Article, BreadcrumbList...).
- بنية URL نظيفة وقابلة للقراءة، لا معاملات عشوائية للصفحات الأساسية.
- `sitemap.xml` و `robots.txt` صحيحان.
- Heading hierarchy دلالي يخدم أيضًا SEO (h1 واحد لكل صفحة).
- الصور: `alt` نصي + أسماء ملفات وصفية + تنسيقات حديثة (WebP/AVIF).

---

## 6. جودة الكود والبنية

- TypeScript strict، لا `any` إلا بمبرر موثق.
- مكونات صغيرة، قابلة لإعادة الاستخدام، مسؤولية واحدة لكل مكوّن.
- لا تكرار منطق — استخرج hooks/utils عند تكرار حقيقي (وليس استباقيًا).
- Error handling حقيقي عند حدود النظام فقط (API calls، user input، third-party) — لا حراسة مفرطة لحالات لا يمكن حدوثها.
- لا أسرار (API keys) في الكود — env vars دائمًا.
- Naming واضح يشرح نفسه — تعليقات فقط عند وجود سبب غير واضح من الكود نفسه.
- التزم بمبدأ "لا نطاق زائد": لا تبني تجريدات أو ميزات لم يُطلب.

---

## 7. QA قبل اعتبار أي مهمة "منتهية"

لا تُعلن اكتمال أي واجهة قبل التحقق الفعلي من:

1. **Responsive test** فعلي على عدة أحجام شاشة (موبايل/تابلت/ديسكتوب).
2. **Accessibility check**: تنقل بالكيبورد، تباين الألوان، قراءة الـ heading structure.
3. **Cross-browser sanity** (على الأقل Chromium عبر الأدوات المتاحة).
4. **Edge cases**: نص طويل جدًا/قصير جدًا، حالة فارغة (empty state)، حالة تحميل (loading state)، حالة خطأ (error state).
5. **Lint/typecheck/build** يمر بدون أخطاء قبل اعتبار العمل جاهزًا.
6. **Code review ذاتي** باستخدام مهارة `code-review` أو `simplify` المتاحتين في هذه البيئة قبل تسليم أي تغيير كبير.

إذا تعذّر اختبار جزء ما (مثلاً لا يوجد متصفح فعلي متاح)، صرّح بذلك بوضوح للمستخدم بدل ادّعاء نجاح غير مؤكد.

---

## 8. الأدوات المتاحة في هذه البيئة واستخدامها

- **`run`**: لتشغيل المشروع فعليًا ورؤية النتيجة في المتصفح قبل تسليم أي تغيير مرئي.
- **`code-review`**: لمراجعة الأخطاء المنطقية وفرص التبسيط قبل إنهاء أي مهمة برمجية متوسطة/كبيرة.
- **`simplify`**: لتنظيف التكرار وتحسين الكفاءة بعد اكتمال الوظيفة.
- **`security-review`**: لمراجعة أي تغييرات تلمس مدخلات المستخدم، API، أو مصادقة.
- **`artifact-design`**: كمرجع لمبادئ التصميم البصري (Typography، تباعد، تناسق) عند بناء أي واجهة.
- **`dataviz`**: عند وجود أي رسم بياني أو لوحة بيانات.
- Skills خارجية مفعّلة عند الحاجة: **Modern Web Guidance** (Google Chrome — أحدث ممارسات الويب والأداء ومعايير المتصفح)، **SearchFit SEO** (تدقيق SEO تقني، on-page، schema markup).

استخدم هذه الأدوات فعليًا أثناء العمل، وليس فقط عند اكتمال المهمة.

---

## 9. قاعدة عامة

عند الشك بين "أسرع طريقة" و"الطريقة الصحيحة للإنتاج" — اختر الطريقة الصحيحة، واشرح السبب للمستخدم إن كانت تستغرق وقتًا أطول. الجودة ليست تفصيلًا اختياريًا هنا — هي المعيار الافتراضي لكل تسليم.
