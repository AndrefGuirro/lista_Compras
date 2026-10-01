document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-item");
  const inputItem = document.getElementById("input-item");
  const listaEl = document.getElementById("lista-compras");
  const valorTotalEl = document.getElementById("valor-total");

  let itens = JSON.parse(localStorage.getItem("lista_compras_db")) || [];

  function salvar() {
    localStorage.setItem("lista_compras_db", JSON.stringify(itens));
    atualizarTotal();
  }

  function atualizarTotal() {
    const total = itens.reduce((acc, item) => {
      const q = parseFloat(item.qtd) || 0;
      const p = parseFloat(item.preco) || 0;
      // Multiplica se tiver Qtd, senão usa só o Preço
      return acc + (q > 0 ? q * p : p);
    }, 0);
    valorTotalEl.textContent = total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  }

  function renderizar() {
    listaEl.innerHTML = "";
    
    // Mantém não-comprados no topo e comprados no fim
    const ordenados = [...itens].sort((a, b) => a.comprado - b.comprado);

    ordenados.forEach((item) => {
      const li = document.createElement("li");
      li.className = `item-row ${item.comprado ? "comprado" : ""}`;
      li.draggable = true;
      li.dataset.id = item.id;

      li.innerHTML = `
        <div class="col-check"><input type="checkbox" ${item.comprado ? "checked" : ""}></div>
        <div class="col-nome">${item.nome}</div>
        <div class="col-qtd"><input type="number" value="${item.qtd || ""}" placeholder="0"></div>
        <div class="col-preco"><input type="number" value="${item.preco || ""}" step="0.01" placeholder="0,00"></div>
        <div class="col-acoes"><button class="btn-delete">&times;</button></div>
      `;

      // Checkbox: Riscar e mover
      li.querySelector(".col-check input").addEventListener("change", (e) => {
        const i = itens.find(x => x.id === item.id);
        i.comprado = e.target.checked;
        salvar();
        renderizar();
      });

      // Inputs: Qtd e Preço
      li.querySelector(".col-qtd input").addEventListener("input", (e) => {
        itens.find(x => x.id === item.id).qtd = e.target.value;
        salvar();
      });

      li.querySelector(".col-preco input").addEventListener("input", (e) => {
        itens.find(x => x.id === item.id).preco = e.target.value;
        salvar();
      });

      // Excluir
      li.querySelector(".btn-delete").addEventListener("click", () => {
        itens = itens.filter(x => x.id !== item.id);
        salvar();
        renderizar();
      });

      // Drag and Drop
      li.addEventListener("dragstart", () => li.classList.add("dragging"));
      li.addEventListener("dragend", () => {
        li.classList.remove("dragging");
        sincronizarOrdem();
      });

      listaEl.appendChild(li);
    });
    atualizarTotal();
  }

  function sincronizarOrdem() {
    const idsOrdem = [...listaEl.querySelectorAll(".item-row")].map(el => Number(el.dataset.id));
    itens = idsOrdem.map(id => itens.find(x => x.id === id));
    localStorage.setItem("lista_compras_db", JSON.stringify(itens));
  }

  listaEl.addEventListener("dragover", (e) => {
    e.preventDefault();
    const dragging = document.querySelector(".dragging");
    const afterElement = getDragAfterElement(listaEl, e.clientY);
    if (afterElement == null) {
      listaEl.appendChild(dragging);
    } else {
      listaEl.insertBefore(dragging, afterElement);
    }
  });

  function getDragAfterElement(container, y) {
    const elements = [...container.querySelectorAll(".item-row:not(.dragging)")];
    return elements.reduce((closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) return { offset: offset, element: child };
      else return closest;
    }, { offset: Number.NEGATIVE_INFINITY }).element;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (inputItem.value.trim()) {
      itens.unshift({ id: Date.now(), nome: inputItem.value.trim(), comprado: false, qtd: "", preco: "" });
      inputItem.value = "";
      salvar();
      renderizar();
    }
  });

  renderizar();
});