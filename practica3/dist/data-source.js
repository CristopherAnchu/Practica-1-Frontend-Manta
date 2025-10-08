"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const Usuario_1 = require("./entities/Usuario");
const Rutina_1 = require("./entities/Rutina");
const Reserva_1 = require("./entities/Reserva");
const Rol_1 = require("./entities/Rol");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "sqlite",
    database: "gym_reservas.sqlite",
    synchronize: true,
    logging: false,
    entities: [Usuario_1.Usuario, Rutina_1.Rutina, Reserva_1.Reserva, Rol_1.Rol],
});
