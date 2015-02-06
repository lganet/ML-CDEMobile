function scan() {
    console.log('scanning');

    try {
        var scanner = cordova.require("cordova/plugin/BarcodeScanner");

        scanner.scan(function (result) {

            navigator.vibrate([1000, 1000, 3000, 1000, 5000]);

            //alert("We got a barcode\n" + 
            //    "Result: " + result.text + "\n" + 
            //    "Format: " + result.format + "\n" + 
            //    "Cancelled: " + result.cancelled);  

            $("#txtCodigoLido").val(result.text);
            ProcurarProduto(result.text);

            console.log("Scanner result: \n" +
                 "text: " + result.text + "\n" +
                 "format: " + result.format + "\n" +
                 "cancelled: " + result.cancelled + "\n");

            console.log(result);
            /*
            if (args.format == "QR_CODE") {
                window.plugins.childBrowser.showWebPage(args.text, { showLocationBar: false });
            }
            */

        }, function (error) {
            console.log("Scanning failed: ", error);
        });
    }
    catch (err) {
        console.log(err);
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
    
  $(document).bind("ajaxSend", function () {
    ExibirLoading('a', 'Carregando...');
      
  }).bind("ajaxComplete", function () {
    EsconderLoading();
  }).bind("ajaxError", function (data) {
    EsconderLoading();
  });


  $("#btnConfiguracao").on("click", function () { ChamarConfiguracaoes(); });
  $("#btnHome").on("click", function () { AbrirPrincipal(); });
  AbrirPrincipal();
});


function AbrirPrincipal() {
  AbrirView(VISOES.PRINCIPAL);
}

function ChamarConfiguracaoes() {
    AbrirView(VISOES.CONFIGURACAO);
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

