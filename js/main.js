const menuButonu = document.getElementById("menuButonu");
const anaMenu = document.getElementById("anaMenu");

menuButonu.addEventListener("click", function () {
  const acikMi = anaMenu.classList.toggle("acik");

  menuButonu.setAttribute("aria-expanded", acikMi);
  menuButonu.setAttribute("aria-label", acikMi ? "Menüyü kapat" : "Menüyü aç");

  menuButonu.textContent = acikMi ? "✕" : "☰";
});
