let lista = [];
let total = 0;

function adicionarProduto() {
  const input = document.getElementById('produtoInput');
  const nomeProduto = input.value.trim();

  if (nomeProduto !== "") {
    lista.push({ nome: nomeProduto, comprado: false, preco: 0 });
    input.value = "";
    atualizarLista();
  }
}

function atualizarLista() {
  const ul = document.getElementById('listaProdutos');
  ul.innerHTML = "";

  total = 0;

  lista.forEach((item, index) => {
    const li = document.createElement("li");
    li.className = "list-group-item";

    const row = document.createElement("div");
    row.className = "row align-items-center";

    // Checkbox
    const colCheck = document.createElement("div");
    colCheck.className = "col-2 text-center";
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = item.comprado;
    checkbox.onclick = () => {
      item.comprado = !item.comprado;
      atualizarLista();
    };
    colCheck.appendChild(checkbox);

    // Nome do produto
    const colNome = document.createElement("div");
    colNome.className = "col-6";
    colNome.textContent = item.nome;
    if (item.comprado) colNome.classList.add("comprado");

    // Campo de preço
    const colPreco = document.createElement("div");
    colPreco.className = "col-4";
    const inputPreco = document.createElement("input");
    inputPreco.type = "number";
    inputPreco.placeholder = "0.00";
    inputPreco.value = item.preco || "";
    inputPreco.className = "form-control";
    inputPreco.onchange = (e) => {
      item.preco = parseFloat(e.target.value) || 0;
      atualizarLista();
    };
    colPreco.appendChild(inputPreco);

    // Soma preço se preenchido
    if (!isNaN(item.preco)) {
      total += item.preco;
    }

    // Monta a linha
    row.appendChild(colCheck);
    row.appendChild(colNome);
    row.appendChild(colPreco);
    li.appendChild(row);
    ul.appendChild(li);
  });

  document.getElementById("totalCompra").textContent = total.toFixed(2);
}

function limparLista() {
  if (confirm("Deseja realmente limpar a lista?")) {
    lista = [];
    atualizarLista();
  }
}
