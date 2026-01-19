package middleware

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"strings"

	"github.com/CrisF35/RestGolang/db"
	"github.com/CrisF35/RestGolang/models"
	"github.com/CrisF35/RestGolang/utils"
	"gorm.io/gorm"
)

// =======================================================
// 🔥 NUEVAS ESTRUCTURAS Y FUNCIÓN AUXILIAR (La respuesta a tu pregunta)
// =======================================================

// AuthUser representa la información mínima del usuario autenticado (ID y Rol).
type AuthUser struct {
	ID  string
	Rol string // Ej: "CLIENTE", "ADMINISTRADOR"
}

// ContextUserKey es la clave constante para almacenar AuthUser en el contexto.
type UserContextKey string

const ContextUserKey UserContextKey = "user"

// GetAuthUser extrae la información completa del usuario (ID y Rol) del contexto.
// Esto reemplaza a GetUserIDFromContext.
func GetAuthUser(r *http.Request) (*AuthUser, error) {
	val := r.Context().Value(ContextUserKey)
	if val == nil {
		// La clave no existe (probablemente el middleware no se ejecutó)
		return nil, errors.New("user context missing (not authenticated or middleware bypassed)")
	}

	user, ok := val.(*AuthUser)
	if !ok {
		// Error interno si el valor no es del tipo esperado
		return nil, errors.New("invalid user context data format")
	}

	return user, nil
}

// ⚠️ NOTA: Las estructuras y funciones obsoletas (contextKey, UserIDKey, GetUserIDFromContext)
// han sido eliminadas o reemplazadas por el nuevo enfoque para evitar confusiones y errores.

// =======================================================
// AuthMiddleware (MODIFICADO)
// Ahora consulta el Rol y lo inyecta junto con el ID.
// =======================================================
func AuthMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method == "OPTIONS" {
			next.ServeHTTP(w, r)
			return
		}

		authHeader := r.Header.Get("Authorization")
		if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
			w.WriteHeader(http.StatusUnauthorized)
			fmt.Fprint(w, `{"error": "Authorization header missing or invalid format"}`)
			return
		}

		tokenString := strings.Split(authHeader, " ")[1]

		// 1. Decodificar y Validar el token
		claims, err := utils.ParseToken(tokenString)
		if err != nil {
			w.WriteHeader(http.StatusUnauthorized)
			fmt.Fprint(w, `{"error": "Invalid or expired token: `+err.Error()+`"}`)
			return
		}

		userID := claims.UserID

		// 🔥 2. Buscar el usuario en la base de datos para obtener su ROL
		var user models.User
		result := db.DB.Select("rol").First(&user, "id = ?", userID)

		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			w.WriteHeader(http.StatusUnauthorized)
			json.NewEncoder(w).Encode(map[string]string{"error": "User associated with token not found."})
			return
		}
		if result.Error != nil {
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(map[string]string{"error": "Database error during role fetch in middleware."})
			return
		}

		// 3. Crear el struct AuthUser
		authUser := &AuthUser{
			ID:  userID,
			Rol: *user.Rol, // Asumimos que Rol no es nil
		}

		// 🔥 4. Inyectar el AuthUser completo en el contexto
		ctx := context.WithValue(r.Context(), ContextUserKey, authUser)

		next.ServeHTTP(w, r.WithContext(ctx))
	}
}

// =======================================================
// CheckAdminRole (MODIFICADO)
// Ahora usa GetAuthUser y ELIMINA la consulta a la DB.
// =======================================================
func CheckAdminRole(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")

		// 1. Obtener el AuthUser del contexto (que ya contiene el Rol)
		authUser, err := GetAuthUser(r)
		if err != nil {
			// Esto manejará la falta de autenticación
			w.WriteHeader(http.StatusUnauthorized)
			json.NewEncoder(w).Encode(map[string]string{"error": "Authorization Failed: Token not processed or user ID missing."})
			return
		}

		// 🔥 2. Verificar el rol de forma inmediata (¡Sin consulta a la DB!)
		if authUser.Rol != "ADMINISTRADOR" {
			w.WriteHeader(http.StatusForbidden)
			json.NewEncoder(w).Encode(map[string]string{"error": "Forbidden: Requires ADMINISTRADOR role."})
			return
		}

		next.ServeHTTP(w, r)
	}
}
