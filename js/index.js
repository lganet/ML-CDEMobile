var countAjaxLoading = 0; // Contador e controle para as submissões ajax.


function scanMoc(funcaoSucessoLeitura, funcaoErro) {
    console.log('scanning');

    var codigo = prompt("Informe o código de Barras", "2028266519768");
    
    if (codigo){
      if (funcaoSucessoLeitura)
        funcaoSucessoLeitura({text: codigo, format:'ean13', cancelled: false});
    }else{
      funcaoSucessoLeitura({text: '', format:'ean13', cancelled: true});
    }

}


function scan(funcaoSucessoLeitura, funcaoErro) {
    console.log('scanning');

    try {
        var scanner = cordova.require("cordova/plugin/BarcodeScanner");

        scanner.scan(function (result) {

            //$("#txtCodigoLido").val(result.text);
            //ProcurarProduto(result.text);

            console.log("Scanner result: \n" +
                 "text: " + result.text + "\n" +
                 "format: " + result.format + "\n" +
                 "cancelled: " + result.cancelled + "\n");

            console.log(result);

            if (funcaoSucessoLeitura)
              funcaoSucessoLeitura(result);

            /*
            if (args.format == "QR_CODE") {
                window.plugins.childBrowser.showWebPage(args.text, { showLocationBar: false });
            }
            */

        }, function (error) {
            console.log("Scanning failed: ", error);
            if (funcaoErro)
              funcaoErro(error);
        });
    }
    catch (err) {
      console.log(err.message);
      if (funcaoErro)
        funcaoErro(err.message);
    }
}

function encode() {
    var scanner = cordova.require("cordova/plugin/BarcodeScanner");

    scanner.encode(scanner.Encode.TEXT_TYPE, "http://www.nhl.com", function (success) {
        alert("encode success: " + success);
    }, function (fail) {
        alert("encoding failed: " + fail);
    }
    );

}

function takePicture() {
    navigator.camera.getPicture(function (imageData) {
        var image = document.getElementById('picTeste');
        image.src = "data:image/jpeg;base64," + imageData;

    }, function (message) {
        alert('Failed because: ' + message);
    },
    {
        quality: 50,
        destinationType: Camera.DestinationType.DATA_URL
    });
}

function SqlLitePRAGMA() {
    try{
          var db = window.sqlitePlugin.openDatabase({name: "my.db"});

          db.transaction(function(tx) {
            tx.executeSql('DROP TABLE IF EXISTS test_table');
            tx.executeSql('CREATE TABLE IF NOT EXISTS test_table (id integer primary key, data text, data_num integer)');

            // demonstrate PRAGMA:
            db.executeSql("pragma table_info (test_table);", [], function(res) {
              console.log("PRAGMA res: " + JSON.stringify(res));
            });

            tx.executeSql("INSERT INTO test_table (data, data_num) VALUES (?,?)", ["test", 100], function(tx, res) {
              console.log("insertId: " + res.insertId + " -- probably 1");
              console.log("rowsAffected: " + res.rowsAffected + " -- should be 1");

              db.transaction(function(tx) {
                tx.executeSql("select count(id) as cnt from test_table;", [], function(tx, res) {
                  console.log("res.rows.length: " + res.rows.length + " -- should be 1");
                  console.log("res.rows.item(0).cnt: " + res.rows.item(0).cnt + " -- should be 1");
                });
              });

            }, function(e) {
              console.log("ERROR: " + e.message);
            });
          });
        }    
        catch(err) {
            console.log(err);
        }
}

// Cordova is ready
function SqlTeste2() {
    try{
          var db = window.sqlitePlugin.openDatabase("Database", "1.0", "Demo", -1);

          db.transaction(function(tx) {
            tx.executeSql('DROP TABLE IF EXISTS test_table');
            tx.executeSql('CREATE TABLE IF NOT EXISTS test_table (id integer primary key, data text, data_num integer)');

            tx.executeSql("INSERT INTO test_table (data, data_num) VALUES (?,?)", ["test", 100], function(tx, res) {
              console.log("insertId: " + res.insertId + " -- probably 1");
              console.log("rowsAffected: " + res.rowsAffected + " -- should be 1");

              tx.executeSql("select count(id) as cnt from test_table;", [], function(tx, res) {
                console.log("res.rows.length: " + res.rows.length + " -- should be 1");
                console.log("res.rows.item(0).cnt: " + res.rows.item(0).cnt + " -- should be 1");
              });

            }, function(e) {
              console.log("ERROR: " + e.message);
            });
          });
      }    
    catch(err) {
        console.log(err);
    }
}

