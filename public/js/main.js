loadComponents();

async function loadComponents() {
  $('navigation').replaceWith(await $.get('/html/navbar.html'));
}

