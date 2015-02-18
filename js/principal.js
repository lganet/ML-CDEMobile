//@ sourceURL=/js/principal.js
debugger;

function ChamarConfiguracaoes() {
    AbrirView(VISOES.CONFIGURACAO);
}

$(CONTEUDO.CORPO.idJQ).on("ViewLoaded", function (event, view, pagina) {
    VerificarContagemInacabada();
});

$(CONTEUDO.RODAPE.idJQ).on("ViewLoaded", function (event, view, pagina) {
    console.log('RODAPE abriu')
    if (! app.jaValidouAcessoNoInicio){
    	app.jaValidouAcessoNoInicio = true;
    	ValidarLiberacao();
    }
});

function VerificarContagemInacabada(){
	var configuracaoesContagem = Persistencia.pegarDados(TABELAS.CONTAGEM_CDE_CONFIGURACAO);
    if (configuracaoesContagem && ! configuracaoesContagem.Finalizada){
    	var listaObj = Persistencia.pegarDados(TABELAS.CONTAGEM_CDE); // Buscando dados de contagem
        
        $('#contagemNaoFinalizada').show();
		$('#lblNumeroSolicitacao').text(listaObj.Lista.Codigo);
		$('#lblDataInicioContagem').text(FormatarData(configuracaoesContagem.InicioEm));
        
		$('#btnIniciarProcessoDeContarCDE').on('click', function(){
			if (configuracaoesContagem.TipoContagem === TipoContagem.LeitoraManual){
				AbrirView(VISOES.CONTAGEM_LEITOR_MANUAL);
			}else{
				alert('OPS');
			}
		});
    }


}