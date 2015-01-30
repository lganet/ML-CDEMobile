function ChamarConfiguracaoes() {
    AbrirView(VISOES.CONFIGURACAO);
}

$(CONTEUDO.CORPO.idJQ).on("ViewLoaded", function (event, view, pagina) {
    AbrirView(VISOES.RODAPE, CONTEUDO.RODAPE);
    
    //alert('aaa');
});