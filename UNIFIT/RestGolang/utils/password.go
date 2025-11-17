package utils

import (
	"golang.org/x/crypto/bcrypt"
)

// HashPassword hashea una contraseña utilizando bcrypt
func HashPassword(password string) (string, error) {
	// bcrypt.DefaultCost es generalmente suficiente
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}
	return string(hashedPassword), nil
}

// CheckPasswordHash compara una contraseña en texto plano con su hash almacenado
func CheckPasswordHash(password, hash string) bool {
	// Si la comparación es exitosa, err es nil
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}
