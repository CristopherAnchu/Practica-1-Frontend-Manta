package models

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type User struct {
	gorm.Model

	ID       string  `gorm:"type:uuid;primaryKey;not null;uniqueIndex" json:"id"`
	Nombre   *string `gorm:"type:varchar(255);not null;uniqueIndex" json:"nombre,omitempty"`
	Email    string  `gorm:"unique;type:varchar(255);not null;uniqueIndex" json:"email"`
	Password *string `gorm:"type:varchar(255);not null" json:"password,omitempty"`
	Tipo     *string `gorm:"type:enum_tipo;not null" json:"tipo,omitempty"` // Usado en login.ts para redirigir	Rol      *string `gorm:"type:enum_rol;not null" json:"rol,omitempty"`
	Rol      *string `gorm:"type:enum_rol;not null" json:"rol,omitempty"`   // Usado para middleware de seguridad
}

func (u *User) BeforeCreate(tx *gorm.DB) (err error) {
	// Solo generamos un nuevo ID si el campo ID está vacío
	if u.ID == "" {
		u.ID = uuid.New().String()
	}
	return
}
