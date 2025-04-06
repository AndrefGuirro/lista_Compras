let lista = JSON.parse(localStorage.getItem("lista")) || [];

function salvarLista() {
  localStorage.setItem("lista", JSON.stringify(lista));
}

function adicionarProduto() {
  const input = document.getElementById("produtoInput");
  const nome = input.value.trim();
  if (nome !== "") {
    lista.push({ nome, preco: 0, comprado: false });
    salvarLista();
    input.value = "";
    atualizarLista();
  }
}

function atualizarLista() {
  const ul = document.getElementById("listaProdutos");
  ul.innerHTML = "";
  let total = 0;

  lista.forEach((item, index) => {
    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between align-items-center";
    li.classList.toggle("comprado", item.comprado);

    const nomeSpan = document.createElement("span");
    nomeSpan.textContent = item.nome;
    nomeSpan.style.cursor = "pointer";
    nomeSpan.onclick = () => adicionarPreco(index);

    const precoSpan = document.createElement("span");
    precoSpan.textContent = item.preco > 0 ? `R$ ${item.preco.toFixed(2)}` : "";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = item.comprado;
    checkbox.onclick = () => {
      item.comprado = checkbox.checked;
      salvarLista();
      atualizarLista();
    };

    li.appendChild(checkbox);
    li.appendChild(nomeSpan);
    li.appendChild(precoSpan);
    ul.appendChild(li);

    if (item.preco > 0) total += item.preco;
  });

  document.getElementById("totalCompra").textContent = total.toFixed(2);
}

function adicionarPreco(index) {
  const preco = parseFloat(prompt("Qual o preço desse item?", lista[index].preco || ""));
  if (!isNaN(preco)) {
    lista[index].preco = preco;
    salvarLista();
    atualizarLista();
  }
}

function limparLista() {
  if (confirm("Deseja apagar toda a lista?")) {
    lista = [];
    salvarLista();
    atualizarLista();
  }
}

atualizarLista();
