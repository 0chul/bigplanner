import { demoRequestCopy, englishDemoFieldErrors, type DemoRequestFormTranslation } from '../components/fireSafetyDemoRequestCopy';
import ar from '../components/fireSafetyDemoRequestLocales/ar.json';
import da from '../components/fireSafetyDemoRequestLocales/da.json';
import de from '../components/fireSafetyDemoRequestLocales/de.json';
import es from '../components/fireSafetyDemoRequestLocales/es.json';
import fi from '../components/fireSafetyDemoRequestLocales/fi.json';
import fr from '../components/fireSafetyDemoRequestLocales/fr.json';
import he from '../components/fireSafetyDemoRequestLocales/he.json';
import is from '../components/fireSafetyDemoRequestLocales/is.json';
import it from '../components/fireSafetyDemoRequestLocales/it.json';
import ja from '../components/fireSafetyDemoRequestLocales/ja.json';
import nb from '../components/fireSafetyDemoRequestLocales/nb.json';
import nl from '../components/fireSafetyDemoRequestLocales/nl.json';
import sv from '../components/fireSafetyDemoRequestLocales/sv.json';
import zhHant from '../components/fireSafetyDemoRequestLocales/zh-hant.json';

type DemoRequestTranslation = DemoRequestFormTranslation & {
  page: { title: string; description: string; back: string; heading: string; intro: string };
};

export const internationalDemoRequestCopy: Readonly<Record<string, DemoRequestTranslation>> = {
  en: {
    page: {
      title: 'Request a facilities AI demo | BigPlanner Partners',
      description: 'Request an online demonstration of BigPlanner Partners’ AI tenant service desk for commercial facilities teams.',
      back: 'Watch the product demo',
      heading: 'See the AI helpdesk in action',
      intro: 'See how tenant requests move across shifts and discuss your building’s workflow. The public walkthrough shows Korean screens with English captions.',
    },
    form: demoRequestCopy.en,
    errors: englishDemoFieldErrors,
  },
  ar, da, de, es, fi, fr, he, is, it, ja, nb, nl, sv, 'zh-Hant': zhHant,
};
