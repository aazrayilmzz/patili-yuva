const hayvanListesi = document.getElementById("hayvanListesi");
const durumMesaji = document.getElementById("durumMesaji");
const sonucBilgisi = document.getElementById("sonucBilgisi");

let tumHayvanlar = [];

async function hayvanlariGetir() {
  durumMesaji.textContent = "Patiler yükleniyor…";
  durumMesaji.classList.add("yukleniyor");

  try {
    const cevap = await fetch("data/hayvanlar.json");

    if (!cevap.ok) {
      throw new Error("Sunucu cevabı: " + cevap.status);
    }

    tumHayvanlar = await cevap.json();

    durumMesaji.textContent = "";
    durumMesaji.classList.remove("yukleniyor");
    listeyiGoster(tumHayvanlar);

  } catch (hata) {
    console.error(hata);
    durumMesaji.classList.remove("yukleniyor");
    durumMesaji.classList.add("hata");
    durumMesaji.textContent = "Hayvan listesi yüklenemedi. Sayfayı yenileyip tekrar dene.";
  }
}

function kartOlustur(hayvan) {
  const kart = document.createElement("article");
  kart.className = "kart";

  const foto = document.createElement("img");
  foto.src = hayvan.foto;
  foto.alt = hayvan.alt;
  foto.loading = "lazy";

  const icerik = document.createElement("div");
  icerik.className = "kart-icerik";

  const ad = document.createElement("h2");
  ad.textContent = hayvan.ad;

  const bilgi = document.createElement("p");
  bilgi.className = "kart-bilgi";
  bilgi.textContent = turAdi(hayvan.tur) + " · " + hayvan.cins + " · " +
                      yasYazisi(hayvan.yas) + " · " + hayvan.sehir;

  const etiketler = document.createElement("ul");
  etiketler.className = "etiketler";

  if (hayvan.asili) {
    etiketler.appendChild(etiketOlustur("Aşıları tam", "etiket etiket-asi"));
  }

  hayvan.etiketler.forEach(function (etiket) {
    etiketler.appendChild(etiketOlustur(etiket, "etiket"));
  });

  const aciklama = document.createElement("p");
  aciklama.textContent = hayvan.aciklama;

  const butonlar = document.createElement("div");
  butonlar.className = "kart-butonlar";

  const favoriButonu = document.createElement("button");
  favoriButonu.type = "button";
  favoriButonu.className = "favori-butonu";
  favoriButonu.dataset.id = hayvan.id;
  favoriButonu.setAttribute("aria-pressed", "false");
  favoriButonu.setAttribute("aria-label", hayvan.ad + ": favorilere ekle");
  favoriButonu.textContent = "♡";

  const sahiplenLinki = document.createElement("a");
  sahiplenLinki.className = "buton";
  sahiplenLinki.href = "basvuru.html?id=" + hayvan.id;
  sahiplenLinki.textContent = "Sahiplen";

  butonlar.append(favoriButonu, sahiplenLinki);
  icerik.append(ad, bilgi, etiketler, aciklama, butonlar);
  kart.append(foto, icerik);

  return kart;
}

function etiketOlustur(yazi, sinif) {
  const li = document.createElement("li");
  li.className = sinif;
  li.textContent = yazi;
  return li;
}

function turAdi(tur) {
  return tur.charAt(0).toLocaleUpperCase("tr") + tur.slice(1);
}

function yasYazisi(yas) {
  return yas === 0 ? "Yavru" : yas + " yaş";
}

function listeyiGoster(liste) {
  hayvanListesi.textContent = "";

  liste.forEach(function (hayvan) {
    hayvanListesi.appendChild(kartOlustur(hayvan));
  });

  if (liste.length === 0) {
    sonucBilgisi.textContent = "Aradığın özelliklerde bir dost bulunamadı. Filtreleri değiştirmeyi dene.";
  } else {
    sonucBilgisi.textContent = liste.length + " dost listeleniyor";
  }
}

hayvanlariGetir();