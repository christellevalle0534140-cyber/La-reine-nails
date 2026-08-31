const SUPABASE_URL = 'https://fkixaznydcytzsckoiqr.supabase.co';const SUPABASE_KEY = 'sb_publishable_6TOqOa0_yca97s62uAfnPg_xA4O4OIV';const menu=document.querySelector(".menu");const nav=document.querySelector(".nav");menu?.addEventListener("click",()=>nav.classList.toggle("open"));
document.querySelectorAll('nav a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));
const form=document.getElementById('bookingForm');
form.addEventListener('submit',e=>{
  e.preventDefault();
  const d=new FormData(form);
  const text=`Bonjour, je souhaite prendre rendez-vous.\n\nPrénom : ${d.get('prenom')}\nTéléphone : ${d.get('telephone')}\nPrestation : ${d.get('prestation')}\nDate souhaitée : ${d.get('date')}\nHeure souhaitée : ${d.get('heure')}\nAdresse : ${d.get('adresse')}\nMessage : ${d.get('message')||'-'}`;
  const url=`https://wa.me/33784600252?text=${encodeURIComponent(text)}`;
  window.open(url,'_blank');
});
