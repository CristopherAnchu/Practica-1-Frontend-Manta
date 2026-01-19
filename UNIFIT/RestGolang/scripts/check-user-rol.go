package main

import (
	"fmt"
	"log"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type User struct {
	ID    string  `gorm:"column:id;type:uuid;primaryKey"`
	Email string  `gorm:"unique;not null"`
	Rol   *string `gorm:"column:rol"`
}

func main_user_rol() {
	dsn := "postgres://neondb_owner:npg_ePlbRr4NvMh8@ep-blue-lab-adyjs4fj-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("Error conectando a la base de datos: %v", err)
	}

	var users []User
	result := db.Table("users").Select("id", "email", "rol").Where("deleted_at IS NULL").Find(&users)
	if result.Error != nil {
		log.Fatalf("Error consultando usuarios: %v", result.Error)
	}

	fmt.Println("\n========== USUARIOS EN LA BASE DE DATOS ==========")
	for _, user := range users {
		rolValue := "NULL"
		if user.Rol != nil {
			rolValue = *user.Rol
		}
		fmt.Printf("\nID:    %s\nEmail: %s\nRol:   %s\n", user.ID, user.Email, rolValue)
		fmt.Println("---------------------------------------------------")
	}
	fmt.Printf("\nTotal de usuarios: %d\n\n", len(users))
}
