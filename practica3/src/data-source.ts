import "reflect-metadata";
import { DataSource } from "typeorm";
import { Usuario } from "./entities/Usuario";
import { Rutina } from "./entities/Rutina";
import { Reserva } from "./entities/Reserva";
import { Rol } from "./entities/Rol";

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: "gym_reservas.sqlite",
  synchronize: true,
  logging: false,
  entities: [Usuario, Rutina, Reserva, Rol],
});