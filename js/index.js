//  Persistir dados no LocalStorage

var mercadoriasRaw = localStorage.getItem("listaDeMercadorias");

if (mercadoriasRaw != null) {
  var listaDeMercadorias = JSON.parse(mercadoriasRaw);
} else if (mercadoriasRaw == null) {
  var listaDeMercadorias = [];
}

desenhaTabela();

//  Validação e máscara do formulário

function mascaraValor(e) {
  e.preventDefault();

  if (/[0-9]+/g.test(e.key) && e.target.value.length < 14) {
    e.target.value += e.key;
  }

  var meuInput = Number(e.target.value.replace(/[^0-9]+/g, ""));
  meuInput = meuInput / 100;
  inputFormatado = meuInput.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  });

  e.target.value = inputFormatado;
}

// Listagem das transações

function desenhaTabela() {
  linhasExistentes = [
    ...document.querySelectorAll(
      "table.lista-mercadoria tbody .conteudo-dinamico"
    ),
  ];

  linhasExistentes.forEach((element) => {
    element.remove();
  });

  var total = 0;

  for (merc in listaDeMercadorias) {
    document.querySelector("table.lista-mercadoria tbody").innerHTML += `
        <tr class='conteudo-dinamico'>
            <td>
            ${listaDeMercadorias[merc]["tipo-transacao"] === "-" ? "-" : "+"}
            </td>
            <td>
            ${listaDeMercadorias[merc]["nome-mercadoria"]}
            </td>
            <td style="text-align:right;">
            ${listaDeMercadorias[merc]["valor-mercadoria"]}
            </td>
            <tr class="linha-tabela">
                <td class="linha-tabela" colspan="3"></td>
            </tr>
        </tr>`;

    valores = parseFloat(
      listaDeMercadorias[merc]["valor-mercadoria"]
        .replace(/[^0-9]/g, "")
        .replace(",", ".")
    );

    if (listaDeMercadorias[merc]["tipo-transacao"] === "-") {
      total -= valores / 100;
    } else if (listaDeMercadorias[merc]["tipo-transacao"] === "+") {
      total += valores / 100;
    }
  }

  var totalFormatado = total.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  document.querySelector("table.lista-mercadoria tfoot").innerHTML += `
    <tr>
        <td class="linha-tabela" style="padding-top: 4px; border-top: 2px solid #979797; border-bottom: 2px solid #979797" colspan="3"></td>
    </tr>
    <tr>
        <td></td>
        <td><strong>Total</strong></td>
        <td style="text-align:right; display: block;" id="valor-total"><strong>${totalFormatado}</strong>
        <p>${total > 0 ? "[LUCRO]" : total < 0 ? "[PREJUÍZO]" : ""}</p>
        </td>
    </tr>`;

  // Desenhando tabela sem transações cadastradas
  if (localStorage.length == 0) {
    document.querySelector("table.lista-mercadoria tbody").innerHTML += `
        <tr id='sem-transacao'>
          <td colspan="3" style ="text-align: center; padding-bottom: 10px"}>
              Nenhuma transação cadastrada.
          </td>
        <tr>`;
  }
}

function limparTabela() {
  document.querySelector("table.lista-mercadoria tbody").innerHTML = "";
  document.querySelector("table.lista-mercadoria tfoot").innerHTML = "";
}

// Excluindo listagem de mercadorias

function limparDados(merc) {
  if (confirm("Tem certeza que deseja limpar os dados da pagina?") == true) {
    localStorage.clear();
    listaDeMercadorias = [];
    limparTabela();
    desenhaTabela();
  }
}

// Cadastrando transações

function cadastroTransacao(evt) {
  evt.preventDefault();

  listaDeMercadorias.push({
    "tipo-transacao": evt.target.elements["tipo-transacao"].value,
    "nome-mercadoria": evt.target.elements["nome-mercadoria"].value,
    "valor-mercadoria": evt.target.elements["valor-mercadoria"].value,
  });

  localStorage.setItem(
    "listaDeMercadorias",
    JSON.stringify(listaDeMercadorias)
  );

  if (listaDeMercadorias != null) {
    limparTabela();
    desenhaTabela();

    // Apagando valores do input após submeter
    document.getElementById("tipo-transacao").value = "-";
    document.getElementById("nome-mercadoria").value = "";
    document.getElementById("valor-mercadoria").value = "";
  }
}
