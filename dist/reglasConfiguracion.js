"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var $ = require("jquery");
$(document).ready(inicio);
function inicio() {
    $("#numJugadores").change(cambiarJugadores);
    $("#guardarConfiguracion").click(function (event) {
        guardarConfiguracion(event);
    });
    $("#insertarPregunta").click(function (event) {
        insertarPregunta(event);
    });
}
function borrar() {
    $('#jugadores').empty();
}
function cambiarJugadores() {
    var numJugadores = $("#numJugadores").val();
    borrar();
    for (var i = 1; i <= numJugadores; i++) {
        $("#jugadores").append("<input type='text' id='jugador" + i + "' placeholder='Jugador" + i + "'>");
    }
}
function guardarConfiguracion(event) {
    event.preventDefault();
    var numJugadores = $("#numJugadores").val();
    var nombreJugadores = new Array();
    for (var i = 1; i <= numJugadores; i++) {
        var nombre = $("#jugador" + i).val();
        nombreJugadores.push(nombre);
    }
    var numRondas = $("#numRondas").val();
    var boteFinal = $("#boteFinal").val();
    if (numJugadores + "" == "" || numRondas + "" == "" || boteFinal + "" == "") {
        alert("Los");
    }
    else {
        $.ajax({
            url: "db/nuevaConfiguracion.php",
            data: { numJug: numJugadores, numRnd: numRondas, bote: boteFinal, jugadores: nombreJugadores },
            dataType: "json",
            async: true,
            type: "GET",
            success: function () {
                alert("Insertado Correctamente");
                document.forms[0].reset();
            }, error: function () {
                alert("Error al Insertar");
            }
        });
    }
}
function insertarPregunta(event) {
    event.preventDefault();
    var palabra = $("#palabra").val().trim();
    var pista = $("#pista").val().trim();
    var tipo = $("#tipo").val();
    if (palabra == "" || pista == "") {
        alert("El campo 'Palabra' y el campo 'Pista' deben tener contenido");
    }
    else {
        $.ajax({
            url: "db/insertarPregunta.php",
            data: { palabra: palabra, pista: pista, tipo: tipo },
            dataType: "json",
            async: true,
            type: "GET",
            success: function () {
                alert("Insertado Correctamente");
                document.forms[0].reset();
            }, error: function () {
                alert("Error al Insertar");
            }
        });
    }
}
