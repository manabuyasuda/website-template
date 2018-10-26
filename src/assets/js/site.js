'use strict';
import './polyfill';
import 'what-input';

import vueTest from './vue';
import jsAlignHeight from './namespace/js/alignHeight';
import jsSmoothScroll from './namespace/js/smoothScroll';
import structureBackToTop from './namespace/structure/backToTop';
import structureBreadcrumb from './namespace/structure/Breadcrumb';
import sitewideDialog from './namespace/sitewide/dialog';

vueTest();
jsAlignHeight();
jsSmoothScroll();
structureBackToTop();
structureBreadcrumb();
sitewideDialog();
