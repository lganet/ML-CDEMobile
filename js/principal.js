//@ sourceURL=/js/principal.js
debugger;

function ChamarConfiguracaoes() {
    AbrirView(VISOES.CONFIGURACAO);
}

$(CONTEUDO.CORPO.idJQ).on("ViewLoaded", function (event, view, pagina) {
    AbrirView(VISOES.RODAPE, CONTEUDO.RODAPE);
});

$(CONTEUDO.RODAPE.idJQ).on("ViewLoaded", function (event, view, pagina) {
    console.log('RODAPE abriu')
    if (! app.jaValidouAcessoNoInicio){
    	app.jaValidouAcessoNoInicio = true;
    	ValidarLiberacao();
    }
});