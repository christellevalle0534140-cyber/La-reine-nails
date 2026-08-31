const SUPABASE_URL = 'https://fkixaznydcytzsckoiqr.supabase.co';
const SUPABASE_KEY = 'sb_publishable_6TOqOa0_yca97s62uAfnPg_xA4O4OIV';
const headers = {
  'apikey': SUPABASE_KEY,
  'Authorization': `Bearer ${SUPABASE_KEY}`,
  'Content-Type': 'application/json'
};
async function getServices() {
  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/services?active=eq.true&select=id,name,price,duration_minutes&order=name`,
    { headers }
  );

  if (!response.ok) {
    throw new Error('Impossible de charger les prestations');
  }

  return await response.json();
}
async function getAvailableSlots(date, serviceId) {
  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/rpc/available_slots`,
    {
      method: 'POST',
      headers,
      body: JSON.stringify({
        p_date: date,
        p_service: serviceId
      })
    }
  );

  if (!response.ok) {
    throw new Error('Impossible de charger les créneaux');
  }

  return await response.json();
}
const form = document.getElementById('bookingForm');
const serviceSelect = form.querySelector('[name="prestation"]');
const dateInput = form.querySelector('[name="date"]');
const timeInput = form.querySelector('[name="heure"]');
async function loadServices() {
  const services = await getServices();

  serviceSelect.innerHTML = '<option value="">Choisir une prestation</option>';

  services.forEach(service => {
    const option = document.createElement('option');
    option.value = service.id;
    option.textContent = `${service.name} — ${service.price} €`;
    serviceSelect.appendChild(option);
  });
}

loadServices();
const timeSelect = document.createElement('select');
timeSelect.name = 'heure';
timeSelect.required = true;
timeSelect.innerHTML = '<option value="">Choisir une heure</option>';

timeInput.replaceWith(timeSelect);
async function loadSlots() {
  const date = dateInput.value;
  const serviceId = serviceSelect.value;

  timeSelect.innerHTML = '<option value="">Choisir une heure</option>';

  if (!date || !serviceId) return;

  const slots = await getAvailableSlots(date, serviceId);

  slots
    .filter(slot => slot.available)
    .forEach(slot => {
      const option = document.createElement('option');
      option.value = slot.slot_time;
      option.textContent = slot.slot_time.slice(0, 5);
      timeSelect.appendChild(option);
    });
}
async function createBooking(data) {
  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/rpc/create_booking`,
    {
      method: 'POST',
      headers,
      body: JSON.stringify(data)
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error);
  }

  return await response.json();
}
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const firstName = form.querySelector('[name="prenom"]').value;
  const phone = form.querySelector('[name="telephone"]').value;
  const address = form.querySelector('[name="adresse"]').value;
  try {
    await createBooking({
      p_first_name: firstName,
      p_phone: phone,
      p_email: '',
      p_message: address,
      p_service: serviceSelect.value,
      p_date: dateInput.value,
      p_start: timeSelect.value
    });
   alert('Votre rendez-vous a bien été enregistré !');
    form.reset();
    timeSelect.innerHTML = '<option value="">Choisir une heure</option>';
  } catch (error) {
    alert('Ce créneau est indisponible ou une erreur est survenue.');
    console.error(error);
  }
});
