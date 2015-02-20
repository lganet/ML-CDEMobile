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
			if (lido.cancelled)
				ExibirMensagem('A leitura foi cancelada, não será possivel identificar o produto.<br/>Clique em novo para iniciar o processo novamente.');
			else
				ProcurarProduto(lido.text);
		},
		function(mensagemDeErro){
			ExibirMensagem('Não foi possível ler o código de barras, ocorreu o erro:<br/>' + mensagemDeErro);
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
			MostrarNotificacao("Produto encontrado");
		}
	});

	if (indexAchado === -1){ // Não encontrou o produto.
		//$.mobile.changePage("#divConfirmDialog");
		//$('#divConfirmDialog').popup('open');
		$('<div>').simpledialog2({
		    mode: 'button',
		    headerText: 'Não encontrado!',
		    headerClose: true,
		    //themeDialog: 'a',
		    buttonPrompt: 'Gostaria de adiciona-lo na lista de contagem mesmo assim?',
		    buttons : {
		      'Sim': {
		        click: function () { 
		          //Sim
					index = listaObj.Lista.Itens.length;
					configuracaoesContagem.UltimoContado = index;
					Persistencia.gravarDados(TABELAS.CONTAGEM_CDE_CONFIGURACAO, configuracaoesContagem);
					$('#opcoesContagemLeitoraManual').data('indexContando', index);
					listaObj.Lista.Itens.push({ CB: codigoBarras, D: codigoBarras, QC: 0});
					$('#labelProdutoContando').text(item.D);
					$('#QuantidadeItens').val(item.QC);
					MostrarNotificacao("Produto incluido");
		        },
		        theme: "c"
		      },
		      'Não': {
		        click: function () { 
		          // Não
		          ProcurarProdutoLeitora();
		        },
		        theme: "a"
		      }
		    }
		  })
	}
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

	MostrarNotificacao('Contagem Salva');

	/*	
	 var n = noty({
            text        : '<div style="text-align:center">Salvo</div>',
            type        : 'success',
            dismissQueue: true,
            timeout     : 2000,
            layout      : 'bottomRight',
            theme       : 'defaultTheme'
        });

	 console.log('html: ' + n.options.id);
	 */

}

function MostrarNotificacao(mensagem) {
    var stack_bottomright = {"dir1": "up", "dir2": "left", "firstpos1": 25, "firstpos2": 25};

    var opts = {
    	title: false,
        text: "Check me out. I'm in a different stack.",
        addclass: "stack-bottomright",
        icon: true,
        width: "150px",
        animation: "slide",
        delay: 2000,
        remove: true,
        addclass: "success",
        stack: stack_bottomright
    };
    
    opts.text = mensagem;
    opts.type = "success";
    
    new PNotify(opts);
}

function NovaContagem(){
	SalvarContagem();
	ProcurarProdutoLeitora();
}