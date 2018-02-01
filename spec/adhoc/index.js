import '../../src/elements/fab.js';
import '../../src/elements/hamburger.js';
import '../../src/elements/alert.js';
import '../../src/elements/drawer.js';
import '../../src/elements/toolbar.js';
import '../../src/elements/tabs.js';
import '../../src/elements/text.js';
import '../../src/elements/input.js';
import '../../src/elements/drop-down.js';
import '../../src/elements/login.js';
import { Router } from '../../src/elements/router.js';

// import Styled from '../../src/utils/styler.js';
// const theme = {
//   [Styled.primaryDarkColor]: 'purple'
// };
// setTimeout(() => { console.log(Styled.applyTheme(theme)); }, 1500);
// setTimeout(() => { console.log(Styled.revertTheme()); }, 3000);


customElements.whenDefined('ui-button').then(_ => {
  document.querySelector('.alert-bttn').on('click', e => {
    document.querySelector('ui-alert').alert('Alerted!');
  });
});
//
// customElements.whenDefined('ui-router').then(_ => {
//   const router = document.querySelector('ui-router');
//   const inputRoute = document.querySelector('[route-path="/formica"]');
//   const input = inputRoute.querySelector('input');
//   input.addEventListener('change', e => {
//     inputRoute.update({ value: input.value });
//   });
// });
