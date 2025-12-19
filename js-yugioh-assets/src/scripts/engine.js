(() => {
  const cards = [
    { id: 'dragon', name: 'Blue-Eyes Dragon', img: 'src/assets/icons/dragon.png', attr: 'Rock' },
    { id: 'magician', name: 'Dark Magician', img: 'src/assets/icons/magician.png', attr: 'Paper' },
    { id: 'exodia', name: 'Exodia', img: 'src/assets/icons/exodia.png', attr: 'Scissors' }
  ];

  const state = { wins: 0, losses: 0, ties: 0, busy: false };

  const el = {
    cards: document.getElementById('cards'),
    result: document.getElementById('result'),
    wins: document.getElementById('wins'),
    losses: document.getElementById('losses'),
    ties: document.getElementById('ties'),
    sWin: document.getElementById('s-win'),
    sLose: document.getElementById('s-lose'),
    bgMusic: document.getElementById('bg-music')
  };

  function renderCards() {
    el.cards.innerHTML = '';
    cards.forEach(c => {
      const node = document.createElement('div');
      node.className = 'card';
      node.dataset.id = c.id;
      node.innerHTML = `
        <img src="${c.img}" alt="${c.name}">
        <div class="name">${c.name}</div>
        <div class="attr">${c.attr}</div>
      `;
      node.addEventListener('click', () => chooseCard(c));
      el.cards.appendChild(node);
    });
  }

  function chooseCard(playerCard) {
    if (state.busy) return;
    state.busy = true;
    const computerCard = randomCard();
    const outcome = compare(playerCard.attr, computerCard.attr);
    showRound(playerCard, computerCard, outcome);
    setTimeout(() => { state.busy = false; }, 800);
  }

  function randomCard() {
    const idx = Math.floor(Math.random() * cards.length);
    return cards[idx];
  }

  function compare(a, b) {
    if (a === b) return 'tie';
    if ((a === 'Rock' && b === 'Scissors') ||
        (a === 'Scissors' && b === 'Paper') ||
        (a === 'Paper' && b === 'Rock')) return 'win';
    return 'lose';
  }

  function showRound(playerCard, computerCard, outcome) {
    if (outcome === 'win') {
      state.wins++;
      el.sWin.currentTime = 0; el.sWin.play().catch(() => {});
      el.result.textContent = `Você venceu! ${playerCard.name} (${playerCard.attr}) > ${computerCard.name} (${computerCard.attr})`;
    } else if (outcome === 'lose') {
      state.losses++;
      el.sLose.currentTime = 0; el.sLose.play().catch(() => {});
      el.result.textContent = `Você perdeu! ${playerCard.name} (${playerCard.attr}) < ${computerCard.name} (${computerCard.attr})`;
    } else {
      state.ties++;
      el.result.textContent = `Empate! ${playerCard.name} (${playerCard.attr}) = ${computerCard.name} (${computerCard.attr})`;
    }

    updateScores();
    flashChosen(playerCard.id, computerCard.id, outcome);
  }

  function updateScores() {
    el.wins.textContent = state.wins;
    el.losses.textContent = state.losses;
    el.ties.textContent = state.ties;
  }

  function flashChosen(playerId, computerId, outcome) {
    const nodes = Array.from(document.querySelectorAll('.card'));
    nodes.forEach(n => n.classList.remove('chosen', 'enemy', 'win', 'lose'));
    const p = nodes.find(n => n.dataset.id === playerId);
    const c = nodes.find(n => n.dataset.id === computerId);
    if (p) p.classList.add('chosen');
    if (c) c.classList.add('enemy');
    if (outcome === 'win' && p) p.classList.add('win');
    if (outcome === 'lose' && p) p.classList.add('lose');
    setTimeout(() => {
      nodes.forEach(n => n.classList.remove('chosen', 'enemy', 'win', 'lose'));
    }, 900);
  }

  // Inicia o jogo
  renderCards();
  updateScores();
})();
