'use strict';

import $ from 'jquery';
import 'picturefill';
import 'focus-visible';
import 'jquery-match-height';
import 'smooth-scroll';

import './namespace/js/alignHeight';
import './namespace/js/smoothScroll';
import jsChangeTelLink from './namespace/js/changeTelLink';

jsChangeTelLink();

const hello = (name) => {
  return `Hello ${name}`;
};

console.log(hello('world!!'));
