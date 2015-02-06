//@ sourceURL=/js/configuracoes.js
debugger;
var cdeConfiguracoesObj;

$(CONTEUDO.CORPO.idJQ).on("ViewLoaded", function (event, view, pagina) {
    AbrirView(VISOES.RODAPE_CONFIGURACOES, CONTEUDO.RODAPE);
    CarregarConfiguracaoes();
});

// Chamado pelo evento click da view configuracoesRodape
function SalvarConfiguracao() {
    
    if (cdeConfiguracoesObj === undefined)
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
                    });
                }

            },
            funcaoUsuarioInvalido: function(){
                //Quando usuário é inválido, irei deixar o usuário tentar novamente.
                ExibirMensagem('Usuário/Senha estão inválidos, necessário informar um usuário com acesso no CDE.');
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

    var urlLogin = MontarUrlServicoCDE("Usuario");

    $.ajax({
        url: urlLogin,
        dataType: "json",
        type: 'POST',
        data: dados,
        statusCode: {
            // 200 e 201 não vou validar pois o mesmo irá cair no sucesso.
            401: function(response) {
                 if (response &&  response.responseJSON && response.responseJSON.Message){
                    ExibirMensagem(JSON.parse(response.responseJSON.Message).Mensagem + '<br/>Não será possível concluir o cadastro.');
                }
            },
            400: function(response) {
                if (response &&  response.responseJSON && response.responseJSON.Message){
                    ExibirMensagem(JSON.parse(response.responseJSON.Message).Mensagem + '<br/>Não será possível concluir o cadastro.');
                }
            },
            404: function(err) {
               ExibirMensagem('Verifique o servidor de API do CDE.<br/> A mesma se encontra inacessível: ' + urlLogin); 
            },
            500: function(response) {
                alert(response);
                ExibirMensagem('Aconteceu um erro não tratado pelo sistema, procure pelo suporte para ajuda.'); 
            }

        }, 
        success : function(dataResult){               
            cdeConfiguracoes.PossuiCadastro = true;
            if (funcaoSucesso)
                funcaoSucesso();
        },
        fail : function(){
            alert('Fail');
        }
    });
}

// Chamado pelo evento click da view configuracoesRodape
function CancelarConfiguracao() {
    AbrirView(VISOES.PRINCIPAL, CONTEUDO.CORPO);
}

function CarregarConfiguracaoes() {
    cdeConfiguracoesObj = Persistencia.pegarDados(TABELAS.CONFIGURACOES);
    
    if (cdeConfiguracoesObj !== undefined) {
        $('#UserCDE').textinput('disable');
        $("#Nome").val(cdeConfiguracoesObj.Nome);
        $("#UserCDE").val(cdeConfiguracoesObj.UserCDE);
        $("#Filial").val(cdeConfiguracoesObj.Filial);
        $("#EhAparelhoProprio").val(cdeConfiguracoesObj.EhAparelhoProprio).slider("refresh");
    }
}

