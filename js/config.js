//-----------------------------------------------------------------------------------------------------------------------
var VISOES = {}; // Objeto com configurações das visões do projeto.
// Rodapés
VISOES['RODAPE'] = { pagina: "rodape.html", EhCorpo: false, mostrarHome: false, ehRodape: true, alterarRodapePara: undefined};
VISOES['RODAPE_CONFIGURACOES'] = { pagina: "configuracoesRodape.html", EhCorpo: false, mostrarHome: false, ehRodape: true, alterarRodapePara: undefined};
// Corpos
VISOES['CONFIGURACAO'] = { pagina: "configuracoes.html", EhCorpo: true, mostrarHome: true, ehRodape: false, alterarRodapePara: VISOES.RODAPE_CONFIGURACOES};
VISOES['PRINCIPAL'] =  { pagina: "principal.html", EhCorpo: true, mostrarHome: false, ehRodape: false, alterarRodapePara: VISOES.RODAPE};
VISOES['INICIO_CONTAGEM'] = { pagina: "inicioContagemCde.html", EhCorpo: true, mostrarHome: true, ehRodape: false, alterarRodapePara: VISOES.RODAPE};
VISOES['MODULOS_CONTAGEM'] = { pagina: "modulosContagemCde.html", EhCorpo: true, mostrarHome: true, ehRodape: false, alterarRodapePara: VISOES.RODAPE};
VISOES['CONTAGEM_LEITOR_MANUAL'] = { pagina: "contagemLeitorManual.html", EhCorpo: true, mostrarHome: true, ehRodape: false, alterarRodapePara: VISOES.RODAPE};
//-----------------------------------------------------------------------------------------------------------------------

//-----------------------------------------------------------------------------------------------------------------------
var CONTEUDO =
{
    CABECALHO: { id: "page1header", idJQ: "#page1header" },
    CORPO: { id: "page1Content", idJQ: "#page1Content" },
    RODAPE: { id: "page1footer", idJQ: "#page1footer" }
};
//-----------------------------------------------------------------------------------------------------------------------

//-----------------------------------------------------------------------------------------------------------------------
var TABELAS = 
{
	CONFIGURACOES: "cdeConfiguracoes",
    CONTAGEM_CDE: "cdeContagemCDE",
    CONTAGEM_CDE_CONFIGURACAO: "cdeContagemConfiguracaoCDE",
};
//-----------------------------------------------------------------------------------------------------------------------

//-----------------------------------------------------------------------------------------------------------------------
var TipoContagem = {
    SomenteLeitora: 1,
    LeitoraManual: 2,
    PorLinha: 3
}
//-----------------------------------------------------------------------------------------------------------------------

//-----------------------------------------------------------------------------------------------------------------------
var TipoAjax = {
    Get: "GET",
    Post: "POST"
}
//-----------------------------------------------------------------------------------------------------------------------

//-----------------------------------------------------------------------------------------------------------------------
// -- Erros não capturados pelos códigos de retorno.
var ErrosRetornoAjax = {};
ErrosRetornoAjax['error'] = 'Error - Ocorreru um erro não tratado pelo sistema, se o mesmo persistir contacte o suporte.';
ErrosRetornoAjax['timeout'] = 'Timeout - Ocorreru um erro não tratado pelo sistema, se o mesmo persistir contacte o suporte.';
ErrosRetornoAjax['abort'] = 'Abort - Ocorreru um erro não tratado pelo sistema, se o mesmo persistir contacte o suporte.';
ErrosRetornoAjax['parsererror'] = 'ParserError - Ocorreru um erro não tratado pelo sistema, se o mesmo persistir contacte o suporte.';
// -- Erros não capturados pelos códigos de retorno.
//-----------------------------------------------------------------------------------------------------------------------

//-----------------------------------------------------------------------------------------------------------------------
// Ambiente DEV Local
var CONFIGURACOES = 
{
	URLServico: "http://192.168.31.18:61203/api/"
    //URLServico: "http://localhost:61203/api/"
};

/*
//Ambiente DEV Servidor
var CONFIGURACOES = 
{
	URLServico: "http://10.30.0.83/CDEMobile/api/"
};
*/
//-----------------------------------------------------------------------------------------------------------------------