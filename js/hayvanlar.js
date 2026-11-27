const hayvanListesi = document.getElementById("hayvanListesi");
const durumMesaji = document.getElementById("durumMesaji");
const sonucBilgisi = document.getElementById("sonucBilgisi");
const aramaKutusu = document.getElementById("aramaKutusu");
const turFiltresi = document.getElementById("turFiltresi");
const yasFiltresi = document.getElementById("yasFiltresi");
const sehirFiltresi = document.getElementById("sehirFiltresi");
const favoriFiltreButonu = document.getElementById("favoriFiltreButonu");

let tumHayvanlar = [];
let favoriler = JSON.parse(localStorage.getItem("favoriler")) || [];
let sadeceFavoriler = false;

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
  favoriButonu.setAttribute("aria-label", hayvan.ad + ": favorilere ekle");
  kalbiGuncelle(favoriButonu, favoriMi(hayvan.id));

  favoriButonu.addEventListener("click", function () {
    favoriDegistir(hayvan.id);
    sayaciGuncelle();
    kalbiGuncelle(favoriButonu, favoriMi(hayvan.id));

    if (sadeceFavoriler) {
      filtrele();
    }
  });

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

  if (liste.length > 0) {
    sonucBilgisi.textContent = liste.length + " dost listeleniyor";
  } else if (sadeceFavoriler && favoriler.length === 0) {
    sonucBilgisi.textContent = "Henüz favorin yok. Beğendiğin dostların kalbine basarak ekleyebilirsin.";
  } else {
    sonucBilgisi.textContent = "Aradığın özelliklerde bir dost bulunamadı. Filtreleri değiştirmeyi dene.";
  }
}

function favoriMi(id) {
  return favoriler.includes(id);
}

function favoriDegistir(id) {
  if (favoriMi(id)) {
    favoriler = favoriler.filter(function (favoriId) {
      return favoriId !== id;
    });
  } else {
    favoriler.push(id);
  }

  localStorage.setItem("favoriler", JSON.stringify(favoriler));
}

function kalbiGuncelle(buton, favorideMi) {
  buton.setAttribute("aria-pressed", favorideMi);
  buton.textContent = favorideMi ? "♥" : "♡";
}

function sayaciGuncelle() {
  const kalp = sadeceFavoriler ? "♥" : "♡";
  favoriFiltreButonu.textContent = kalp + " Sadece favorilerim (" + favoriler.length + ")";
}

function yasGrubu(yas) {
  if (yas === 0) {
    return "yavru";
  }
  if (yas <= 3) {
    return "genc";
  }
  return "yetiskin";
}

function filtrele() {
  const aranan = aramaKutusu.value.trim().toLocaleLowerCase("tr");
  const secilenTur = turFiltresi.value;
  const secilenYas = yasFiltresi.value;
  const secilenSehir = sehirFiltresi.value;

  const sonuc = tumHayvanlar.filter(function (hayvan) {
    const aramaMetni = (hayvan.ad + " " + hayvan.cins).toLocaleLowerCase("tr");

    const aramaUyuyor = aramaMetni.includes(aranan);
    const turUyuyor = secilenTur === "hepsi" || hayvan.tur === secilenTur;
    const yasUyuyor = secilenYas === "hepsi" || yasGrubu(hayvan.yas) === secilenYas;
    const sehirUyuyor = secilenSehir === "hepsi" || hayvan.sehir === secilenSehir;
    const favoriUyuyor = !sadeceFavoriler || favoriMi(hayvan.id);

    return aramaUyuyor && turUyuyor && yasUyuyor && sehirUyuyor && favoriUyuyor;
  });

  listeyiGoster(sonuc);
}

aramaKutusu.addEventListener("input", filtrele);
turFiltresi.addEventListener("change", filtrele);
yasFiltresi.addEventListener("change", filtrele);
sehirFiltresi.addEventListener("change", filtrele);

favoriFiltreButonu.addEventListener("click", function () {
  sadeceFavoriler = !sadeceFavoriler;
  kalbiGuncelle(favoriFiltreButonu, sadeceFavoriler);
  sayaciGuncelle();
  filtrele();
});

hayvanlariGetir(); 
sayaciGuncelle();