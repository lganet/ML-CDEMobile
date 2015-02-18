//@ sourceURL=/js/modulosContagemCde.js
debugger;
var listaObj;
var configuracoesObj;

$(CONTEUDO.CORPO.idJQ).on("ViewLoaded", function (event, view, pagina) {
    configuracoesObj = Persistencia.pegarDados(TABELAS.CONFIGURACOES); // Buscando informações do usuário.
    listaObj = Persistencia.pegarDados(TABELAS.CONTAGEM_CDE); // Buscando dados de contagem

    $('#btnContarUtilzandoIdentificacao').on('click', function(){ ContarProdutosLeitorMaisManual(); });
    //window.setTimeout(function () { PesquisarProcessoDeContagemCDE();}, 50);
    if (listaObj !== undefined){
        PesquisarProcessoDeContagemCDE(); 
    }else{
        ExibirMensagem('Não existe uma lista selecionada para contagem.', 
        	function(){
        		AbrirView(VISOES.INICIO_CONTAGEM);
        	}
        );
    }

});

function PesquisarProcessoDeContagemCDE(){   
    if (configuracoesObj && configuracoesObj.PossuiAcesso){
        $('#informacaoContagemExistente').show();
		$('#lblNumeroSolicitacao').text(listaObj.Lista.Codigo);
		$('#lblDataInicioContagem').text(FormatarData(listaObj.Lista.DataCriacao));
		//$(CONTEUDO.CORPO.idJQ).data('lista', dataResult);
    }
    else{
        ExibirMensagem('Você não possui acesso para essa funcionalidade.', function(){
        	AbrirView(VISOES.PRINCIPAL);
        });
    }
}

function ContarProdutosLeitorMaisManual(){
    var configuracaoesContagem = Persistencia.pegarDados(TABELAS.CONTAGEM_CDE_CONFIGURACAO);
    if (configuracaoesContagem === undefined){
        configuracaoesContagem = {};
        
        configuracaoesContagem.InicioEm = moment();
    }

    configuracaoesContagem.TipoContagem = TipoContagem.LeitoraManual;
    configuracaoesContagem.Finalizada = false;
    
    Persistencia.gravarDados(TABELAS.CONTAGEM_CDE_CONFIGURACAO, configuracaoesContagem);   

	AbrirView(VISOES.CONTAGEM_LEITOR_MANUAL);
}