function PesquisarProduto() {
    ProcurarProduto($('#txtCodigoLido').val());
}

function ProcurarProduto(codigoBarra) {

    var parametro = {};

    parametro.codigoBarra = codigoBarra;

    $.getJSON(CONFIGURACOES.URLServico + "Produto", parametro, function (data) {
        if (data) {
            $("#txtDescricaoProduto").val(data.Produto.Descricao + ' ' + data.Cor.Descricao + ' ' + data.Especificacao.Descricao);
        } else {
            alert("Produto não encontrado.");
        }

    }).fail(function (xhr, ajaxOptions, thrownError) {
        alert(xhr.responseText);
    }).error(function(msg) {
        alert(msg);
    });

}

$(document).on("deviceready", function(){
    /* Adicionando chamada aos atalhos */

/*  ExecutarFuncao(function(){
    var model = device.model;
    console.log(model);
  }, "Modelo33333:");*/
  
});

$(document).on("pageinit", "#page1", function (event) {
  Inicializar();    
  PNotify.prototype.options.styling = "jqueryui";
  //ExcluirTodasTabelas();
});

function ExcluirTodasTabelas(){
  Persistencia.removerDados(TABELAS.CONFIGURACOES);
  Persistencia.removerDados(TABELAS.CONTAGEM_CDE);
  Persistencia.removerDados(TABELAS.CONTAGEM_CDE_CONFIGURACAO);
}

function Inicializar(){
  $(document).on("ajaxSend", function () {
    //if (countAjaxLoading === 0)
      ExibirLoading('a', 'Carregando...');
    countAjaxLoading++;
  }).on("ajaxComplete", function () {
    //if (countAjaxLoading <= 1)
      EsconderLoading();
    countAjaxLoading--;
  }).on("ajaxError", function () {
    EsconderLoading();
    countAjaxLoading = 0;
  });

  $("#btnMenuConfiguracao").on("click", function () { ChamarConfiguracaoes(); });
  $("#btnMenuContagemCDE").on("click", function () { IniciarContagemCDE(); });
  $("#btnHome").on("click", function () { AbrirPrincipal(); });
  $('#btnMenuValidarAcesso').on("click", function() { ValidarLiberacao() });
  $('#btnRedefinir').on("click", function() { RedefinirInformacoes() });
  AbrirPrincipal();
}

function RedefinirInformacoes(){
  if(confirm('Gostaria de reinicar as configurações do sistema.\nCaso continue todas as informações serão apagadas.')){
    ExcluirTodasTabelas();
    app.jaValidouAcessoNoInicio = false;
    AbrirPrincipal();
  }
}

function ValidarBotoes(){
  // Validando se já foi preenchido as configurações e se a mesma está ok.
}

function AbrirPrincipal() {
  AbrirView(VISOES.PRINCIPAL);
}

function ChamarConfiguracaoes() {
  AbrirView(VISOES.CONFIGURACAO);
}

function IniciarContagemCDE(){
  AbrirView(VISOES.INICIO_CONTAGEM); 
}

//function AbrirMenu(e) {
//    e.preventDefault();
//    console.log("abrir menu");
//    $("#panelMenu").panel("open");
    

//}

//$(document).on("pageinit", "#page1", function (event) {


//    $("#panelMenu").on("panelopen", function (event, ui) {
//        console.log("i am open");
//        $('body').css("overflow", "hidden").on("touchmove", stopScroll);
//    });

//    $("#panelMenu").on("panelclose", function (event, ui) {
//        console.log("i am clse");
//        $('body').css("overflow", "auto").off("touchmove");
//    });

//    function stopScroll() {
//        return false;
//    }

//});

