package main

import (
	"log"

	"github.com/CrisF35/RestGolang/db"
	"github.com/CrisF35/RestGolang/models"
	"golang.org/x/crypto/bcrypt"
)

func main_seed_users() {
	database := db.ConnectToDatabase()

	log.Println("Creando usuarios de prueba...")

	// Hash passwords
	ronnyHash, _ := bcrypt.GenerateFromPassword([]byte("ronnypilay"), bcrypt.DefaultCost)
	yeronHash, _ := bcrypt.GenerateFromPassword([]byte("yeronfontabella"), bcrypt.DefaultCost)

	// Helper function to convert string to pointer
	strPtr := func(s string) *string { return &s }

	// Create users
	users := []models.User{
		{
			Nombre:   strPtr("Ronny"),
			Email:    "ronnypilay@gmail.com",
			Password: func() *string { s := string(ronnyHash); return &s }(),
			Tipo:     strPtr("CLIENTE"),
			Rol:      strPtr("CLIENTE"),
		},
		{
			Nombre:   strPtr("Yeron"),
			Email:    "yeronfontabella@gmail.com",
			Password: func() *string { s := string(yeronHash); return &s }(),
			Tipo:     strPtr("ADMINISTRADOR"),
			Rol:      strPtr("ADMINISTRADOR"),
		},
	}

	for _, user := range users {
		if err := database.Create(&user).Error; err != nil {
			log.Printf("Error creando usuario %s: %v", user.Email, err)
		} else {
			log.Printf("Usuario %s creado exitosamente", user.Email)
		}
	}

	log.Println("Usuarios de prueba creados.")
}
