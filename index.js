// Classe Tarefa
class Tarefa {
    constructor(nome, descricao) {
      this.nome = nome;
      this.descricao = descricao;
      this.status = 'pendente'; // Status inicial como pendente
    }
  
    // Método para marcar a tarefa como concluída
    concluir() {
      this.status = 'concluída';
    }
  
    // Método para exibir os detalhes da tarefa
    detalhes() {
      return `Nome: ${this.nome}\nDescrição: ${this.descricao}\nStatus: ${this.status}`;
    }
  }
  
  // Classe GerenciadorDeTarefas
  class GerenciadorDeTarefas {
    #tarefas = []; // Array privado para armazenar as tarefas
  
    // Método para adicionar nova tarefa
    adicionarTarefa(tarefa) {
      this.#tarefas.push(tarefa);
      this.listarTarefas(); // Atualiza a lista de tarefas
    }
  
    // Método para listar todas as tarefas
    listarTarefas() {
      const listaTarefas = document.getElementById('lista-tarefas');
      listaTarefas.innerHTML = ''; // Limpa a lista antes de atualizar
  
      this.#tarefas.forEach((tarefa, index) => {
        const tarefaElement = document.createElement('div');
        tarefaElement.className = 'tarefa';
  
        const nomeTarefa = document.createElement('span');
        nomeTarefa.textContent = tarefa.nome;
        nomeTarefa.className = tarefa.status === 'concluída' ? 'concluida' : 'pendente';
  
        // Botão de detalhes
        const detalhesBtn = document.createElement('button');
        detalhesBtn.textContent = 'Detalhes';
        detalhesBtn.onclick = () => alert(tarefa.detalhes());
  
        // Botão de concluir
        const concluirBtn = document.createElement('button');
        concluirBtn.textContent = 'Concluir';
        concluirBtn.onclick = () => {
          this.marcarComoConcluida(index);
        };
  
        // Botão de remover
        const removerBtn = document.createElement('button');
        removerBtn.textContent = 'Remover';
        removerBtn.onclick = () => {
          this.removerTarefa(index);
        };
  
        tarefaElement.appendChild(nomeTarefa);
        tarefaElement.appendChild(detalhesBtn);
        tarefaElement.appendChild(concluirBtn);
        tarefaElement.appendChild(removerBtn);
  
        listaTarefas.appendChild(tarefaElement);
      });
    }
  
    // Método para marcar uma tarefa como concluída
    marcarComoConcluida(index) {
      this.#tarefas[index].concluir();
      this.listarTarefas(); // Atualiza a lista de tarefas
    }
  
    // Método para remover uma tarefa
    removerTarefa(index) {
      this.#tarefas.splice(index, 1);
      this.listarTarefas(); // Atualiza a lista de tarefas
    }
  }
  


document.addEventListener('DOMContentLoaded', () => {
    const gerenciador = new GerenciadorDeTarefas();
  
    const formTarefa = document.getElementById('form-tarefa');
    formTarefa.onsubmit = (e) => {
      e.preventDefault();
  
      const nome = document.getElementById('nome-tarefa').value;
      const descricao = document.getElementById('descricao-tarefa').value;
  
      const novaTarefa = new Tarefa(nome, descricao);
      gerenciador.adicionarTarefa(novaTarefa);
  
      formTarefa.reset(); // Limpa o formulário
    };
  });
  