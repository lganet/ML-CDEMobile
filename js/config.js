var VISOES =
{
    CONFIGURACAO: { pagina: "configuracoes.html", EhCorpo: true, mostrarHome: true },
    PRINCIPAL: { pagina: "principal.html", EhCorpo: true, mostrarHome: false },
    RODAPE: { pagina: "rodape.html", EhCorpo: false, mostrarHome: false },
    RODAPE_CONFIGURACOES: { pagina: "configuracoesRodape.html", EhCorpo: false, mostrarHome: false }

};

var CONTEUDO =
{
    CABECALHO: { id: "page1header", idJQ: "#page1header" },
    CORPO: { id: "page1Content", idJQ: "#page1Content" },
    RODAPE: { id: "page1footer", idJQ: "#page1footer" }
};

var TABELAS = 
{
	CONFIGURACOES: "cdeConfiguracoes"
};


// Ambiente DEV Local
var CONFIGURACOES = 
{
	URLServico: "http://192.168.31.18:61203/api/"
};

/*
//Ambiente DEV Servidor
var CONFIGURACOES = 
{
	URLServico: "http://10.30.0.83/CDEMobile/api/"
};
*/