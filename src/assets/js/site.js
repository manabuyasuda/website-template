'use strict';
import './polyfill';
import 'what-input';

import vueTest from './vue';
import jsAlignHeight from './namespace/js/alignHeight';
import jsSmoothScroll from './namespace/js/smoothScroll';
import structureBackToTop from './namespace/structure/backToTop';
import sitewideDialog from './namespace/sitewide/dialog';

vueTest();
jsAlignHeight();
jsSmoothScroll();
structureBackToTop();
sitewideDialog();
