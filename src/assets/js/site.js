import './polyfill';
import 'what-input';
import 'inobounce';

import jsAlignHeight from './namespace/js/jsAlignHeight';
import jsSmoothScroll from './namespace/js/jsSmoothScroll';
import stBackToTop from './namespace/structure/stBackToTop';
import stBreadcrumb from './namespace/structure/stBreadcrumb';
import swDialog from './namespace/sitewide/swDialog';

jsAlignHeight();
jsSmoothScroll();
stBackToTop();
stBreadcrumb();
swDialog();
Promise.resolve().then(res => console.log('Promise end'));// eslint-disable-line
