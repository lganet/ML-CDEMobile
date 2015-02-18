/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        informacoesAparelho = {
            Modelo: (device !== undefined && device.model !== undefined ? device.model : "N-95"),
            NumeroSerie: (device !== undefined && device.uuid !== undefined ? device.uuid : "00000000-00000-0000"),
            SistemaOperacional: (device !== undefined && device.platform !== undefined ? device.platform : "symbiam"),
            Versao: (device !== undefined && device.version !== undefined ? device.version : "beta")
        };

    },
    jaValidouAcessoNoInicio : false
};

/*
    Declaro aqui para poder "MOCAR" e funcionar no browser qndo preciso testar.
    Os dados serão re-escritos com os valores pelo evento: deviceready.
*/
var informacoesAparelho = {
    Modelo: "N-95",
    NumeroSerie: "00000000-00000-0000",
    SistemaOperacional: "symbiam",
    Versao:"beta"
};

function MontarUrlServicoCDE(api, parametros){
    var url = CONFIGURACOES.URLServico + api;

    if (parametros !== undefined){
        if (Array.isArray(parametros)){
            $.each(parametros, function(index, obj){
                if(index == 0)
                    url += '?' + obj;
               else
                    url += '&' + obj;
            });
        }else{
            url += '?' + parametros;
        }
    }

    return url;
}


function Logarr(){
    var cdeConfiguracoesObj = {};

    console.log("teste");
    cdeConfiguracoesObj.Nome = 'Gustavo';
    cdeConfiguracoesObj.UserCDE = 'CBT_SILVA';
    cdeConfiguracoesObj.Filial = '500';
    cdeConfiguracoesObj.EhAparelhoProprio = 'true';
    console.log("teste");

    Logar({
        usuario: cdeConfiguracoesObj.UserCDE,
        funcaoUsuarioValido: function(){
            //Quando usuário é válido, irei gravas as informações no smartphone.
            console.log(JSON.stringify(cdeConfiguracoesObj));
            //window.localStorage.setItem(TABELAS.CONFIGURACOES, cdeConfiguracoes);
            ExibirMensagem('Configurações salvo com sucesso.');
        },/*
        funcaoUsuarioInvalido: function(){
            //Quando usuário é inválido, irei deixar o usuário tentar novamente.
            ExibirMensagem('Usuário/Senha estão inválidos, necessário informar um usuário com acesso no CDE.');
        },*/
        funcaoCancelar: function(){
            console.log("cancelou");
            //Quando usuário cancela a opção de usuário.
            ExibirMensagem('Para gravar ou atualizar as informações é necessário que o usuário informado tenha acesso ao CDE.');
        },
        objetoDadosUsuario: cdeConfiguracoesObj}
    );
}

