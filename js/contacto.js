/* Página de contacto: completa los links desde config.js (todo por Instagram) */
(function () {
  const dm = document.getElementById("igDmLink");
  const ig = document.getElementById("igLink");
  const mail = document.getElementById("mailLink");
  if (dm) dm.href = `https://ig.me/m/${CONFIG.instagram}`;
  if (ig) ig.href = `https://instagram.com/${CONFIG.instagram}`;
  if (mail) mail.href = `mailto:${CONFIG.email}`;
})();
