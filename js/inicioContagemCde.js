//@ sourceURL=/js/inicioContagemCde.js
debugger;
var configuracoesObj;
var listaObj;

$(CONTEUDO.CORPO.idJQ).on("ViewLoaded", function (event, view, pagina) {
    configuracoesObj = Persistencia.pegarDados(TABELAS.CONFIGURACOES); // Buscando informações do usuário.
    listaObj = Persistencia.pegarDados(TABELAS.CONTAGEM_CDE); // Buscando dados de contagem

    $('#btnIniciarProcessoDeContarCDE').on('click', function(){ BuscarProdutosLista(); });
    console.log('PesquisarProcessoDeContagemCDE');
    //window.setTimeout(function () { PesquisarProcessoDeContagemCDE();}, 50);
    if (listaObj === undefined){
        PesquisarProcessoDeContagemCDE(); 
    }else{
        //window.setTimeout(function () { AbrirView(VISOES.MODULOS_CONTAGEM); }, 50);
        AbrirView(VISOES.MODULOS_CONTAGEM);
    }

});

function PesquisarProcessoDeContagemCDE(){
    
    if (configuracoesObj && configuracoesObj.PossuiAcesso){
    	PesquisarProcessoDeContagemCDEServer(
    		{
				dados: configuracoesObj, 
				funcaoExiteNovaContagem: function(dataResult) {
                    if (dataResult === undefined){
                        ExibirMensagem('Não existe nenhuma solicitação de contagem aberta.', function(){
                            AbrirView(VISOES.PRINCIPAL);
                        });
                    }else{
                        $('#informacaoNovaContagem').show();
    					$('#lblNumeroSolicitacao').text(dataResult.Codigo);
    					$('#lblDataInicioContagem').text(FormatarData(dataResult.DataCriacao));
    					$('#lblNumeroFilial').text(configuracoesObj.Filial);
    					$(CONTEUDO.CORPO.idJQ).data('lista', dataResult);
                    }
    			}
    		}
        );
    }
    else{
        ExibirMensagem('Você não possui acesso para essa funcionalidade.', function(){
        	AbrirView(VISOES.PRINCIPAL);
        });
    }

}

function PesquisarProcessoDeContagemCDEServer(opcoes){

    ChamarApi(
        {
            nomeDoControle: "Contagem",
            parametros: ['codigoFilial=' + opcoes.dados.Filial],
            funcao200: function(dataResult){
                if (opcoes.funcaoExiteNovaContagem){
                    opcoes.funcaoExiteNovaContagem(dataResult);
                }
            },
            funcao204: function(){
                if (opcoes.funcaoExiteNovaContagem){
                    opcoes.funcaoExiteNovaContagem(undefined);
                }
            }
        }
    );

}

function BuscarProdutosLista(){
    var dados = $(CONTEUDO.CORPO.idJQ).data('lista');

    Logar(
        {
            usuario: configuracoesObj.UserCDE,
            funcaoUsuarioValido: function(senha){

                //window.setTimeout(function () { 
                    
                    ChamarApi(
                        {
                            nomeDoControle: "Lista",
                            parametros: ["codigoLista=" + dados.Codigo, 'codigoUserDevice=' + configuracoesObj.CodigoCadastro],
                            funcao200: function(dataResult){             
                                Persistencia.gravarDados(TABELAS.CONTAGEM_CDE, dataResult);
                                ExibirMensagem('Produtos carregados com sucesso.',
                                    function(){
                                        AbrirView(VISOES.MODULOS_CONTAGEM);
                                    }
                                );
                            },
                            funcao204: function(){
                                ExibirMensagem('A lista de contagem ' + dados.Codigo + ' esta vazia, não será possivel fazer contagem.', 
                                    function(){
                                        AbrirView(VISOES.PRINCIPAL);
                                    }
                                );
                            }
                            
                        }
                    );


                //}, 50);

            },
            funcaoCancelar: function(){
                console.log("cancelou");
                //Quando usuário cancela a opção de usuário.
                ExibirMensagem('Para inicio do processo de contagem é necessário validar suas credências.');
            }
        }
    );
}