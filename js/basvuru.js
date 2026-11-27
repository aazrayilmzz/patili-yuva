const basvuruFormu = document.getElementById("basvuruFormu");
const adSoyad = document.getElementById("adSoyad");
const eposta = document.getElementById("eposta");
const telefon = document.getElementById("telefon");
const sehir = document.getElementById("sehir");
const hayvanSecimi = document.getElementById("hayvanSecimi");
const evTipiSecenekleri = document.querySelector(".secenekler");
const deneyim = document.getElementById("deneyim");
const onay = document.getElementById("onay");
const basariMesaji = document.getElementById("basariMesaji");

let hayvanlar = [];

basvuruFormu.noValidate = true;

async function hayvanSecenekleriniDoldur() {
  try {
    const cevap = await fetch("data/hayvanlar.json");

    if (!cevap.ok) {
      throw new Error("Sunucu cevabı: " + cevap.status);
    }

    hayvanlar = await cevap.json();

    hayvanlar.forEach(function (hayvan) {
      const secenek = document.createElement("option");
      secenek.value = hayvan.id;
      secenek.textContent = hayvan.ad + " (" + hayvan.cins + ", " + hayvan.sehir + ")";
      hayvanSecimi.appendChild(secenek);
    });

    const adresBilgisi = new URLSearchParams(window.location.search);
    const gelenId = adresBilgisi.get("id");

    if (gelenId) {
      hayvanSecimi.value = gelenId;
    }

  } catch (hata) {
    console.error(hata);
    hataYaz(hayvanSecimi, "Hayvan listesi yüklenemedi. Sayfayı yenileyip tekrar dene.");
  }
}

function hataYaz(alan, mesaj) {
  const hataKutusu = document.getElementById(alan.getAttribute("aria-describedby"));
  hataKutusu.textContent = mesaj;

  if (mesaj) {
    alan.classList.add("hatali");
    alan.setAttribute("aria-invalid", "true");
  } else {
    alan.classList.remove("hatali");
    alan.removeAttribute("aria-invalid");
  }
}

function kontrol(alan, dogruMu, mesaj) {
  hataYaz(alan, dogruMu ? "" : mesaj);
  return dogruMu;
}

function taslagiKaydet() {
  const taslak = {
    adSoyad: adSoyad.value,
    eposta: eposta.value,
    telefon: telefon.value,
    sehir: sehir.value,
    deneyim: deneyim.value
  };

  localStorage.setItem("basvuruTaslagi", JSON.stringify(taslak));
}

function taslagiYukle() {
  const taslak = JSON.parse(localStorage.getItem("basvuruTaslagi"));

  if (taslak) {
    adSoyad.value = taslak.adSoyad || "";
    eposta.value = taslak.eposta || "";
    telefon.value = taslak.telefon || "";
    sehir.value = taslak.sehir || "";
    deneyim.value = taslak.deneyim || "";
  }
}

function formuKontrolEt() {
  const epostaKalibi = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const telefonKalibi = /^0[0-9]{10}$/;
  const secilenEvTipi = document.querySelector('input[name="evTipi"]:checked');

  const sonuclar = [
    kontrol(adSoyad, adSoyad.value.trim().length >= 3, "Ad soyad en az 3 karakter olmalı."),
    kontrol(eposta, epostaKalibi.test(eposta.value.trim()), "Geçerli bir e-posta adresi yaz (ör. ad@ornek.com)."),
    kontrol(telefon, telefonKalibi.test(telefon.value.replaceAll(" ", "")), "Telefon 0 ile başlamalı ve 11 haneli olmalı (ör. 05321234567)."),
    kontrol(sehir, sehir.value !== "", "Bir şehir seç."),
    kontrol(hayvanSecimi, hayvanSecimi.value !== "", "Sahiplenmek istediğin dostu seç."),
    kontrol(evTipiSecenekleri, secilenEvTipi !== null, "Ev tipini seç."),
    kontrol(deneyim, deneyim.value.trim().length >= 20, "Biraz daha anlat: en az 20 karakter yazmalısın."),
    kontrol(onay, onay.checked, "Devam etmek için onay kutusunu işaretle.")
  ];

  return !sonuclar.includes(false);
}

basvuruFormu.addEventListener("submit", function (olay) {
  olay.preventDefault();

  if (!formuKontrolEt()) {
    const ilkHatali = basvuruFormu.querySelector(".hatali");
    ilkHatali.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  localStorage.removeItem("basvuruTaslagi");

  const secilenHayvan = hayvanlar.find(function (hayvan) {
    return String(hayvan.id) === hayvanSecimi.value;
  });
  const ad = adSoyad.value.trim().split(" ")[0];

  basariMesaji.textContent = "Teşekkürler " + ad + "! " + secilenHayvan.ad +
    " için başvurun alındı. Gönüllülerimiz en kısa sürede seninle iletişime geçecek.";
  basariMesaji.hidden = false;
  basvuruFormu.hidden = true;
  basariMesaji.scrollIntoView({ behavior: "smooth", block: "center" });
});

basvuruFormu.addEventListener("input", function (olay) {
  const alan = olay.target.closest("[aria-describedby]");

  if (alan) {
    hataYaz(alan, "");
  }

  taslagiKaydet();
});

hayvanSecenekleriniDoldur();
taslagiYukle();