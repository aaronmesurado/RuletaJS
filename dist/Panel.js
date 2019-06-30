"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Panel = /** @class */ (function () {
    function Panel(plb, pst, tp) {
        this.palabra = plb;
        this.tipo = tp;
        this.pista = pst;
    }
    Panel.prototype.getPalabra = function () {
        return this.palabra;
    };
    Panel.prototype.getPista = function () {
        return this.pista;
    };
    Panel.prototype.getTipo = function () {
        return this.tipo;
    };
    return Panel;
}());
exports.Panel = Panel;
