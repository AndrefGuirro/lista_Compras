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
      // Multiplica se tiver quantidade, senão usa apenas o preço
      const subtotal = q > 0 ? q * p : p;
      return acc + subtotal;
    }, 0);
    valorTotalEl.textContent = total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  }

  function renderizar() {
    listaEl.innerHTML = "";

    // Organiza: Comprados vão para o final
    const listaOrdenada = [...itens].sort((a, b) => a.comprado - b.comprado);

    listaOrdenada.forEach((item) => {
      const li = document.createElement("li");
      li.className = `item-row ${item.comprado ? "comprado" : ""}`;
      li.draggable = true;
      li.dataset.id = item.id;

      li.innerHTML = `
        <div class="col-check"><input type="checkbox" ${item.comprado ? "checked" : ""}></div>
        <div class="col-nome">${item.nome}</div>
        <div class="col-qtd"><input type="number" value="${item.qtd || ""}" placeholder="0" inputmode="numeric"></div>
        <div class="col-preco"><input type="number" value="${item.preco || ""}" step="0.01" placeholder="0,00" inputmode="decimal"></div>
        <div class="col-acoes"><button class="btn-delete">&times;</button></div>
      `;

      // Eventos
      li.querySelector(".col-check input").addEventListener("change", (e) => {
        const i = itens.find(x => x.id === item.id);
        i.comprado = e.target.checked;
        salvar();
        renderizar(); // Move para o final
      });

      li.querySelector(".col-qtd input").addEventListener("input", (e) => {
        itens.find(x => x.id === item.id).qtd = e.target.value;
        salvar();
      });

      li.querySelector(".col-preco input").addEventListener("input", (e) => {
        itens.find(x => x.id === item.id).preco = e.target.value;
        salvar();
      });

      li.querySelector(".btn-delete").addEventListener("click", () => {
        itens = itens.filter(x => x.id !== item.id);
        salvar();
        renderizar();
      });

      // Drag and Drop
      li.addEventListener("dragstart", () => li.classList.add("dragging"));
      li.addEventListener("dragend", () => {
        li.classList.remove("dragging");
        sincronizarArray();
      });

      listaEl.appendChild(li);
    });
    atualizarTotal();
  }

  function sincronizarArray() {
    const idsNaTela = [...listaEl.querySelectorAll(".item-row")].map(el => Number(el.dataset.id));
    itens = idsNaTela.map(id => itens.find(x => x.id === id));
    localStorage.setItem("lista_compras_db", JSON.stringify(itens));
  }

  listaEl.addEventListener("dragover", (e) => {
    e.preventDefault();
    const dragging = document.querySelector(".dragging");
    const afterElement = (container, y) => {
      const elements = [...container.querySelectorAll(".item-row:not(.dragging)")];
      return elements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) return { offset, element: child };
        else return closest;
      }, { offset: Number.NEGATIVE_INFINITY }).element;
    };
    const next = afterElement(listaEl, e.clientY);
    if (next == null) listaEl.appendChild(dragging);
    else listaEl.insertBefore(dragging, next);
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const nome = inputItem.value.trim();
    if (nome) {
      itens.unshift({ id: Date.now(), nome, comprado: false, qtd: "", preco: "" });
      inputItem.value = "";
      salvar();
      renderizar();
    }
  });

  renderizar();
});