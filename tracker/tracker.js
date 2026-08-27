const storageKey = 'dexter-meal-tracker';
const state = { meals: loadMeals(), date: dateKey(new Date()), filter: 'all', editingId: null };
const form = document.querySelector('#meal-form');
const mealList = document.querySelector('#meal-list');
const mealCount = document.querySelector('#meal-count');
const formTitle = document.querySelector('#form-title');
const submitButton = document.querySelector('#submit-meal');
const cancelButton = document.querySelector('#cancel-edit');
const dateText = document.querySelector('#date-text');
const dateInput = document.querySelector('#meal-date');

function dateKey(value) { return value.toISOString().slice(0, 10); }
function loadMeals() { try { return JSON.parse(localStorage.getItem(storageKey)) || []; } catch (error) { return []; } }
function saveMeals() { localStorage.setItem(storageKey, JSON.stringify(state.meals)); }
function formatDate(value) { return new Intl.DateTimeFormat('en', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(`${value}T12:00:00`)); }
function visibleMeals() { return state.meals.filter((meal) => meal.date === state.date && (state.filter === 'all' || meal.type === state.filter)).sort((a, b) => b.createdAt - a.createdAt); }
function escapeHtml(value) { return String(value).replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#039;', '"': '&quot;' }[character])); }
function mealMarkup(meal) { return `<article class="meal-item"><span class="meal-type">${escapeHtml(meal.type)}</span><div class="meal-info"><p class="meal-name">${escapeHtml(meal.name)}</p><p class="meal-details">${meal.protein}g protein &nbsp; / &nbsp; ${meal.carbs}g carbs &nbsp; / &nbsp; ${meal.fat}g fat</p><div class="meal-actions"><button class="icon-button" data-action="edit" data-id="${meal.id}">edit</button><button class="icon-button" data-action="delete" data-id="${meal.id}">delete</button></div></div><div class="meal-calories"><strong>${meal.calories}</strong><span>kcal</span></div></article>`; }
function render() {
    const dayMeals = state.meals.filter((meal) => meal.date === state.date);
    const totals = dayMeals.reduce((sum, meal) => ({ calories: sum.calories + meal.calories, protein: sum.protein + meal.protein, carbs: sum.carbs + meal.carbs, fat: sum.fat + meal.fat }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
    dateText.textContent = formatDate(state.date);
    document.querySelector('#total-calories').textContent = totals.calories;
    document.querySelector('#total-protein').textContent = `${totals.protein}g`;
    document.querySelector('#total-carbs').textContent = `${totals.carbs}g`;
    document.querySelector('#total-fat').textContent = `${totals.fat}g`;
    mealCount.textContent = `${dayMeals.length} ${dayMeals.length === 1 ? 'meal' : 'meals'}`;
    mealList.innerHTML = visibleMeals().map(mealMarkup).join('') || '<div class="empty-state">No meals logged for this view yet.</div>';
}
function resetForm() { form.reset(); dateInput.value = state.date; state.editingId = null; formTitle.textContent = 'Log a meal'; submitButton.textContent = 'Add meal +'; form.classList.remove('editing'); }
function changeDate(offset) { const current = new Date(`${state.date}T12:00:00`); current.setDate(current.getDate() + offset); state.date = dateKey(current); resetForm(); render(); }

form.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const existing = state.meals.find((meal) => meal.id === state.editingId);
    const meal = { id: state.editingId || crypto.randomUUID(), name: data.get('name').trim(), type: data.get('type'), calories: Number(data.get('calories')), protein: Number(data.get('protein')) || 0, carbs: Number(data.get('carbs')) || 0, fat: Number(data.get('fat')) || 0, date: data.get('date'), createdAt: existing?.createdAt || Date.now() };
    state.meals = existing ? state.meals.map((item) => item.id === meal.id ? meal : item) : [...state.meals, meal];
    state.date = meal.date; saveMeals(); resetForm(); render();
});
mealList.addEventListener('click', (event) => {
    const button = event.target.closest('[data-action]'); if (!button) return;
    const meal = state.meals.find((item) => item.id === button.dataset.id); if (!meal) return;
    if (button.dataset.action === 'delete') { state.meals = state.meals.filter((item) => item.id !== meal.id); saveMeals(); render(); return; }
    state.editingId = meal.id;
    Object.entries(meal).forEach(([key, value]) => { const field = form.elements.namedItem(key); if (field) field.value = value; });
    formTitle.textContent = 'Edit meal'; submitButton.textContent = 'Save changes'; form.classList.add('editing'); form.scrollIntoView({ behavior: 'smooth', block: 'start' });
});
document.querySelectorAll('.filter-button').forEach((button) => button.addEventListener('click', () => { state.filter = button.dataset.filter; document.querySelectorAll('.filter-button').forEach((item) => item.classList.toggle('active', item === button)); render(); }));
document.querySelector('#previous-day').addEventListener('click', () => changeDate(-1));
document.querySelector('#next-day').addEventListener('click', () => changeDate(1));
document.querySelector('#today-button').addEventListener('click', () => { state.date = dateKey(new Date()); resetForm(); render(); });
cancelButton.addEventListener('click', resetForm);
dateInput.value = state.date;
render();
