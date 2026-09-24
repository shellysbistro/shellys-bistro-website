document.documentElement.classList.add('has-js');

const toggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#site-navigation');

if (toggle && navigation) {
  const close = () => {
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
    navigation.classList.remove('is-open');
  };

  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    navigation.classList.toggle('is-open', open);
  });
  navigation.addEventListener('click', (event) => {
    if (event.target.closest('a')) close();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      close();
      toggle.focus();
    }
  });
  window.matchMedia('(min-width: 881px)').addEventListener('change', close);
}

document.querySelectorAll('.food-flashcard, .signature--flash').forEach((card) => {
  card.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape' || !card.open) return;
    card.open = false;
    card.querySelector('summary')?.focus();
  });
});
