import 'es6-promise/auto';
import 'picturefill';
import 'flexibility';
import 'objectFitPolyfill';
import elementClosest from 'element-closest';
import svg4everybody from 'svg4everybody';

elementClosest(window);

document.addEventListener('DOMContentLoaded', () => {
  svg4everybody();
});
