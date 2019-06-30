"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Jugador = /** @class */ (function () {
    function Jugador(nom) {
        this.nombre = nom;
        this.premioRonda = 0;
        this.acumulado = 0;
        this.jugando = false;
    }
    Jugador.prototype.getNombre = function () {
        return this.nombre;
    };
    Jugador.prototype.getPremioRonda = function () {
        return this.premioRonda;
    };
    Jugador.prototype.getAcumulado = function () {
        return this.acumulado;
    };
    Jugador.prototype.getJugando = function () {
        return this.jugando;
    };
    Jugador.prototype.activaDesactiva = function () {
        if (this.jugando) {
            this.jugando = false;
        }
        else {
            this.jugando = true;
        }
    };
    Jugador.prototype.desactivar = function () {
        this.jugando = false;
    };
    return Jugador;
}());
exports.Jugador = Jugador;
