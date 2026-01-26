package db

import (
	"log"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var (
	dsn = "postgresql://neondb_owner:npg_ePlbRr4NvMh8@ep-blue-lab-adyjs4fj-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
	DB  *gorm.DB
)

// Conecta a la base de datos UNA sola vez.
// Retorna *gorm.DB
func ConnectToDatabase() *gorm.DB {

	// Si ya está conectada, devuelve la instancia existente
	if DB != nil {
		return DB
	}

	// Si no está conectada, abrir conexión
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Error connecting to database:", err)
	}

	log.Println("Connected to the database successfully")

	DB = db
	return DB
}
