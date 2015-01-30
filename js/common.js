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
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};


// Coloca try cath na funções e chama o console log com o erro, caso ocorra.
function ExecutarFuncao(funcao, msgLog) {
    try {
        if (msgLog)
            console.log(msgLog);
        funcao();
    }
    catch (err) {
        console.log(err);
    }
}

function AbrirView(visao, conteudo) {
    
    ExecutarFuncao(function () {
        ExibirLoading();
        var conteudoMudar = (conteudo == undefined ? CONTEUDO.CORPO.idJQ : conteudo.idJQ);
        //$(conteudoMudar).html('');

        $(conteudoMudar).load(visao.pagina, function () {
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

            EsconderLoading();
            $(conteudoMudar).trigger("ViewLoaded", [visao, conteudo]);
            $(conteudoMudar).off("ViewLoaded");
            console.log('00000000000000000000 CHAMOU SUCESSO 0000000000000000000');
        });
    });
}

function ExibirLoading() {
    var $this = $(this),
    theme = $this.jqmData("theme") || $.mobile.loader.prototype.options.theme,
    msgText = $this.jqmData("msgtext") || $.mobile.loader.prototype.options.text,
    textVisible = $this.jqmData("textvisible") || $.mobile.loader.prototype.options.textVisible,
    textonly = !!$this.jqmData("textonly");
    html = $this.jqmData("html") || "";
    $.mobile.loading("show", {
        text: msgText,
        textVisible: textVisible,
        theme: theme,
        textonly: textonly,
        html: html
    });
}

function EsconderLoading() {
    $.mobile.loading("hide");
}