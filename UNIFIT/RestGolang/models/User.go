package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type User struct {
	ID       string  `gorm:"type:uuid;primaryKey;not null" json:"id"`
	Nombre   *string `gorm:"type:varchar(255);not null" json:"nombre,omitempty"`
	Email    string  `gorm:"unique;type:varchar(255);not null" json:"email"`
	Password *string `gorm:"type:varchar(255);not null" json:"password,omitempty"`
	Tipo     *string `gorm:"type:enum_tipo;not null" json:"tipo,omitempty"` // Usado en login.ts para redirigir
	Rol      *string `gorm:"type:enum_rol;not null" json:"rol,omitempty"`   // Usado para middleware de seguridad

	// Timestamps
	CreatedAt time.Time      `gorm:"autoCreateTime" json:"createdAt,omitempty"`
	UpdatedAt time.Time      `gorm:"autoUpdateTime" json:"updatedAt,omitempty"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"deletedAt,omitempty"`
}

func (u *User) BeforeCreate(tx *gorm.DB) (err error) {
	// Solo generamos un nuevo ID si el campo ID está vacío
	if u.ID == "" {
		u.ID = uuid.New().String()
	}
	return
}
