const form = document.querySelector('form');
const inputTarefa = document.querySelector('.input-tarefa');
const listaTarefas = document.querySelector('.lista-de-tarefas');
const btnTema = document.querySelector('.alterar-tema');
const btnFiltros = document.querySelectorAll('.nav button');

let tarefas = [];
let filtroAtivo = 'all';

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const tarefasTexto = inputTarefa.value.trim();

  if (!tarefasTexto) return;

  const novaTarefa = {
    id: Date.now(),
    texto: tarefasTexto,
    concluida: false,
  };

  tarefas.push(novaTarefa);
  inputTarefa.value = '';

  salvarTarefas();
  renderizarTarefas();
});

function renderizarTarefas() {
  const tarefasFiltradas = filtrar();
  listaTarefas.innerHTML = '';
  if (tarefasFiltradas.length === 0) {
    listaTarefas.innerHTML = '<p class="vazia"> Nenhuma tarefa encontrada </p>';
    return;
  }
  tarefasFiltradas.forEach((tarefa) => {
    const li = document.createElement('li');
    li.innerHTML = `
            <span class="tarefa-texto">${tarefa.texto}</span>
            <button class="btn-concluir" data-id="${tarefa.id}">Concluir</button>
        `;
    listaTarefas.appendChild(li);
  });
}

function filtrar() {
  if (filtroAtivo === 'pending') {
    return tarefas.filter((tarefa) => !tarefa.concluida);
  }
  if (filtroAtivo === 'completed') {
    return tarefas.filter((tarefa) => tarefa.concluida);
  }
  return tarefas;
}

btnFiltros.forEach((btn) => {
  btn.addEventListener('click', () => {
    filtroAtivo = btn.dataset.filter;
    renderizarTarefas();
  });
});

listaTarefas.addEventListener('click', (e) => {
  const id = Number(e.target.dataset.id);

  if (e.target.classList.contains('btn-concluir')) {
    const tarefa = tarefas.find((tarefa) => tarefa.id === id);
    tarefa.concluida = !tarefa.concluida;

    salvarTarefas();
    renderizarTarefas();
  }
});

btnTema.addEventListener('click', () => {
  document.body.classList.toggle('theme-dark');
  btnTema.textContent = document.body.classList.contains('theme-dark')
    ? '🌙'
    : '☀️';
});

function salvarTarefas() {
  localStorage.setItem('devtasks', JSON.stringify(tarefas));
}

function carregarTarefas() {
  const dados = localStorage.getItem('devtasks');

  if (dados) tarefas = JSON.parse(dados);
}

carregarTarefas();
renderizarTarefas();
