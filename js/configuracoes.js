//@ sourceURL=/js/configuracoes.js
debugger;
var cdeConfiguracoesObj;

$(CONTEUDO.CORPO.idJQ).on("ViewLoaded", function (event, view, pagina) {
    AbrirView(VISOES.RODAPE_CONFIGURACOES, CONTEUDO.RODAPE);
});

$(CONTEUDO.RODAPE.idJQ).on("ViewLoaded", function (event, view, pagina) {
    console.log('RODAPE abriu')
    CarregarConfiguracaoes();
});

// Chamado pelo evento click da view configuracoesRodape
function SalvarConfiguracao() {
    
    if (cdeConfiguracoesObj === undefined )
        cdeConfiguracoesObj = {};
    
    cdeConfiguracoesObj.Nome = $("#Nome").val();
    cdeConfiguracoesObj.UserCDE = $("#UserCDE").val();
    cdeConfiguracoesObj.Filial = $("#Filial").val();
    cdeConfiguracoesObj.EhAparelhoProprio = $("#EhAparelhoProprio").val();
    ExecutarFuncao(function(){
        Logar(
            {
            usuario: cdeConfiguracoesObj.UserCDE,
            funcaoUsuarioValido: function(senha){

                if (! cdeConfiguracoesObj.PossuiCadastro){
                    cdeConfiguracoesObj.Senha = senha;
                    
                    SolicitarAcessoUsuario(cdeConfiguracoesObj, function(){
                        //Quando usuário é válido, irei gravas as informações no smartphone.
                        Persistencia.gravarDados(TABELAS.CONFIGURACOES, cdeConfiguracoesObj);
                        //window.localStorage.setItem(TABELAS.CONFIGURACOES, cdeConfiguracoes);
                        ExibirMensagem('Configurações salvo com sucesso.');
                        CarregarConfiguracaoes();
                    });
                }

            },/*
            funcaoUsuarioInvalido: function(){
                //Quando usuário é inválido, irei deixar o usuário tentar novamente.
                ExibirMensagem('Usuário/Senha estão inválidos, necessário informar um usuário com acesso no CDE.');
            },*/
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

function SolicitarAcessoUsuario(cdeConfiguracoes, funcaoSucesso){

    var dados = {
        IdUser: cdeConfiguracoes.UserCDE,
        Senha: cdeConfiguracoes.Senha,
        Codfil: cdeConfiguracoes.Filial,
        AparelhoProprio: cdeConfiguracoes.EhAparelhoProprio,
        DeviceId: informacoesAparelho.NumeroSerie,
        DeviceName: informacoesAparelho.Modelo,
        SistemaOperacional: informacoesAparelho.SistemaOperacional + ' - Versão: ' + informacoesAparelho.Versao
    };

    var erro = false;
    var controllerName = "Usuario";
    var urlLogin = MontarUrlServicoCDE(controllerName);
   
    $.ajax({
        url: urlLogin,
        dataType: "json",
        type: 'POST',
        data: dados,
        statusCode: {
            102: function(){
                console.log('102');
            },
            200: function(dataResult){
                console.log('200');
                cdeConfiguracoes.PossuiCadastro = true;
                if (funcaoSucesso)
                    funcaoSucesso();
            },
            400: function(jqXHR, textStatus, errorThrown) {
                console.log('400');
                erro = true;
                var mensagem = '';
                if (jQuery.isPlainObject(jqXHR.responseJSON)){
                     mensagem = jqXHR.responseJSON.Mensagem;    
                }else{
                     mensagem = JSON.parse(jqXHR.responseJSON.Message).Mensagem;   
                }  
                ExibirMensagem(mensagem + '<br/>Não será possível concluir o cadastro.');

            },
            401: function(jqXHR) {
                erro = true;
                console.log('401');

                var mensagem = '';
                if (jQuery.isPlainObject(jqXHR.responseJSON)){
                     mensagem = jqXHR.responseJSON.Mensagem;    
                }else{
                     mensagem = JSON.parse(jqXHR.responseJSON.Message).Mensagem;   
                }  
                ExibirMensagem(mensagem + '<br/>Não será possível concluir o cadastro.');

            },

            404: function(jqXHR, textStatus, errorThrown) {
                console.log('404');
                erro = true;
                ExibirMensagem('Verifique o servidor de API do CDE.<br/> A mesma se encontra inacessível: ' + CONFIGURACOES.URLServico + controllerName); 
            },
            500: function(jqXHR, textStatus, errorThrown) {
                console.log('500');
                // Inesperado.
                erro = true;
                if (jqXHR && jqXHR.responseJSON && jqXHR.responseJSON.ExceptionMessage){
                    ExibirMensagem(jqXHR.responseJSON.ExceptionMessage);
                }

            }


        },
        complete: function(jqXHR, textStatus ){
            console.log('complete');
            if (textStatus && !erro && ErrosRetornoAjax[textStatus]){
                console.log(ErrosRetornoAjax[textStatus]);
                ExecutarFuncao(function(){
                    ExibirMensagem(ErrosRetornoAjax[textStatus]);
                });
            }
        }
    });
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