/*----------------------------------------------------------------------------
Funções relacionadas ao login do usuário
Parametros:
    usuario
    funcaoUsuarioValido
    funcaoUsuarioInvalido
    funcaoCancelar
    objetoDadosUsuario
----------------------------------------------------------------------------*/
function Logar(opcoes){
    
    var funcaoExecutar;
    
    /*
    if (checkConnection()){
        ExibirMensagem('Para realizar qualquer funcionalidade que necessite verificar suas credencias ' + 
            'é necessário estar conectado a uma rede Wifi conectada com a rede do Magazine Luiza.<br/><b>Não foi possível concluir a ação.</b>');
        return false;
    }
    */

    $("#divLogin").on("popupafteropen", function( event, ui ) {
        $("#divLogin").off("popupafteropen");
        //console.log('abriu login §§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§');
        if (opcoes.usuario !== undefined && opcoes.usuario !== ''){
            $('#divLoginUsuario').val(opcoes.usuario);
            $('#divLoginUsuario').textinput('disable');
        }else{
            $('#divLoginUsuario').val('');
            $('#divLoginUsuario').textinput('enable');
        }
        $('#divLoginSenha').val('');
        $('#divLogin').trigger('create');
    });

    $("#divLogin").on("popupafterclose", function(){
        $("#divLogin").off("popupafterclose");
        //console.log('fechou login §§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§');
        //$('#page1').trigger('create');
        if (funcaoExecutar)
            funcaoExecutar();
    });

    //Verifica se o aparelho está conectado Via WIFI
    window.setTimeout(function () { $("#divLogin").popup( "open", {positionTo: "window"}); }, 50);
    
    // Quando logar.
    $("#divLoginBtnCancelar").on("click", function(e){
        $("#divLogin").popup( "close" );
        $("#divLoginBtnCancelar").off("click");
        
        if (opcoes.funcaoCancelar){
            funcaoExecutar = opcoes.funcaoCancelar;
        }

    });
    // Quando cancelar. 
    $("#divLoginBtnLogar").on("click", function(e){
        $("#divLogin").popup( "close" );
        $("#divLoginBtnLogar").off("click");
        //funcaoExecutar = FazerLogin({usuario: $('#divLoginUsuario').val(), senha: $('#divLoginSenha').val(), funcaoUsuarioValido: opcoes.funcaoUsuarioValido, funcaoUsuarioInvalido: opcoes.funcaoUsuarioInvalido, objetoDadosUsuario: opcoes.objetoDadosUsuario});
        FazerLogin({usuario: $('#divLoginUsuario').val(), senha: $('#divLoginSenha').val(), funcaoUsuarioValido: opcoes.funcaoUsuarioValido, funcaoUsuarioInvalido: opcoes.funcaoUsuarioInvalido, objetoDadosUsuario: opcoes.objetoDadosUsuario});
    });
}

/*
Chama API responsável pela validação do usuário.
Parametros:
    usuario
    senha
    funcaoUsuarioValido
    funcaoUsuarioInvalido
    objetoDadosUsuario
*/
function FazerLogin(opcoes) {
      
    var codigoHttp = '';
    ChamarApi(
        {
            nomeDoControle: "Login",
            parametros: ['DeviceId=' + informacoesAparelho.NumeroSerie, 'Login=' + opcoes.usuario, 'Senha=' + opcoes.senha],
            funcao200: function(dataResult){
                if (dataResult !== undefined){
                    data = dataResult.ObjDados;
                }
                if (opcoes.objetoDadosUsuario !== undefined && data !== undefined){
                    //opcoes.objetoDadosUsuario.CodigoCadastro = dataResult.Codigo;
                    opcoes.objetoDadosUsuario.PossuiCadastro = dataResult.PossuiCadastro;
                    opcoes.objetoDadosUsuario.PossuiAcesso = dataResult.PossuiAcesso;
                    opcoes.objetoDadosUsuario.UserCDE = data.id_user;
                    opcoes.objetoDadosUsuario.email = data.email;
                    opcoes.objetoDadosUsuario.Nome = data.nome;
                    opcoes.objetoDadosUsuario.cpf = data.cpf;
                    opcoes.objetoDadosUsuario.chapa = data.chapa;
                    opcoes.objetoDadosUsuario.Filial = data.filial;
                    opcoes.objetoDadosUsuario.filialAtu = data.filialAtu;
                    opcoes.objetoDadosUsuario.cargo = data.cargo;
                    opcoes.objetoDadosUsuario.cdiContratado = data.cdiContratado;
                    opcoes.objetoDadosUsuario.grupoUsuario = data.grupoUsuario;
                    opcoes.objetoDadosUsuario.codUserGemco = data.codUserGemco;
                    opcoes.objetoDadosUsuario.filialCidade = data.filialCidade;
                    opcoes.objetoDadosUsuario.filialEstado = data.filialEstado;
                    opcoes.objetoDadosUsuario.regiaoCod = data.regiaoCod;
                    opcoes.objetoDadosUsuario.regiaoDescr = data.regiaoDescr;
                }

                if (opcoes.funcaoUsuarioValido){
                    opcoes.funcaoUsuarioValido(opcoes.senha);
                }
            },
            funcao401: function(jqXHR){
                TratarAjaxRespostaErro(jqXHR, true, opcoes.funcaoUsuarioInvalido, '401');
            }
        }
    );

}

