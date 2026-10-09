const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');
const favoriteCount = document.getElementById('favoriteCount');
const toast = document.getElementById('toast');
const propertyCards = [...document.querySelectorAll('.property-card')];
let saved = new Set();

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove('show'), 2600);
}
function updateSavedCount() {
  favoriteCount.textContent = saved.size;
  document.querySelectorAll('.heart-button').forEach(button => {
    const card = button.closest('.property-card');
    const title = card.querySelector('h3').textContent.trim();
    const isSaved = saved.has(title);
    button.classList.toggle('saved', isSaved);
    button.textContent = isSaved ? '♥' : '♡';
    button.setAttribute('aria-pressed', String(isSaved));
  });
}
document.querySelectorAll('.heart-button').forEach(button => {
  button.addEventListener('click', () => {
    const title = button.closest('.property-card').querySelector('h3').textContent.trim();
    if (saved.has(title)) { saved.delete(title); showToast(`${title} removed from favourites`); }
    else { saved.add(title); showToast(`${title} added to favourites`); }
    updateSavedCount();
  });
});
document.getElementById('favoritesTop').addEventListener('click', () => {
  if (!saved.size) { showToast('You have no saved properties yet. Tap a heart on a property to save it.'); return; }
  propertyCards.forEach(card => card.hidden = !saved.has(card.querySelector('h3').textContent.trim()));
  document.getElementById('noResults').hidden = saved.size > 0;
  document.getElementById('featured').scrollIntoView({behavior:'smooth'});
  showToast(`Showing ${saved.size} saved propert${saved.size === 1 ? 'y' : 'ies'}`);
});
document.getElementById('searchForm').addEventListener('submit', event => {
  event.preventDefault();
  const location = document.getElementById('location').value.trim().toLowerCase();
  const type = document.getElementById('type').value;
  const budget = document.getElementById('budget').value;
  const deal = document.getElementById('deal').value;
  let count = 0;
  propertyCards.forEach(card => {
    const matches = (!location || card.dataset.location.toLowerCase().includes(location)) &&
      (!type || card.dataset.type === type) &&
      (!budget || card.dataset.budget === budget) &&
      (!deal || card.dataset.deal === deal);
    card.hidden = !matches;
    if (matches) count++;
  });
  document.getElementById('noResults').hidden = count > 0;
  document.getElementById('featured').scrollIntoView({behavior:'smooth'});
  showToast(count ? `${count} matching propert${count === 1 ? 'y' : 'ies'} found` : 'No matches found. Try different filters.');
});
document.querySelectorAll('.category-card').forEach(link => {
  link.addEventListener('click', () => {
    const category = link.dataset.category;
    document.getElementById('type').value = category;
    propertyCards.forEach(card => card.hidden = card.dataset.type !== category);
    const count = propertyCards.filter(card => !card.hidden).length;
    document.getElementById('noResults').hidden = count > 0;
  });
});
document.querySelectorAll('.details-link').forEach(button => {
  button.addEventListener('click', () => showToast(`${button.dataset.title}: Demo listing. Contact NIVARA for more information.`));
});
menuToggle.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.textContent = isOpen ? '✕' : '☰';
});
mainNav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  mainNav.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.textContent = '☰';
}));
document.querySelectorAll('a[href="#buy"],a[href="#rent"]').forEach(link => {
  link.addEventListener('click', () => {
    const deal = link.getAttribute('href') === '#buy' ? 'Buy' : 'Rent';
    document.getElementById('deal').value = deal;
    propertyCards.forEach(card => card.hidden = card.dataset.deal !== deal);
    document.getElementById('noResults').hidden = propertyCards.some(card => !card.hidden);
  });
});
