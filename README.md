# Sistema de Reservas del Gimnasio Universitario

Este proyecto implementa la persistencia del dominio y la lógica de acceso a datos para un sistema de reservas de gimnasio universitario usando *Node.js, **TypeScript* y *TypeORM* puro (sin frameworks como NestJS).

## Tabla de Contenidos

- [Descripción General](#descripción-general)
- [Modelo de Entidades](#modelo-de-entidades)
- [Relaciones](#relaciones)
- [Instrucciones de Instalación y Ejecución](#instrucciones-de-instalación-y-ejecución)
- [Pruebas de Seeding y CRUD](#pruebas-de-seeding-y-crud)
- [Generación del Diagrama Entidad-Relación (DER)](#generación-del-diagrama-entidad-relación-der)
- [Autores](#autores)

---

## Descripción General

El *Sistema de Reservas del Gimnasio Universitario* permite a los miembros de la comunidad universitaria (estudiantes, docentes y personal administrativo) gestionar sus Rutinaes y reservas dentro del gimnasio del campus de manera fácil y organizada.

---

## Modelo de Entidades

### *Rol*
- Define el tipo de usuario (Estudiante, Docente, Administrativo).
- *Atributos:* id, nombre, descripcion.

### *Usuario*
- Representa a un miembro de la comunidad universitaria.
- *Atributos:* id, nombre, correo, tipo, rolId.
- *Relaciones:* Pertenece a un Rol y tiene muchas Reservas.

### *Rutina*
- Representa una Rutina o clase dentro del gimnasio.
- *Atributos:* id, nombre, descripcion, cupoMaximo.
- *Relaciones:* Tiene muchas Reservas.

### *Reserva*
- Representa la reserva de un usuario para una Rutina.
- *Atributos:* id, fecha, estado, usuarioId, RutinaId.
- *Relaciones:* Pertenece a un Usuario y a una Rutina.

---

## Relaciones

- *Rol (1) --- (N) Usuario*
- *Usuario (1) --- (N) Reserva*
- *Rutina (1) --- (N) Reserva*

---

## Instrucciones de Instalación y Ejecución

1. *Clona el repositorio*  
   bash
   git clone <URL_DEL_REPOSITORIO>
   cd <NOMBRE_DEL_REPOSITORIO>
   

2. *Instala las dependencias*  
   bash
   npm install
   

3. *Configura la base de datos*  
   No es necesaria configuración extra, se usa SQLite por defecto.

4. *Ejecuta el seeding y prueba CRUD*  
   bash
   npx ts-node src/main.ts
   
   > Esto inicializa la base de datos, inserta datos de prueba y ejecuta operaciones CRUD mostrando la salida en consola.

---

## Pruebas de Seeding y CRUD

El script src/main.ts:
- Inicializa la conexión a la base de datos.
- Inserta roles, usuarios, Rutinaes y reservas de ejemplo.
- Realiza operaciones CRUD (crear, leer, actualizar y eliminar) sobre cada entidad.
- Muestra resultados y relaciones en consola.

---

## Generación del Diagrama Entidad-Relación (DER)

Puedes generar el DER con la herramienta [typeorm-uml](https://github.com/eugene-manuilov/typeorm-uml):

bash
npm install -g typeorm-uml
typeorm-uml src/data-source.ts

Esto genera el archivo diagram.svg con el esquema de tu base de datos.

> Alternativamente, exporta el esquema SQL usando TypeORM y utiliza [dbdiagram.io](https://dbdiagram.io) para una visualización personalizada.

---

## Autores

- *Integrante 1:* Jostin Morerira
- *Integrante 2:* Ronny Pilay
- *Integrante 3:* Cristopher Anchundia

---

## Notas

- El proyecto está preparado para ser ejecutado y revisado en demostración presencial.
- No se incluyen controladores ni módulos de frameworks, sólo entidades, servicios y lógica de acceso a datos.