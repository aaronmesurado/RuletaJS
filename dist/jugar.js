"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var $ = require("jquery");
var Configuracion_1 = require("./Configuracion");
var Jugador_1 = require("./Jugador");
var Panel_1 = require("./Panel");
/* Declaracion de los tipos de las variables */
var letra;
tamSeccion: Number;
tablero: HTMLElement;
var panelEnJuego;
var rondas;
var objConfiguracion;
var objJugadores = Array();
var objPaneles = Array();
var intervaloVelocidad;
var nombreJugadorGana;
var posicionJugador;
/* Comienzo de la funcionalidad */
var letrasUsadas = new Array();
/* Obtener datos de la Configuracion */
var strConf = sessionStorage.getItem("configuracion");
var conf = JSON.parse(strConf);
/* Obtener datos de los Jugadores */
var strJug = sessionStorage.getItem("jugadores");
var jugadores = JSON.parse(strJug);
/* Obtener datos de los Paneles */
var strPnl = sessionStorage.getItem("paneles");
var paneles = JSON.parse(strPnl);
$(document).ready(inicio);
function inicio() {
    aObjetos();
    camposJugadores();
    crearTablero();
    //Obligo a que la primera partida sea de tipo VELOCIDAD
    do {
        var random = genRandom(0, objPaneles.length);
    } while (objPaneles[random].tipo != "velocidad");
    var panel = objPaneles[random];
    panelEnJuego = panel;
    //Elimino el panel del array para evitar que se repita en futuras rondas
    objPaneles.splice(random, 1);
    rondas = 1;
    $("#numRondas").text("Ronda " + rondas);
    pruebaVelocidad(panel);
}
function genRandom(min, max) {
    var num;
    num = Math.floor(Math.random() * (max - min)) + min;
    return num;
}
function aObjetos() {
    objConfiguracion = new Configuracion_1.Configuracion(conf[0].jugadores, conf[0].rondas, conf[0].bote);
    for (var i = 0; i < jugadores.length; i++) {
        objJugadores[i] = new Jugador_1.Jugador(jugadores[i].nombre);
    }
    for (var i = 0; i < paneles.length; i++) {
        objPaneles[i] = new Panel_1.Panel(paneles[i].respuesta, paneles[i].pista, paneles[i].tipo);
    }
}
function pruebaVelocidad(panel) {
    $('#accionesUsuario').css('display', 'none');
    $('#girarRuleta').attr("disabled", "true");
    crearPanel(panel);
    for (var i = 0; i < objJugadores.length; i++) {
        $("#pulsadorJugador" + (i + 1)).css('display', 'block');
        $("#pulsadorJugador" + (i + 1)).click(responder);
    }
    intervaloVelocidad = setInterval(muestraLetra, 2000);
}
function responder() {
    var id = this.id;
    var jug = parseInt(id.split("pulsadorJugador")[1]) - 1;
    var respuesta = prompt("Escribe tu respuesta: ", "");
    if (respuesta == null) {
        respuesta = "";
    }
    if (respuesta.toLowerCase() == panelEnJuego.palabra.toLowerCase()) {
        var totalRonda = 0;
        if (panelEnJuego.getTipo() == "velocidad") {
            totalRonda = 100;
        }
        else if (panelEnJuego.getTipo() == "bote") {
            totalRonda = parseInt("" + objJugadores[jug].getPremioRonda());
            totalRonda = totalRonda + parseInt("" + objConfiguracion.getBote());
        }
        else {
            totalRonda = parseInt("" + objJugadores[jug].getPremioRonda());
        }
        objJugadores[jug].acumulado = parseInt("" + objJugadores[jug].getAcumulado()) + totalRonda;
        clearInterval(intervaloVelocidad);
        for (var i = 0; i < objJugadores.length; i++) {
            $("#pulsadorJugador" + (i + 1)).css('display', 'none');
        }
        alert("Has acertado " + objJugadores[jug].getNombre());
        nombreJugadorGana = objJugadores[jug].getNombre();
        siguiente();
    }
    else {
        if (panelEnJuego.getTipo() != "velocidad") {
            pasarTurno();
        }
    }
}
function pasarTurno() {
    letra = "";
    $('#valorRuleta').text("");
    $('#girarRuleta').removeAttr('disabled');
    $('#jugador' + (posicionJugador + 1)).removeClass("jugadorActivo");
    $("#pulsadorJugador" + (posicionJugador + 1)).css('display', 'none');
    $("#pulsadorJugador" + (posicionJugador + 1)).off('click');
    posicionJugador++;
    if (posicionJugador == objJugadores.length) {
        posicionJugador = 0;
    }
    $('#jugador' + (posicionJugador + 1)).addClass("jugadorActivo");
    $("#pulsadorJugador" + (posicionJugador + 1)).css('display', 'block');
    $("#pulsadorJugador" + (posicionJugador + 1)).click(responder);
}
function muestraLetra() {
    var tds = $('.conLetra');
    if (tds.length != 0) {
        var random = genRandom(0, tds.length);
        var valor = tds[random].value;
        tds[random].innerText = valor.toUpperCase();
        tds[random].className = "cambiado";
    }
    else {
        clearInterval(intervaloVelocidad);
    }
}
function crearPanel(panel) {
    var palabra = panel.palabra;
    var tds = $('td');
    var captionElement = document.createElement('caption');
    for (var i = 0; i < palabra.length; i++) {
        if (palabra[i] != " ") {
            tds[i].value = palabra[i];
            tds[i].className = "conLetra";
        }
    }
    captionElement.innerText = panel.pista;
    $("table").append(captionElement);
}
function crearTablero() {
    var tablero = $('#panelLetras');
    tablero.empty();
    var divPanel = "<div id='panel' class='col-12'></div>";
    tablero.append(divPanel);
    var tableElement = document.createElement('table');
    for (var i = 0; i < 4; i++) {
        var trElement = document.createElement('tr');
        for (var j = 0; j < 12; j++) {
            var tdElement = document.createElement('td');
            tdElement.className = "sinLetra";
            trElement.append(tdElement);
        }
        tableElement.append(trElement);
    }
    $('#panel').append(tableElement);
}
function camposJugadores() {
    /* Declaracion de los tipos */
    i: Number;
    anadir: String;
    $('#jugadores').empty();
    var tamSeccion = 12 / jugadores.length;
    var anadir = "";
    for (var i = 0; i < jugadores.length; i++) {
        anadir = "<div id='jugador" + (i + 1) + "'class='jugador col-" + tamSeccion + "'></div>";
        $('#jugadores').append(anadir);
        $('#jugador' + (i + 1)).html("<h4>" + objJugadores[i].getNombre() + "</h4>");
        $('#jugador' + (i + 1)).append("<h5 id='rondaJugador" + (i + 1) + "'>" + objJugadores[i].getPremioRonda() + "</h5>");
        $('#jugador' + (i + 1)).append("<h5 id='boteJugador" + (i + 1) + "'>Ganado: " + objJugadores[i].getAcumulado() + "</h5>");
        $('#jugador' + (i + 1)).append("<input type='button' name='resolver' id='pulsadorJugador" + (i + 1) + "' class='btn btn-light' value='Responder' style='display: none;'>");
    }
}
function comun() {
    var consonante = $('#letra').val();
    $('#letra').val("");
    consonante = consonante.trim();
    if (consonante.length > 1) {
        consonante = consonante[0];
    }
    var comprobar = parseInt(consonante);
    if (comprobar < 0 || comprobar >= 0) {
        return "Es un NUMERO";
    }
    else {
        return consonante;
    }
}
function consonante() {
    if ($("#valorRuleta").text() != "") {
        if (letra == "" || letra == null) {
            letra = comun();
        }
        else {
            if ($("#valorRuleta").text() != "" && (letra == "" || letra == null)) {
                letra = comun();
            }
            else {
                alert("La letra usada será la '" + letra.toUpperCase() + "'");
            }
            $('#letra').val("");
        }
        if (letra.length > 1) {
            alert(letra);
        }
        else if (letra.length == 0) {
            alert("Tienes que escribir algo");
        }
        else {
            letra = letra.toLowerCase();
            if (letra == 'a' || letra == 'e' || letra == 'i' || letra == 'o' || letra == 'u') {
                alert("Has selecionado 'Consonante' y es una Vocal");
                letra = "";
                if ($("#valorRuleta").text() == "Quiebra") {
                    alert("Quiebras");
                    objJugadores[posicionJugador].premioRonda = 0;
                    $("#rondaJugador" + (posicionJugador + 1)).text("");
                    $("#rondaJugador" + (posicionJugador + 1)).text(objJugadores[posicionJugador].getPremioRonda());
                    pasarTurno();
                }
                else if ($("#valorRuleta").text() == "Pierde Turno") {
                    alert("Pierdes el turno");
                    pasarTurno();
                }
            }
            else {
                if ($("#valorRuleta").text() == "Quiebra") {
                    alert("Quiebras");
                    objJugadores[posicionJugador].premioRonda = 0;
                    $("#rondaJugador" + (posicionJugador + 1)).text("");
                    $("#rondaJugador" + (posicionJugador + 1)).text(objJugadores[posicionJugador].getPremioRonda());
                    pasarTurno();
                }
                else if ($("#valorRuleta").text() == "Pierde Turno") {
                    alert("Pierdes el turno");
                    pasarTurno();
                }
                else if (letrasUsadas.indexOf(letra) == -1) {
                    usadas(letra);
                    if (panelEnJuego.getPalabra().toLowerCase().indexOf(letra) != -1) {
                        comprobar(letra);
                        $("#valorRuleta").text("");
                        $('#girarRuleta').removeAttr('disabled');
                        letra = "";
                    }
                    else {
                        pasarTurno();
                    }
                }
                else {
                    alert("Letra ya usada");
                    pasarTurno();
                }
            }
        }
    }
    else {
        letra = comun();
        alert("Tienes que girar la ruleta");
        if (letra == 'a' || letra == 'e' || letra == 'i' || letra == 'o' || letra == 'u') {
            letra = "";
        }
    }
}
function comprobar(letra) {
    var posiciones = new Array();
    var pal = panelEnJuego.getPalabra().toLowerCase();
    var conjunto = pal.split(" ");
    var frase = "";
    for (var i = 0; i < conjunto.length; i++) {
        frase += conjunto[i];
    }
    var valor = $("#valorRuleta").text();
    var cont = 0;
    for (var i = 0; i < frase.length; i++) {
        if (frase[i] == letra) {
            posiciones.push(i);
            cont++;
        }
    }
    var tds = $('.conLetra');
    if (letra == 'a' || letra == 'e' || letra == 'i' || letra == 'o' || letra == 'u') {
        for (var i = 0; i < posiciones.length; i++) {
            var letraPanel = tds[posiciones[i]].value;
            tds[posiciones[i]].innerText = letraPanel.toUpperCase();
        }
    }
    else {
        if (valor == "x2") {
            for (var i = 0; i < posiciones.length; i++) {
                var letraPanel = tds[posiciones[i]].value;
                tds[posiciones[i]].innerText = letraPanel.toUpperCase();
            }
            objJugadores[posicionJugador].premioRonda = parseInt("" + objJugadores[posicionJugador].getPremioRonda()) * 2;
            $("#rondaJugador" + (posicionJugador + 1)).text("");
            $("#rondaJugador" + (posicionJugador + 1)).text(objJugadores[posicionJugador].getPremioRonda());
        }
        else if (valor == "1/2") {
            for (var i = 0; i < posiciones.length; i++) {
                var letraPanel = tds[posiciones[i]].value;
                tds[posiciones[i]].innerText = letraPanel.toUpperCase();
            }
            objJugadores[posicionJugador].premioRonda = parseInt("" + objJugadores[posicionJugador].getPremioRonda()) / 2;
            $("#rondaJugador" + (posicionJugador + 1)).text("");
            $("#rondaJugador" + (posicionJugador + 1)).text(objJugadores[posicionJugador].getPremioRonda());
        }
        else {
            for (var i = 0; i < posiciones.length; i++) {
                var letraPanel = tds[posiciones[i]].value;
                tds[posiciones[i]].innerText = letraPanel.toUpperCase();
            }
            objJugadores[posicionJugador].premioRonda = parseInt("" + objJugadores[posicionJugador].getPremioRonda()) + (parseInt(valor.split("€")[0]) * cont);
            $("#rondaJugador" + (posicionJugador + 1)).text("");
            $("#rondaJugador" + (posicionJugador + 1)).text(objJugadores[posicionJugador].getPremioRonda());
        }
    }
}
function vocal() {
    letra = comun();
    if ($("#valorRuleta").text() != "") {
        if ($("#valorRuleta").text() == "Quiebra") {
            alert("Quiebras");
            objJugadores[posicionJugador].premioRonda = 0;
            $("#rondaJugador" + (posicionJugador + 1)).text("");
            $("#rondaJugador" + (posicionJugador + 1)).text(objJugadores[posicionJugador].getPremioRonda());
            pasarTurno();
        }
        else if ($("#valorRuleta").text() == "Pierde Turno") {
            alert("Pierdes el turno");
            pasarTurno();
        }
        else {
            alert("Tenías que elegir consonante");
            pasarTurno();
        }
    }
    else {
        if (letra.length > 1) {
            alert(letra);
        }
        else if (letra.length == 0) {
            alert("Tienes que escribir algo");
        }
        else {
            letra = letra.toLowerCase();
            if (letra != 'a' && letra != 'e' && letra != 'i' && letra != 'o' && letra != 'u') {
                alert("Has seleccionado 'Comprar Vocal' y es una consonante");
                pasarTurno();
            }
            else {
                var dinero = parseInt("" + objJugadores[posicionJugador].getPremioRonda());
                if (dinero != 0 && dinero >= 50) {
                    if ($("#valorRuleta").text() != "") {
                        alert("Ha girado la ruleta. Tenía que elegir consonante");
                        $("#valorRuleta").text("");
                        pasarTurno();
                    }
                    else {
                        if (letrasUsadas.indexOf(letra) != -1) {
                            objJugadores[posicionJugador].premioRonda = dinero - 50;
                            $("#rondaJugador" + (posicionJugador + 1)).text("");
                            $("#rondaJugador" + (posicionJugador + 1)).text(objJugadores[posicionJugador].getPremioRonda());
                            alert("Vocal usada");
                            pasarTurno();
                        }
                        else {
                            if (panelEnJuego.getPalabra().toLowerCase().indexOf(letra) != -1) {
                                comprobar(letra);
                                usadas(letra);
                                objJugadores[posicionJugador].premioRonda = dinero - 50;
                                $("#rondaJugador" + (posicionJugador + 1)).text("");
                                $("#rondaJugador" + (posicionJugador + 1)).text(objJugadores[posicionJugador].getPremioRonda());
                                $('#girarRuleta').removeAttr('disabled');
                                letra = "";
                            }
                            else {
                                pasarTurno();
                            }
                        }
                    }
                }
                else {
                    alert("No tienes dinero suficiente");
                    $("#valorRuleta").text("");
                    pasarTurno();
                }
            }
        }
    }
}
function usadas(consonante) {
    letrasUsadas.push(consonante);
    var pElement = document.createElement('p');
    var txt = "";
    for (var i = 0; i < letrasUsadas.length; i++) {
        if (txt.length == 0) {
            txt += letrasUsadas[i].toUpperCase();
        }
        else {
            txt += " - " + letrasUsadas[i].toUpperCase();
        }
    }
    pElement.innerText = txt;
    $('#pie :last-child').remove();
    $('#pie').append(pElement);
}
function siguiente() {
    rondas++;
    $('#consonante').off('click');
    $('#compraVocal').off('click');
    if (rondas <= objConfiguracion.numRondas) {
        $("#numRondas").text("Ronda " + rondas);
        for (var i = 0; i < objJugadores.length; i++) {
            objJugadores[i].premioRonda = 0;
            objJugadores[i].desactivar();
        }
        crearTablero();
        var sigPanel = genRandom(0, objPaneles.length);
        var panel = objPaneles[sigPanel];
        panelEnJuego = panel;
        objPaneles.splice(sigPanel, 1);
        if (panel.tipo == "velocidad") {
            camposJugadores();
            pruebaVelocidad(panel);
        }
        else {
            if (objJugadores.length == 2) {
                var sigJug = genRandom(0, objJugadores.length);
                if (objJugadores[sigJug].getNombre().toLowerCase() == nombreJugadorGana.toLowerCase()) {
                    if (sigJug == 0) {
                        sigJug = 1;
                    }
                    else {
                        sigJug = 0;
                    }
                }
            }
            else {
                do {
                    var sigJug = genRandom(0, objJugadores.length);
                } while (objJugadores[sigJug].getNombre().toLowerCase() == nombreJugadorGana.toLowerCase());
            }
            posicionJugador = sigJug;
            objJugadores[sigJug].activaDesactiva();
            $('#consonante').click(consonante);
            $('#compraVocal').click(vocal);
            camposJugadores();
            pruebaNormal(panel);
        }
    }
    else {
        alert("Fin del Juego");
        sleep(1500);
        auncioGanador();
        location.href = "./index.html";
    }
}
function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds) {
            break;
        }
    }
}
function auncioGanador() {
    camposJugadores();
    var nombre = "";
    var dinero = 0;
    for (var i = 0; i < objJugadores.length; i++) {
        var acumulado = parseInt("" + objJugadores[i].getAcumulado());
        if (acumulado > dinero) {
            dinero = acumulado;
            nombre = objJugadores[i].getNombre();
        }
    }
    var msg = "El ganador es " + nombre + " con un bote acumulado de " + dinero + "€";
    alert(msg);
}
function pruebaNormal(panel) {
    $('#accionesUsuario').css('display', 'block');
    letrasUsadas = new Array();
    if (panel.tipo != "normal") {
        alert("Panel con Bote.\nA lo acumulado en la ronda, añadiremos " + objConfiguracion.getBote());
    }
    $('#girarRuleta').removeAttr('disabled');
    $('#jugador' + (posicionJugador + 1)).addClass("jugadorActivo");
    $('#pulsadorJugador' + (posicionJugador + 1)).css('display', 'block');
    $("#pulsadorJugador" + (posicionJugador + 1)).click(responder);
    crearPanel(panel);
}
