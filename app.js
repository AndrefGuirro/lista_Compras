let lista = [];

document.addEventListener("DOMContentLoaded", () => {
  carregarListaSalva(); // Carrega a lista se existir
  renderizarLista();
});

function adicionarProduto() {
  const input = document.getElementById('produtoInput');
  const nome = input.value.trim();

  if (nome === '') return;

  lista.push({ nome, preco: '', comprado: false });
  input.value = '';
  salvarLista();
  renderizarLista();
}

function renderizarLista() {
  const ul = document.getElementById('listaProdutos');
  ul.innerHTML = '';

  lista.forEach((item, index) => {
    const li = document.createElement('li');
    li.className = 'list-group-item d-flex align-items-center justify-content-between';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = item.comprado;
    checkbox.className = 'form-check-input me-2';
    checkbox.addEventListener('change', () => {
      item.comprado = checkbox.checked;
      salvarLista();
      renderizarLista();
    });

    const nomeProduto = document.createElement('span');
    nomeProduto.textContent = item.nome;
    if (item.comprado) nomeProduto.classList.add('comprado');

    const precoInput = document.createElement('input');
    precoInput.type = 'number';
    precoInput.placeholder = 'Preço';
    precoInput.value = item.preco;
    precoInput.className = 'form-control ms-2';
    precoInput.style.maxWidth = '100px';
    precoInput.addEventListener('input', () => {
      item.preco = precoInput.value;
      salvarLista();
      atualizarTotal();
    });

    const containerEsquerda = document.createElement('div');
    containerEsquerda.className = 'd-flex align-items-center';
    containerEsquerda.appendChild(checkbox);
    containerEsquerda.appendChild(nomeProduto);

    const containerDireita = document.createElement('div');
    containerDireita.appendChild(precoInput);

    li.appendChild(containerEsquerda);
    li.appendChild(containerDireita);
    ul.appendChild(li);
  });

  atualizarTotal();
}

function atualizarTotal() {
  const total = lista.reduce((soma, item) => {
    return soma + (parseFloat(item.preco) || 0);
  }, 0);
  document.getElementById('totalCompra').textContent = total.toFixed(2);
}

function limparLista() {
  if (confirm('Tem certeza que deseja limpar a lista?')) {
    lista = [];
    salvarLista();
    renderizarLista();
  }
}

// 🔒 Funções de persistência
function salvarLista() {
  localStorage.setItem('listaCompras', JSON.stringify(lista));
}

function carregarListaSalva() {
  const dadosSalvos = localStorage.getItem('listaCompras');
  if (dadosSalvos) {
    lista = JSON.parse(dadosSalvos);
  }
}
