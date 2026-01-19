package main

import (
	"log"

	"github.com/CrisF35/RestGolang/db"
	"github.com/CrisF35/RestGolang/models"
)

func main_drop_tables() {
	database := db.ConnectToDatabase()

	log.Println("Eliminando tablas antiguas...")

	// Drop all tables in reverse order (to avoid foreign key constraints)
	database.Migrator().DropTable(&models.Asistencia{})
	database.Migrator().DropTable(&models.Incidencia{})
	database.Migrator().DropTable(&models.RutinaUsuario{})
	database.Migrator().DropTable(&models.Reserva{})
	database.Migrator().DropTable(&models.Equipo{})
	database.Migrator().DropTable(&models.User{})

	log.Println("Tablas eliminadas exitosamente.")
	log.Println("Ahora ejecuta 'go run main.go' para recrear las tablas con la estructura correcta.")
}
