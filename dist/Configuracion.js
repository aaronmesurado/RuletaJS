"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Configuracion = /** @class */ (function () {
    function Configuracion(jug, rnd, bt) {
        this.numJugadores = jug;
        this.numRondas = rnd;
        this.bote = bt;
    }
    Configuracion.prototype.getNumJugadores = function () {
        return this.numJugadores;
    };
    Configuracion.prototype.getNumRondas = function () {
        return this.numRondas;
    };
    Configuracion.prototype.getBote = function () {
        return this.bote;
    };
    Configuracion.prototype.pasaRonda = function () {
        this.numRondas++;
    };
    return Configuracion;
}());
exports.Configuracion = Configuracion;
