document.cookie=document.querySelector("#pseudo").value + 'expire=Thu, Mar 2022 12:00:00;secure;path=/';
const cookie = document.cookie;
let affiche = document.getElementById('info1_user');
affiche.innerHTML = '<h2>Bienvenue</h2> ' + cookie;