function TratarAjaxRespostaErro(jqXHR, erro, funcaoInvalido, codigoErro){
    console.log(codigoErro);
    if (jqXHR && jqXHR.responseJSON){
        if (jQuery.isPlainObject(jqXHR.responseJSON)){
            ExibirMensagem(jqXHR.responseJSON.Mensagem);    
        }else{
            ExibirMensagem(JSON.parse(jqXHR.responseJSON.Message).Mensagem);    
        }                   
    }

    if (funcaoInvalido)
        funcaoInvalido(erro);  
}

/*----------------------------------------------------------------------------
Funções relacionadas ao login do usuário
----------------------------------------------------------------------------*/

/*----------------------------------------------------------------------------
Funções para trabalho de persistência permanente
----------------------------------------------------------------------------*/
var Persistencia = {
    gravarDados: function (tabela, jsonData){
        window.localStorage.removeItem(tabela);
        window.localStorage.setItem(tabela, JSON.stringify(jsonData));
    },
    pegarDados: function(tabela){
        var dados =  window.localStorage.getItem(tabela);
        if (dados)
            return JSON.parse(dados);
        else
            dados = undefined;

        return dados;
    },
    removerDados: function (tabela){
         window.localStorage.removeItem(tabela);
    }
};

/*----------------------------------------------------------------------------
Funções para trabalho de persistência permanente
----------------------------------------------------------------------------*/

