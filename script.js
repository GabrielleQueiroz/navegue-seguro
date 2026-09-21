// INTERAÇÃO DOS CARDS
const cards = document.querySelectorAll(".card");

function alternarCard(card) {
  // Fecha todos os outros cards
  cards.forEach((outro) => {
    if (outro !== card) {
      outro.classList.remove("open");
      const toggleBtn = outro.querySelector(".card-toggle");
      if (toggleBtn) {
        toggleBtn.setAttribute("aria-expanded", "false");
      }
    }
  });

  // Abre ou fecha o card atual e avisa o leitor de tela
  const aberto = card.classList.toggle("open");
  const currentToggle = card.querySelector(".card-toggle");
  if (currentToggle) {
    currentToggle.setAttribute("aria-expanded", aberto);
  }
}

cards.forEach((card, i) => {
  const titulo = card.querySelector("h3");
  const extra = card.querySelector(".card-extra");

  // Cria um botão de verdade com o texto do título
  const botao = document.createElement("button");
  botao.type = "button";
  botao.className = "card-toggle";
  botao.textContent = titulo.textContent;
  botao.setAttribute("aria-expanded", "false");

  // Liga o botão ao texto que ele abre
  extra.id = "dica-" + (i + 1);
  botao.setAttribute("aria-controls", extra.id);

  // Coloca o botão dentro do h3
  titulo.textContent = "";
  titulo.appendChild(botao);

  botao.addEventListener("click", () => alternarCard(card));
});

// HERO BACKGROUND ANIMATION

const heroCanvas = document.getElementById("hero-canvas");

if (heroCanvas) {
  const ctx = heroCanvas.getContext("2d");
  const totalFrames = 30;
  const frames = [];
  let isHeroVisible = true;

  const reduzirMovimento = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  let animacaoPausada = reduzirMovimento;

  // Resolução interna correspondente aos frames (1920x1080)
  heroCanvas.width = 1920;
  heroCanvas.height = 1080;

  // Pré-carregamento dos 30 quadros da pasta hacker/
  for (let i = 1; i <= totalFrames; i++) {
    const img = new Image();
    const frameIndex = String(i).padStart(3, "0");
    img.src = `./hacker/ezgif-frame-${frameIndex}.jpg`;

    img.onload = () => {
      // Exibe o primeiro frame imediatamente assim que estiver pronto
      if (i === 1) {
        ctx.drawImage(img, 0, 0, heroCanvas.width, heroCanvas.height);
      }
    };

    frames.push(img);
  }

  // Velocidade reduzida e transição contínua entre os quadros:
  const cycleDuration = 4500; // 4.5 segundos para o ciclo completo - velocidade dos frames
  let startTime = null;

  function renderLoop(timestamp) {
    // Se a seção hero estiver visível e a animação não estiver pausada, renderiza o frame
    if (isHeroVisible && !animacaoPausada) {
      if (!startTime) startTime = timestamp;
      const elapsed = (timestamp - startTime) % cycleDuration;
      const progress = elapsed / cycleDuration;

      // Cálculo da posição do frame com base no tempo decorrido
      const framePos = progress * totalFrames;
      const index = Math.floor(framePos) % totalFrames;

      const img = frames[index];

      if (img && img.complete && img.naturalWidth > 0) {
        ctx.globalAlpha = 1;
        ctx.drawImage(img, 0, 0, heroCanvas.width, heroCanvas.height);
      }
    }

    // O reagendamento agora ocorre de forma otimizada
    requestAnimationFrame(renderLoop);
  }

  requestAnimationFrame(renderLoop);

  // Pausa a animação quando o usuário rolar a página para fora da seção Hero
  const heroSection = document.getElementById("inicio");
  if (heroSection && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isHeroVisible = entry.isIntersecting;
        });
      },
      { threshold: 0.05 },
    );
    observer.observe(heroSection);
  }

  // BOTÃO DE PAUSAR A ANIMAÇÃO
  const btnPausar = document.getElementById("btn-pausar");

  function atualizarBotao() {
    if (btnPausar) {
      btnPausar.textContent = animacaoPausada
        ? "Reproduzir animação"
        : "Pausar animação";
    }
  }

  atualizarBotao();

  if (btnPausar) {
    btnPausar.addEventListener("click", () => {
      animacaoPausada = !animacaoPausada;
      atualizarBotao();
    });
  }
} // fim do if (heroCanvas)

// MENU DO CELULAR
const menuToggle = document.getElementById("menu-toggle");
const menuPrincipal = document.getElementById("menu-principal");

function alternarMenu(abrir) {
  if (menuPrincipal && menuToggle) {
    menuPrincipal.classList.toggle("aberto", abrir);
    menuToggle.setAttribute("aria-expanded", abrir);
    menuToggle.setAttribute("aria-label", abrir ? "Fechar menu" : "Abrir menu");
  }
}

if (menuToggle && menuPrincipal) {
  menuToggle.addEventListener("click", () => {
    alternarMenu(!menuPrincipal.classList.contains("aberto"));
  });

  // Fecha o menu depois de escolher um link
  menuPrincipal.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => alternarMenu(false));
  });
}
