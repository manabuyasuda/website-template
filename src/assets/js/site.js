'use strict';

import 'picturefill';
import 'focus-visible';
import 'flexibility';
import svg4everybody from 'svg4everybody';

import jsAlignHeight from './namespace/js/alignHeight';
import jsSmoothScroll from './namespace/js/smoothScroll';

(() => {
  svg4everybody();
  jsAlignHeight();
  jsSmoothScroll();
})();
