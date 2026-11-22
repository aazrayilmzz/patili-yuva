const menuButonu = document.getElementById("menuButonu");
const anaMenu = document.getElementById("anaMenu");

menuButonu.addEventListener("click", function () {
  const acikMi = anaMenu.classList.toggle("acik");

  menuButonu.setAttribute("aria-expanded", acikMi);
  menuButonu.setAttribute("aria-label", acikMi ? "Menüyü kapat" : "Menüyü aç");

  menuButonu.textContent = acikMi ? "✕" : "☰";
});

const temaButonu = document.getElementById("temaButonu");

let karanlikMod = localStorage.getItem("tema") === "karanlik";

function temayiUygula() {
  document.body.classList.toggle("karanlik", karanlikMod);
  temaButonu.textContent = karanlikMod ? "☀️" : "🌙";
}

temayiUygula();

temaButonu.addEventListener("click", function () {
  karanlikMod = !karanlikMod;
  temayiUygula();
  localStorage.setItem("tema", karanlikMod ? "karanlik" : "acik");
});