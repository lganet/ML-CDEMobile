//@ sourceURL=/js/contagemLeitorManual.js
debugger;
var listaObj = Persistencia.pegarDados(TABELAS.CONTAGEM_CDE); // Buscando dados de contagem
var configuracaoesContagem = Persistencia.pegarDados(TABELAS.CONTAGEM_CDE_CONFIGURACAO);

$(CONTEUDO.CORPO.idJQ).on("ViewLoaded", function (event, view, pagina) {
    $('#btnAdicionar').on("click", function(){ AdicionarProduto(); });
    $('#btnRetirar').on("click", function(){ RetirarProduto(); });
	$('#btnNovo').on("click", function(){ NovaContagem(); });
	$('#btnSalvarContagem').on("click", function(){ SalvarContagem(); });

    window.setTimeout(function () { VerificarContagem(); }, 50);
    
});

function AdicionarProduto(){
	var $qtde = $('#QuantidadeItens');
	$qtde.val(parseInt($qtde.val()) + 1);
	navigator.vibrate([500]);
}

function RetirarProduto(){
	var $qtde = $('#QuantidadeItens');
	$qtde.val(parseInt($qtde.val()) - 1);
	navigator.vibrate([300, 500, 300]);
}

function VerificarContagem(){
	
    $("#inicioDeContagem").on("popupafteropen", function( event, ui ) {
        $('#inicioDeContagem').trigger('create');
        $('#btnIniciarContagemLeitoraManual').on('click', function(){ 
        	$('#inicioDeContagem').popup('close');
        });
    });

	$("#inicioDeContagem").on("popupafterclose", function(){
        $("#inicioDeContagem").off("popupafterclose");
		ProcurarProdutoLeitora();
    });

	//var configuracaoesContagem = Persistencia.pegarDados(TABELAS.CONTAGEM_CDE_CONFIGURACAO);
	$('#inicioDeContagem').popup('open');
}

//Abre a opção de leitura por código de barra e pega o valor lido e procura o mesmo na lista de códigos de barras extraido.
function ProcurarProdutoLeitora(){

	if (configuracaoesContagem.UltimoContado !== undefined){
		$('#labelUltimoProdutoContando').text(DetalhesItem(configuracaoesContagem.UltimoContado).D);
	}

	scan(
		function(lido){
			ProcurarProduto(lido.text);
		},
		function(){
			ExibirMensagem('A leitura foi cancelada, não será possivel identificar o produto.<br/>Clique em novo para iniciar o processo novamente.');
		}
	)
}


function ProcurarProduto(codigoBarras){
	var indexAchado = -1;
	$.each(listaObj.Lista.Itens, function(index, item){
		if (item.CB === codigoBarras){
			$('#labelProdutoContando').text(item.D);
			$('#QuantidadeItens').val(item.QC);
			indexAchado = index;
			configuracaoesContagem.UltimoContado = index;
			Persistencia.gravarDados(TABELAS.CONTAGEM_CDE_CONFIGURACAO, configuracaoesContagem);
			$('#opcoesContagemLeitoraManual').data('indexContando', index);

		}
	});
}

function DetalhesItem(index){
	return listaObj.Lista.Itens[index];
}

function SalvarContagem(){
	var index = $('#opcoesContagemLeitoraManual').data('indexContando');

	if (index !== undefined){
		listaObj.Lista.Itens[index].QC = $('#QuantidadeItens').val();
		Persistencia.gravarDados(TABELAS.CONTAGEM_CDE, listaObj);
	}
}

function NovaContagem(){
	SalvarContagem();
	ProcurarProdutoLeitora();
}