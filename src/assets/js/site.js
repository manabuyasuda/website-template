import './polyfill'
import 'what-input'
import 'inobounce'

import jsSmoothScroll from './namespace/js/jsSmoothScroll'
import stBackToTop from './namespace/structure/stBackToTop'

jsSmoothScroll()
stBackToTop()
Promise.resolve().then(res => console.log('Promise end'));// eslint-disable-line
