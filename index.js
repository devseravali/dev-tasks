const form = document.querySelector('form');
const inputTarefa = document.querySelector('.input-tarefa');
const listaTarefas = document.querySelector('.lista-de-tarefas');
const btnTema = document.querySelector('.alterar-tema');
const btnFiltros = document.querySelectorAll('.nav button');

let tarefas = [];
let filtroAtivo = 'all';

const Storage = {
  salvar(tarefas) {
    localStorage.setItem('devtasks', JSON.stringify(tarefas));
  },
  carregar() {
    const dados = localStorage.getItem('devtasks');
    try {
      return JSON.parse(dados);
    } catch {
      return [];
    }
  },
};

const TarefasService = {
  criar(texto) {
    return {
      id: Date.now(),
      texto,
      concluida: false,
    };
  },
  alternarConcluida(tarefas, id) {
    return tarefas.map((tarefa) =>
      tarefa.id === id ? { ...tarefa, concluida: !tarefa.concluida } : tarefa,
    );
  },
  remover(tarefas, id) {
    return tarefas.filter((tarefa) => tarefa.id !== id);
  },
  filtrar(tarefas, filtro) {
    const mapa = {
      pending: tarefas.filter((tarefa) => !tarefa.concluida),
      completed: tarefas.filter((tarefa) => tarefa.concluida),
      all: tarefas,
    };
    return mapa[filtro] ?? tarefas;
  },
};

const UI = {
  renderizarTarefas(tarefas) {
    listaTarefas.innerHTML = '';
    if (!tarefas.length) {
      listaTarefas.innerHTML =
        '<p class="vazia"> Nenhuma tarefa encontrada </p>';
      return;
    }
    tarefas.forEach((tarefa) => {
      listaTarefas.appendChild(this.criarElementoTarefa(tarefa));
    });
  },
  criarElementoTarefa(tarefa) {
    const li = document.createElement('li');
    li.classList.add('tarefa');
    if (tarefa.concluida) li.classList.add('concluida');
    li.innerHTML = `
      <span class="texto-tarefa">${tarefa.texto}</span>
      <div class="acoes">
        <button class="btn-concluir" data-id="${tarefa.id}">${tarefa.concluida ? 'Concluída' : 'Concluir'}</button>
        <button class="btn-remover" data-id="${tarefa.id}">Remover</button>
      </div>
    `;
    return li;
  },
  atualizarTema(isDark) {
    document.body.classList.toggle('theme-dark', isDark);
    btnTema.innerHTML = isDark ? '<i class="fa-solid fa-moon"></i>' : '<i class="fa-solid fa-sun"></i>';
  },
};

function atualizar() {
  const filtradas = TarefasService.filtrar(tarefas, filtroAtivo);
  UI.renderizarTarefas(filtradas);
  Storage.salvar(tarefas);
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const texto = inputTarefa.value.trim();
  const tamanhoMinimo = 3;
  const tamanhoMaximo = 200;
  const tarefaDuplicada = tarefas.some((t) => t.texto.toLowerCase() === texto.toLowerCase());

  if (tarefaDuplicada) {
    inputTarefa.setCustomValidity('Já existe uma tarefa com esse texto.');
    inputTarefa.reportValidity();
    return;
  }

  if (texto.length < tamanhoMinimo) {
    inputTarefa.setCustomValidity(`A tarefa deve conter ao menos ${tamanhoMinimo} caracteres.`);
    inputTarefa.reportValidity();
    return;
  }
  if (texto.length > tamanhoMaximo) {
    inputTarefa.setCustomValidity(`A tarefa deve conter no máximo ${tamanhoMaximo} caracteres.`);
    inputTarefa.reportValidity();
    return;
  }
  if (!texto) return;
  tarefas.push(TarefasService.criar(texto));
  inputTarefa.value = '';
  atualizar();
});

listaTarefas.addEventListener('click', (e) => {
  const btn = e.target.closest('button[data-id]');
  if (!btn) return;
  const id = Number(btn.dataset.id);
  if (btn.classList.contains('btn-concluir')) {
    tarefas = TarefasService.alternarConcluida(tarefas, id);
    atualizar();
    return;
  }
  if (btn.classList.contains('btn-remover')) {
    tarefas = TarefasService.remover(tarefas, id);
    atualizar();
    return;
  }
});

btnFiltros.forEach((btn) => {
  btn.addEventListener('click', () => {
    filtroAtivo = btn.dataset.filter;
    atualizar();
  });
});

btnTema.addEventListener('click', () => {
  const isDark = document.body.classList.toggle('theme-dark');
  UI.atualizarTema(isDark);
});

tarefas = Storage.carregar();
atualizar();