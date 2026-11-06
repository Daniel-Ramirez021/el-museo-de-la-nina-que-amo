const rooms = [
  { title: "La luz de tus ojos", icon: "✧", subtitle: "Hay miradas que se quedan contigo.", description: "Hay algo en tus ojos que siempre consigue llamar mi atención. A veces no hace falta decir nada; basta con mirarte para encontrar un motivo más para sonreír.", quote: "«Hay miradas que parecen guardar un universo entero.»", photo: "cualidad-01.jpg" },
  { title: "Tu sonrisa", icon: "☼", subtitle: "Una de mis cosas favoritas.", description: "Tu sonrisa tiene esa manera tan especial de iluminar hasta los días más sencillos. Ojalá nunca olvides lo bonita que es.", quote: "«Si pudiera guardar un instante, elegiría uno en el que estés sonriendo.»", photo: "cualidad-02.jpg" },
  { title: "Tu forma de ser", icon: "❀", subtitle: "Eso que te hace ser tú.", description: "No se trata solamente de cómo te ves. También admiro esos pequeños detalles, tus ocurrencias y esa esencia que no se parece a la de nadie.", quote: "«Lo bonito de ti también está en todo lo que no se ve.»", photo: "cualidad-03.jpg" },
  { title: "Tu belleza", icon: "✦", subtitle: "En cada pequeño detalle.", description: "Quería dedicarte un espacio para recordarte que no necesitas compararte con nadie. Tienes una belleza propia, y merece ser celebrada.", quote: "«No tienes que parecerte a nadie para ser maravillosa.»", photo: "cualidad-04.jpg" },
  { title: "Nuestros recuerdos", icon: "♡", subtitle: "Momentos que guardo con cariño.", description: "Hay momentos pequeños que terminan significando muchísimo. Esta sala está reservada para esos recuerdos que merecen quedarse un ratito más.", quote: "«Qué bonito coincidir contigo en esta historia.»", photo: "cualidad-05.jpg" },
  { title: "Todo lo que eres", icon: "☾", subtitle: "Y todo lo que todavía falta descubrir.", description: "Esta última sala no intenta describirte por completo. Solamente quiere recordarte que todavía hay muchísimas cosas bonitas por descubrir de ti.", quote: "«Y entre tantas cosas bonitas, mi favorita siempre será simplemente tú.»", photo: "cualidad-06.jpg" }
];

const screens = ["welcome", "museum", "roomView", "letterScreen"];
const $ = (id) => document.getElementById(id);
let currentRoom = 0;

function showScreen(id) {
  screens.forEach(screen => $(screen).classList.toggle("active", screen === id));
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function createStars() {
  const container = $("stars");
  for (let i = 0; i < 75; i++) {
    const star = document.createElement("i");
    star.className = "star-dot";
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    star.style.animationDelay = `${Math.random() * 4}s`;
    star.style.animationDuration = `${2 + Math.random() * 4}s`;
    container.appendChild(star);
  }
}

function renderRooms() {
  $("roomGrid").innerHTML = rooms.map((room, index) => `
    <button class="room-card" data-room="${index}">
      <span class="room-number">SALA 0${index + 1}</span>
      <span class="room-icon">${room.icon}</span>
      <h3>${room.title}</h3>
      <p>${room.subtitle}</p>
    </button>`).join("");
  document.querySelectorAll(".room-card").forEach(card => {
    card.addEventListener("click", () => openRoom(Number(card.dataset.room)));
  });
}

function openRoom(index) {
  currentRoom = index;
  const room = rooms[index];
  $("roomContent").innerHTML = `
    <span class="room-symbol">${room.icon}</span>
    <p class="eyebrow">SALA 0${index + 1} · UNA PARTE DE TI</p>
    <h2>${room.title}</h2>
    <p class="room-description">${room.description}</p>
    <div class="photo-placeholder">✧<br>Tu fotografía irá aquí<br><small>assets/fotos/${room.photo}</small></div>
    <p class="room-quote">${room.quote}</p>`;
  $("roomCounter").textContent = `SALA 0${index + 1} / 06`;
  $("previousRoom").disabled = index === 0;
  $("previousRoom").style.opacity = index === 0 ? ".35" : "1";
  $("nextRoom").textContent = index === rooms.length - 1 ? "Ver la última sala →" : "Siguiente →";
  showScreen("roomView");
}

function nextRoom() {
  if (currentRoom < rooms.length - 1) openRoom(currentRoom + 1);
  else showScreen("letterScreen");
}
function previousRoom() {
  if (currentRoom > 0) openRoom(currentRoom - 1);
}

async function toggleMusic() {
  const audio = $("backgroundMusic");
  if (audio.paused) {
    try {
      await audio.play();
      $("soundToggle").classList.add("playing");
      $("soundLabel").textContent = "Música activada";
    } catch {
      $("soundLabel").textContent = "Añade el MP3";
    }
  } else {
    audio.pause();
    $("soundToggle").classList.remove("playing");
    $("soundLabel").textContent = "Música pausada";
  }
}

$("enterButton").addEventListener("click", async () => {
  showScreen("museum");
  if ($("backgroundMusic").paused) await toggleMusic();
});
$("soundToggle").addEventListener("click", toggleMusic);
$("backButton").addEventListener("click", () => showScreen("museum"));
$("previousRoom").addEventListener("click", previousRoom);
$("nextRoom").addEventListener("click", nextRoom);
$("openLetter").addEventListener("click", () => {
  const paper = $("letterPaper");
  paper.classList.add("open");
  $("openLetter").style.display = "none";
  $("returnMuseum").classList.add("visible");
  const paragraphs = [...paper.querySelectorAll(".letter-paragraph")];
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    paragraphs.forEach(paragraph => observer.observe(paragraph));
  } else {
    paragraphs.forEach((paragraph, index) => {
      window.setTimeout(() => paragraph.classList.add("revealed"), index * 180);
    });
  }
});
$("returnMuseum").addEventListener("click", () => showScreen("museum"));

createStars();
renderRooms();
