import { renderers } from './renderers.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_CfX3a6iG.mjs';
import { manifest } from './manifest_ksTOg1_E.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image/index.astro.mjs');
const _page1 = () => import('./pages/404.astro.mjs');
const _page2 = () => import('./pages/about-us.astro.mjs');
const _page3 = () => import('./pages/api/lead.astro.mjs');
const _page4 = () => import('./pages/ayurvedic-spa.astro.mjs');
const _page5 = () => import('./pages/ayurvedic-treatments.astro.mjs');
const _page6 = () => import('./pages/book-appointment.astro.mjs');
const _page7 = () => import('./pages/client_testimonial/_slug_.astro.mjs');
const _page8 = () => import('./pages/conditions.astro.mjs');
const _page9 = () => import('./pages/contact-us.astro.mjs');
const _page10 = () => import('./pages/detox-clinic.astro.mjs');
const _page11 = () => import('./pages/doctor/_slug_.astro.mjs');
const _page12 = () => import('./pages/journal.astro.mjs');
const _page13 = () => import('./pages/product/_slug_.astro.mjs');
const _page14 = () => import('./pages/services/_slug_.astro.mjs');
const _page15 = () => import('./pages/shop.astro.mjs');
const _page16 = () => import('./pages/team.astro.mjs');
const _page17 = () => import('./pages/treatments.astro.mjs');
const _page18 = () => import('./pages/what-is-your-dosha.astro.mjs');
const _page19 = () => import('./pages/index.astro.mjs');
const _page20 = () => import('./pages/_---slug_.astro.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/404.astro", _page1],
    ["src/pages/about-us/index.astro", _page2],
    ["src/pages/api/lead.ts", _page3],
    ["src/pages/ayurvedic-spa/index.astro", _page4],
    ["src/pages/ayurvedic-treatments/index.astro", _page5],
    ["src/pages/book-appointment/index.astro", _page6],
    ["src/pages/client_testimonial/[slug].astro", _page7],
    ["src/pages/conditions/index.astro", _page8],
    ["src/pages/contact-us/index.astro", _page9],
    ["src/pages/detox-clinic/index.astro", _page10],
    ["src/pages/doctor/[slug].astro", _page11],
    ["src/pages/journal/index.astro", _page12],
    ["src/pages/product/[slug].astro", _page13],
    ["src/pages/services/[slug].astro", _page14],
    ["src/pages/shop/index.astro", _page15],
    ["src/pages/team/index.astro", _page16],
    ["src/pages/treatments/index.astro", _page17],
    ["src/pages/what-is-your-dosha/index.astro", _page18],
    ["src/pages/index.astro", _page19],
    ["src/pages/[...slug].astro", _page20]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./noop-entrypoint.mjs'),
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "middlewareSecret": "854060df-12e9-4581-870a-7241d3a3e9be",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) ;

export { __astrojsSsrVirtualEntry as default, pageMap };
