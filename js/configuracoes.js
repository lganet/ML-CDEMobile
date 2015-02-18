//@ sourceURL=/js/configuracoes.js
debugger;
var cdeConfiguracoesObj;

$(CONTEUDO.CORPO.idJQ).on("ViewLoaded", function (event, view, pagina) {
    //AbrirView(VISOES.RODAPE_CONFIGURACOES, CONTEUDO.RODAPE);
});

$(CONTEUDO.RODAPE.idJQ).on("ViewLoaded", function (event, view, pagina) {
    console.log('RODAPE abriu')
    CarregarConfiguracaoes();
});

// Chamado pelo evento click da view configuracoesRodape
function SalvarConfiguracao() {
    
    if (cdeConfiguracoesObj === undefined )
        cdeConfiguracoesObj = {};
    
    //cdeConfiguracoesObj.Nome = $("#Nome").val();
    cdeConfiguracoesObj.UserCDE = $("#UserCDE").val();
    //cdeConfiguracoesObj.Filial = $("#Filial").val();
    //cdeConfiguracoesObj.EhAparelhoProprio = $("#EhAparelhoProprio").val();
    ExecutarFuncao(function(){
        Logar(
            {
            usuario: cdeConfiguracoesObj.UserCDE,
            funcaoUsuarioValido: function(senha){

                window.setTimeout(function () { 
                    if (! cdeConfiguracoesObj.PossuiCadastro){
                        //cdeConfiguracoesObj.Senha = senha;
                        
                            SolicitarAcessoUsuario(cdeConfiguracoesObj, senha, function(){
                                //Quando usuário é válido, irei gravas as informações no smartphone.
                                Persistencia.gravarDados(TABELAS.CONFIGURACOES, cdeConfiguracoesObj);
                                //window.localStorage.setItem(TABELAS.CONFIGURACOES, cdeConfiguracoes);
                                ExibirMensagem('Configurações salvo com sucesso.');
                                CarregarConfiguracaoes();
                            });
                    }
                }, 50);

            },
            funcaoCancelar: function(){
                console.log("cancelou");
                //Quando usuário cancela a opção de usuário.
                ExibirMensagem('Para gravar ou atualizar as informações é necessário que o usuário informado tenha acesso ao CDE.');
            } ,
            objetoDadosUsuario: cdeConfiguracoesObj 
            }
        );
    }, "Chamou Logar");
}

function SolicitarAcessoUsuario(cdeConfiguracoes, senha, funcaoSucesso){

    var dados = {
        IdUser: cdeConfiguracoes.UserCDE,
        Senha: senha,
        Codfil: cdeConfiguracoes.Filial,
        //AparelhoProprio: cdeConfiguracoes.EhAparelhoProprio,
        DeviceId: informacoesAparelho.NumeroSerie,
        DeviceName: informacoesAparelho.Modelo,
        SistemaOperacional: informacoesAparelho.SistemaOperacional + ' - Versão: ' + informacoesAparelho.Versao
    };

/*    var erro = false;
    var controllerName = "Usuario";
    var urlLogin = MontarUrlServicoCDE(controllerName);*/
   

    ChamarApi(
        {
            nomeDoControle: "Usuario",
            tipo: TipoAjax.Post,
            dados: dados,
            funcao200: function(dataResult){
                cdeConfiguracoes.PossuiCadastro = true;
                cdeConfiguracoes.CodigoCadastro = dataResult.ObjDados.Codigo;
                if (funcaoSucesso)
                    funcaoSucesso();
            },
            funcao400: function(jqXHR, textStatus, errorThrown){
                ExibirErroNoMomentoVerificarCadastro(jqXHR);
            },
            funcao401: function(jqXHR, textStatus, errorThrown){
                ExibirErroNoMomentoVerificarCadastro(jqXHR);
            }
        }
    );
}

function ExibirErroNoMomentoVerificarCadastro(jqXHR){
    var mensagem = '';
    if (jQuery.isPlainObject(jqXHR.responseJSON)){
        mensagem = jqXHR.responseJSON.Mensagem;    
    }else{
        mensagem = JSON.parse(jqXHR.responseJSON.Message).Mensagem;   
    }  
    ExibirMensagem(mensagem + '<br/>Não será possível concluir o cadastro.');
}

// Chamado pelo evento click da view configuracoesRodape
function CancelarConfiguracao() {
    AbrirView(VISOES.PRINCIPAL, CONTEUDO.CORPO);
}

function CarregarConfiguracaoes() {
    cdeConfiguracoesObj = Persistencia.pegarDados(TABELAS.CONFIGURACOES);
    
    if (cdeConfiguracoesObj !== undefined && cdeConfiguracoesObj !== null) {
        $('#divInformacoesUsuario').show();
        $('#UserCDE').textinput('disable');
        $("#UserCDE").val(cdeConfiguracoesObj.UserCDE);
        $('#infoFilial').text(cdeConfiguracoesObj.Filial);
        $('#infoNome').text(cdeConfiguracoesObj.Nome);
        $('#infoEmail').text(cdeConfiguracoesObj.email);
        $('#infoCidade').text(cdeConfiguracoesObj.filialCidade);
        $('#infoRegiao').text(cdeConfiguracoesObj.regiaoCod);
        $('#infoAcessoLiberado').text(ConverterSimNao(cdeConfiguracoesObj.PossuiAcesso));
        //Desabilito o botão salvar e verifico a permissão
        DesabilitarSalvar();
        if (! cdeConfiguracoesObj.PossuiAcesso)
            $('#btnMenuValidarAcesso').show();
    }
}