/*----------------------------------------------------------------------------
Método responsável pelas chamadas por Ajax
- Parametros:
-   opcoes.nomeDoControle - Nome do método a ser chamado no servidor.
-   opcoes.parametros - Parametros -- Array com os parametros necessários para o método, qndo 'GET'.
-   opcoes.tipo - Utilizar o enumerador: TipoAjax.Get ou TipoAjax.Post. Padrão 'Get', quando não especificado.
-   opcoes.dados - Parametros -- Json com os dados necessários para o método, qndo 'POST'.
- Funções de sucesso.
-   opcoes.funcao200(dadosRetornados) - Função a ser chamado quando os dados forem ok - 200.
-   opcoes.funcao204(dadosRetornados) - Função a ser chamado quando os dados forem NoContent - 204.
- Funções de Erro: Quando a mesma não for especificada será exibido uma mensagem com o erro. Caso especificado será apenas chamada a função de callback.
-   opcoes.funcao400(jqXHR, textStatus, errorThrown) - Função a ser chamado quando ocorrer um erro 400- parametros estão dispoinveis para tratativa.
-   opcoes.funcao401(jqXHR, textStatus, errorThrown) - Função a ser chamado quando ocorrer um erro 401 - Falta de Permissão - parametros estão dispoinveis para tratativa.
-   opcoes.funcao404(jqXHR, textStatus, errorThrown) - Função a ser chamado quando ocorrer um erro 404 - Não encontrado - parametros estão dispoinveis para tratativa.
-   opcoes.funcao500(jqXHR, textStatus, errorThrown) - Função a ser chamado quando ocorrer um erro 500 - Erro Interno - parametros estão dispoinveis para tratativa.
----------------------------------------------------------------------------*/
function ChamarApi(opcoes){
    //var controllerName = opcoes.nomeDoControle;
    var urlLogin = MontarUrlServicoCDE(opcoes.nomeDoControle, opcoes.parametros);
    var erro = false;

    if (!opcoes.tipo)
        opcoes.tipo = TipoAjax.Get;

    if (! opcoes.dados)
        opcoes.dados = '';

    $.ajax({
        url: urlLogin,
        dataType: "json",
        type: opcoes.tipo,
        data: opcoes.dados,
        statusCode: {
            102: function(){
                console.log('102');
            },
            200: function(dataResult){
                console.log('200');
                if (opcoes.funcao200){
                    opcoes.funcao200(dataResult);
                }
            },
            204: function(dataResult){
                console.log('204');
                if (opcoes.funcao204){
                    opcoes.funcao204(dataResult);
                }
            },
            400: function(jqXHR, textStatus, errorThrown) {
                erro = true;
                if (opcoes.funcao400)
                    opcoes.funcao400(jqXHR, textStatus, errorThrown);
                else
                    TratarAjaxRespostaErro(jqXHR, erro, undefined, '400');
            },
            401: function(jqXHR, textStatus, errorThrown) {
                erro = true;
                if (opcoes.funcao401)
                    opcoes.funcao401(jqXHR, textStatus, errorThrown);
                else
                    TratarAjaxRespostaErro(jqXHR, erro, undefined, '401');
            },
            404: function(jqXHR, textStatus, errorThrown) {
                erro = true;
                console.log('404');
                if (opcoes.funcao404)
                    opcoes.funcao404(jqXHR, textStatus, errorThrown);
                else
                    ExibirMensagem('Verifique o servidor de API do CDE.<br/> A mesma se encontra inacessível: ' + CONFIGURACOES.URLServico + opcoes.nomeDoControle); 
            },
            500: function(jqXHR, textStatus, errorThrown) {
                // Inesperado.
                erro = true;
                console.log('500');
                if (opcoes.funcao500)
                    opcoes.funcao500(jqXHR, textStatus, errorThrown);
                else
                    TratarAjaxRespostaErro(jqXHR, erro, undefined, '500');

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
/*----------------------------------------------------------------------------
Método responsável pelas chamadas por Ajax
----------------------------------------------------------------------------*/


function checkConnection() {
    var networkState = navigator.connection.type;
    return (networkState === Connection.ETHERNET);
    /*
    var states = {};
    states[Connection.UNKNOWN]  = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI]     = 'WiFi connection';
    states[Connection.CELL_2G]  = 'Cell 2G connection';
    states[Connection.CELL_3G]  = 'Cell 3G connection';
    states[Connection.CELL_4G]  = 'Cell 4G connection';
    states[Connection.CELL]     = 'Cell generic connection';
    states[Connection.NONE]     = 'No network connection';
   */
}


function ExibirMensagem(mensagem, funcaoClose){
    var funcaoExecutar;
    
    $("#divAlert").on("popupafteropen", function( event, ui ) {
        $('#divAlert').trigger('create');
    });

    $("#divAlert").on("popupafterclose", function(){
        console.log('fecho');
        $("#divAlert").off("popupafterclose");
        if (funcaoExecutar)
            funcaoExecutar();
    });


    $("#divAlert #divAlertMessage").html(mensagem);
    window.setTimeout(function () { $("#divAlert").popup( "open" ); }, 50);

    $("#divAlertBtnCloseMessage").click(function (e){
        $("#divAlert").popup( "close" );
        if (funcaoClose)
            funcaoExecutar = funcaoClose;
    });
}

// Coloca try cath na funções e chama o console log com o erro, caso ocorra.
function ExecutarFuncao(funcao, msgLog) {
    try {
        if (msgLog)
            console.log(msgLog);
        funcao();
    }
    catch (err) {
        console.log(err.message);
    }
}

//---------------------------------------------------------------------------------------------------
// Função responsável pelas mudanças das views exbidas.
// Os rodapés serão abertos automaticamente, de acordo com sua ligação no arquivo de configuração.
//---------------------------------------------------------------------------------------------------
function AbrirView(visao, conteudo) {
    
    ExecutarFuncao(function () {
        var conteudoMudar = (conteudo == undefined ? CONTEUDO.CORPO.idJQ : conteudo.idJQ);
        //$(conteudoMudar).html('');
        $(conteudoMudar).data('visao', visao);

        $(conteudoMudar).load(visao.pagina, function (response, status, xhr) {
            if ( status == "error" ) {
                var msg = "Sorry but there was an error: ";
                alert( msg + xhr.status + " " + xhr.statusText );
            }

            $(this).trigger('create');
            if (! visao.EhCorpo) {
                $("[data-role='header'], [data-role='footer']").toolbar("destroy").toolbar();
            }

            if (visao.EhCorpo) {
                if (! visao.mostrarHome) {
                    $("#btnHome").hide();
                } else {
                    $("#btnHome").show();
                }
            }

            $(conteudoMudar).trigger("ViewLoaded", [visao, conteudo]);
            $(conteudoMudar).off("ViewLoaded");
            console.log('00000000000000000000 CHAMOU SUCESSO 0000000000000000000 ->' + visao.pagina);

            if (visao.EhCorpo && visao.alterarRodapePara !== undefined){
                if ($(CONTEUDO.RODAPE.idJQ).data('visao') === undefined || $(CONTEUDO.RODAPE.idJQ).data('visao') !== visao.alterarRodapePara){
                    console.log('Alterando o rodapé, pois ele é diferente do especificado');
                    AbrirView(visao.alterarRodapePara, CONTEUDO.RODAPE);
                }else{
                    console.log('Não estou alterando rodapé, pois ele é IGUAL.');
                }
            }
        });
    });
}
//---------------------------------------------------------------------------------------------------
// Função responsável pelas mudanças das views exbidas.
//---------------------------------------------------------------------------------------------------

function ExibirLoading(theme, msg) {

    theme = theme || $.mobile.loader.prototype.options.theme,
    msgText = msg || $.mobile.loader.prototype.options.text,
    textVisible =  (msg !== undefined ? true : false), // || $.mobile.loader.prototype.options.textVisible,
    textonly = false;
    html ="";
    $('body').append("<div class='ui-loader-background'> </div>");
    $.mobile.loading("show", {
        text: msgText,
        textVisible: textVisible,
        theme: theme,
        textonly: textonly,
        html: html
    });
}

function EsconderLoading() {
    $('body').remove('.ui-loader-background');
    $.mobile.loading("hide");
}

function isMobile() {
  try{ document.createEvent("TouchEvent"); return true; }
  catch(e){ return false; }
}

function ConverterSimNao(flag){
    if (flag || flag === 'true')
        return "Sim";
    else
        return "Não";
}

/*----------------------------------------------------------------------------
Funções relacionadas a validação de acesso do usuário;
----------------------------------------------------------------------------*/
function ValidarLiberacao(){
    var configuracoesObj = Persistencia.pegarDados(TABELAS.CONFIGURACOES);

    if (configuracoesObj){
        if (configuracoesObj.PossuiAcesso){
            $('#btnMenuContagemCDE').removeClass('ui-disabled');
            return true;
        }else{
            //Vou no servidor validar se a permissão já foi dada.
            ValidarLiberacaoServe(configuracoesObj);
        }
    }
    else{
        return false;
    }

}

function ValidarLiberacaoServe(configuracoesObj){
        
    Logar({
        usuario: configuracoesObj.UserCDE,
        funcaoUsuarioValido: function(){
            //Quando usuário é válido, irei atualizar as informações no smartphone.
            if (configuracoesObj.PossuiAcesso){
                Persistencia.gravarDados(TABELAS.CONFIGURACOES, configuracoesObj);
                $('#btnMenuContagemCDE').removeClass('ui-disabled');
                $('#btnMenuValidarAcesso').hide();
                ExibirMensagem('Permissão obtida, funcionalidades de contagem liberada.');
            }else{
                $('#btnMenuValidarAcesso').show();
                ExibirMensagem('Permissão ainda não foi obtida, qualquer dúvida entrar entrar em contato com o administrador do sistema.');
            }
            
            //window.localStorage.setItem(TABELAS.CONFIGURACOES, cdeConfiguracoes);
            
        },/*
        funcaoUsuarioInvalido: function(){
            //Quando usuário é inválido, irei deixar o usuário tentar novamente.
            ExibirMensagem('Usuário/Senha estão inválidos, necessário informar um usuário com acesso no CDE.');
        },*/
        funcaoCancelar: function(){
            console.log("cancelou");
            $('#btnMenuValidarAcesso').show();
            //Quando usuário cancela a opção de usuário.
            ExibirMensagem('Para válidar o acesso é necessário informar sua senha.');
        },
        objetoDadosUsuario: configuracoesObj}
    );
}

/*----------------------------------------------------------------------------
Funções relacionadas a validação de acesso do usuário;
----------------------------------------------------------------------------*/
function FormatarData(dataJson){
    var data = moment(dataJson);
    return data.format('DD/MM/YYYY HH:mm:ss');
}