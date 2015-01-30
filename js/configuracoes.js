

$(CONTEUDO.CORPO.idJQ).on("ViewLoaded", function (event, view, pagina) {
    AbrirView(VISOES.RODAPE_CONFIGURACOES, CONTEUDO.RODAPE);
    CarregarConfiguracaoes();
});

$(CONTEUDO.CORPO.idJQ).on("Salvar", function(event, view, pagina) {
    alert("Salvar");
});

$(CONTEUDO.CORPO.idJQ).on("Salvar", function (event, view, pagina) {
    alert("Cancelar");
});

function CarregarConfiguracaoes() {
    if (cdeConfiguracoes != undefined) {
        $("#Nome").val(cdeConfiguracoes.Nome);
        $("#UserCDE").val(cdeConfiguracoes.UserCDE);
        $("#Filial").val(cdeConfiguracoes.Filial);
        $("#EhAparelhoProprio").val(cdeConfiguracoes.EhAparelhoProprio);
    }
}

