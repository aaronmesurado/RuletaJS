"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var $ = require("jquery");
var int;
$(document).ready(inicio);
function inicio() {
    int = self.setInterval("recargar()", 1000);
    obtenerConfiguracion();
    obtenerJugadores();
    obtenerPaneles();
}
function recargar() {
    int.stopInterval();
    location.reload(true);
}
function obtenerConfiguracion() {
    $.ajax({
        url: "db/obtenerConfiguracion.php",
        dataType: "json",
        async: false,
        type: "GET",
        success: function (config) {
            alert("Configuración Cargada");
            sessionStorage.setItem('configuracion', JSON.stringify(config));
            //conf = JSON.parse(sessionStorage.getItem("configuracion"));
        }, error: function () {
            alert("Error al Obtener la Configuración");
        }
    });
}
function obtenerJugadores() {
    $.ajax({
        url: "db/obtenerJugadores.php",
        dataType: "json",
        async: false,
        type: "GET",
        success: function (jugadores) {
            alert("Jugadores Cargados");
            sessionStorage.setItem('jugadores', JSON.stringify(jugadores));
            //jug = JSON.parse(sessionStorage.getItem("jugadores"));
        }, error: function () {
            alert("Error al Obtener los Jugadores");
        }
    });
}
function obtenerPaneles() {
    $.ajax({
        url: "db/obtenerPaneles.php",
        dataType: "json",
        async: false,
        type: "GET",
        success: function (paneles) {
            alert("Paneles Cargados");
            sessionStorage.setItem('paneles', JSON.stringify(paneles));
            //pnls = JSON.parse(sessionStorage.getItem("paneles"));
        }, error: function () {
            alert("Error al Obtener los Paneles");
        }
    });
}
