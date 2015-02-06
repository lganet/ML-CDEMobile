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

    }
};

/*
    Declaro aqui para poder "MOCAR" e funcionar no browser qndo preciso testar.
    Os dados ser�o re-escritos com os valores pelo evento: deviceready.
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
            //Quando usu�rio � v�lido, irei gravas as informa��es no smartphone.
            console.log(JSON.stringify(cdeConfiguracoesObj));
            //window.localStorage.setItem(TABELAS.CONFIGURACOES, cdeConfiguracoes);
            ExibirMensagem('Configura��es salvo com sucesso.');
        },
        funcaoUsuarioInvalido: function(){
            //Quando usu�rio � inv�lido, irei deixar o usu�rio tentar novamente.
            ExibirMensagem('Usu�rio/Senha est�o inv�lidos, necess�rio informar um usu�rio com acesso no CDE.');
        },
        funcaoCancelar: function(){
            console.log("cancelou");
            //Quando usu�rio cancela a op��o de usu�rio.
            ExibirMensagem('Para gravar ou atualizar as informa��es � necess�rio que o usu�rio informado tenha acesso ao CDE.');
        },
        objetoDadosUsuario: cdeConfiguracoesObj}
    );
}

/*----------------------------------------------------------------------------
Fun��es relacionadas ao login do usu�rio
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
            '� necess�rio estar conectado a uma rede Wifi conectada com a rede do Magazine Luiza.<br/><b>N�o foi poss�vel concluir a a��o.</b>');
        return false;
    }
    */

    $("#divLogin").on("popupafteropen", function( event, ui ) {
        if (opcoes.usuario !== undefined && opcoes.usuario !== ''){
            $('#divLoginUsuario').val(opcoes.usuario);
            $('#divLoginUsuario').textinput('disable');
        }else{
            $('#divLoginUsuario').val('');
            $('#divLoginUsuario').textinput('enable');
        }

        $('#divLogin').trigger('create');
    });

    $("#divLogin").on("popupafterclose", function(){
        $('#page1').trigger('create');
        if (funcaoExecutar)
            funcaoExecutar();
    });

    //Verifica se o aparelho est� conectado Via WIFI
    
    $("#divLogin").popup( "open", {positionTo: "window"});
    
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
        funcaoExecutar = FazerLogin({usuario: $('#divLoginUsuario').val(), senha: $('#divLoginSenha').val(), funcaoUsuarioValido: opcoes.funcaoUsuarioValido, funcaoUsuarioInvalido: opcoes.funcaoUsuarioInvalido, objetoDadosUsuario: opcoes.objetoDadosUsuario});
    });
}

/*
Chama API respons�vel pela valida��o do usu�rio.
Parametros:
    usuario
    senha
    funcaoUsuarioValido
    funcaoUsuarioInvalido
    objetoDadosUsuario
*/
function FazerLogin(opcoes) {

    var urlLogin = MontarUrlServicoCDE("Login",  ['DeviceId=' + informacoesAparelho.NumeroSerie, 'Login=' + opcoes.usuario, 'Senha=' + opcoes.senha]);

    $.ajax({
        url: urlLogin,
        dataType: "json",
        type: 'GET',
        statusCode: {
            // 200 e 201 n�o vou validar pois o mesmo ir� cair no sucesso.
            401: function(response) {
                if (response &&  response.responseJSON && response.responseJSON.Message){
                    ExibirMensagem(JSON.parse(response.responseJSON.Message).Mensagem);
                }
                if (opcoes.funcaoUsuarioInvalido)
                    opcoes.funcaoUsuarioInvalido();
            },
            400: function(response) {
                if (response &&  response.responseJSON && response.responseJSON.Message){
                    ExibirMensagem(JSON.parse(response.responseJSON.Message).Mensagem);
                }
                if (opcoes.funcaoUsuarioInvalido)
                    opcoes.funcaoUsuarioInvalido();  
            },
            404: function() {
               ExibirMensagem('Verifique o servidor de API do CDE.<br/> A mesma se encontra inacess�vel: ' + urlLogin); 
            },
            500: function(response) {
                if (opcoes.funcaoUsuarioInvalido)
                    opcoes.funcaoUsuarioInvalido();  
            }

        }, 
        success : function(dataResult){               
            var data;

            if (dataResult !== undefined){
                data = dataResult.ObjDados;
            }

            if (opcoes.objetoDadosUsuario !== undefined && data !== undefined){
                opcoes.objetoDadosUsuario.PossuiCadastro = data.PossuiCadastro;
                opcoes.objetoDadosUsuario.PossuiAcesso = data.PossuiAcesso;
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
        fail : function(){
            alert('Fail');
        }
    }).fail(function(jqXHR, textStatus, errorThrown){
        alert('ops');
    });
}

/*----------------------------------------------------------------------------
Fun��es relacionadas ao login do usu�rio
----------------------------------------------------------------------------*/

/*----------------------------------------------------------------------------
Fun��es para trabalho de persist�ncia permanente
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

        return dados;
    } 
};

/*----------------------------------------------------------------------------
Fun��es para trabalho de persist�ncia permanente
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

    $("#divLogin").on("popupafterclose", function(){
        if (funcaoExecutar)
            funcaoExecutar();
    });


    $("#divAlert #divAlertMessage").html(mensagem);
    $("#divAlert").popup( "open" );
    $("#divAlertBtnCloseMessage").click(function (e){
        if (funcaoClose)
            funcaoExecutar = funcaoClose;
        $("#divAlert").popup( "close" );
    });
}

// Coloca try cath na fun��es e chama o console log com o erro, caso ocorra.
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

function AbrirView(visao, conteudo) {
    
    ExecutarFuncao(function () {
        var conteudoMudar = (conteudo == undefined ? CONTEUDO.CORPO.idJQ : conteudo.idJQ);
        //$(conteudoMudar).html('');

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
        });
    });
}

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