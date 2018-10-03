'use strict';

import 'picturefill';
import 'what-input';
import 'flexibility';
import svg4everybody from 'svg4everybody';

import jsAlignHeight from './namespace/js/alignHeight';
import jsSmoothScroll from './namespace/js/smoothScroll';
import jsDialog from './namespace/js/dialog';

(() => {
  svg4everybody();
  jsAlignHeight();
  jsSmoothScroll();
  jsDialog();
})();
