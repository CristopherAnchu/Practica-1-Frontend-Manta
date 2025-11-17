package utils

import (
	"errors"
	"os"
	"time"

	"github.com/dgrijalva/jwt-go"
)

// Clave secreta (¡Usar variable de entorno en producción!)
// Esta clave se obtiene de la variable de entorno JWT_SECRET o usa "supersecretkey" como fallback.
var jwtSecret = []byte(getEnv("JWT_SECRET", "supersecretkey"))

func getEnv(key, fallback string) string {
	if value, ok := os.LookupEnv(key); ok {
		return value
	}
	return fallback
}

// claims es la estructura que contendrá los datos del usuario.
// 🔥 Se ha añadido el campo Rol para la autorización 🔥
type Claims struct {
	UserID string `json:"user_id"` // Usaremos este ID para Gorm
	Rol    string `json:"rol"`     // CRÍTICO: Para la lógica de autorización
	jwt.StandardClaims
}

// GenerateToken crea un nuevo token JWT para el usuario
// 🔥 Ahora acepta el rol del usuario 🔥
func GenerateToken(userID string, rol string) (string, error) {
	expirationTime := time.Now().Add(24 * time.Hour)
	claims := &Claims{
		UserID: userID,
		Rol:    rol, // Se añade el rol al claim
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: expirationTime.Unix(),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(jwtSecret)
}

// ParseToken valida el token y extrae los claims
func ParseToken(tokenString string) (*Claims, error) {
	claims := &Claims{}

	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("unexpected signing method")
		}
		return jwtSecret, nil
	})

	if err != nil {
		return nil, err
	}

	if !token.Valid {
		return nil, errors.New("invalid token")
	}

	// El middleware ahora puede acceder a claims.UserID y claims.Rol
	return claims, nil
}
