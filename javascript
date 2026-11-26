
// ===== SISTEMA DE CORRIDA =====

let corridaAtiva = false;
let corridaFinalizada = false;
let vencedor = null;

const nomes = [
  "CARRO AZUL",
  "CARRO VERDE",
  "CARRO ROSA",
  "CARRO VERMELHO E PRETO",
  "CARRO ROXO"
];

// Sortear vencedor
function sortearVencedor() {
  return Math.floor(Math.random() * cars.length);
}

// Preparar corrida
function prepararCorrida() {
  vencedor = null;
  corridaFinalizada = false;
  corridaAtiva = false;

  const carroVencedor = sortearVencedor();

  cars.forEach((carro, i) => {
    carro.progress = 0;
    carro.lane = (i - 2) * 1.6;

    // O vencedor sorteado terá vantagem de velocidade
    carro.speed = i === carroVencedor
      ? 0.115
      : 0.065 + Math.random() * 0.015;

    updateCar(carro);
  });

  document.getElementById("winner").innerText = "";
  document.getElementById("status").innerText =
    "🏁 Preparando os motores...";
}

// Iniciar corrida
function iniciarNovaCorrida() {
  prepararCorrida();

  setTimeout(() => {
    corridaAtiva = true;
    document.getElementById("status").innerText =
      "🚦 CORRIDA INICIADA!";
  }, 1000);
}

// Atualizar posição dos carros
function atualizarCorrida(delta) {
  if (!corridaAtiva) return;

  cars.forEach((carro, i) => {

    carro.progress += carro.speed * delta;

    // Pequena variação de velocidade
    carro.progress += Math.random() * 0.00002;

    updateCar(carro);

    // Verificar chegada
    if (carro.progress >= 1 && !corridaFinalizada) {
      corridaFinalizada = true;
      corridaAtiva = false;
      vencedor = i;

      document.getElementById("winner").innerText =
        "🏆 VENCEDOR: " + nomes[i] + "!";

      document.getElementById("status").innerText =
        "🏁 CORRIDA FINALIZADA!";
    }
  });
}

// Câmera acompanhando a pista
function atualizarCamera() {
  const carro = cars[0];

  const posicao = carro.mesh.position;

  const destino = new THREE.Vector3(
    posicao.x,
    posicao.y + 25,
    posicao.z + 30
  );

  camera.position.lerp(destino, 0.025);

  camera.lookAt(
    posicao.x,
    posicao.y,
    posicao.z
  );
}

// Loop principal
function animarJogo() {
  requestAnimationFrame(animarJogo);

  const delta = 0.016;

  atualizarCorrida(delta);
  atualizarCamera();

  renderer.render(scene, camera);
}

// Botão de corrida
window.startRace = iniciarNovaCorrida;

// Começar jogo
prepararCorrida();
animarJogo();
