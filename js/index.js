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


