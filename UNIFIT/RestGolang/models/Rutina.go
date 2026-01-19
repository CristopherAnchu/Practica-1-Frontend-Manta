package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type RutinaUsuario struct {
	ID        string `gorm:"type:uuid;primaryKey;not null" json:"id"`
	UsuarioID string `gorm:"type:uuid;column:usuarioId;not null" json:"usuarioId" validate:"required"`

	//Relaciones con GORM - Commented out to avoid preload issues
	// Usuario User `gorm:"foreignKey:UsuarioID"`

	Titulo      string  `gorm:"type:varchar(255)" json:"titulo" validate:"required"`
	Descripcion *string `gorm:"type:text" json:"descripcion,omitempty"`
	// Ejercicios: Se almacena como JSON/JSONB.
	Ejercicios []EjercicioUsuario `gorm:"type:jsonb" json:"ejercicios,omitempty"`

	// Timestamps
	CreatedAt time.Time      `gorm:"autoCreateTime" json:"createdAt,omitempty"`
	UpdatedAt time.Time      `gorm:"autoUpdateTime" json:"updatedAt,omitempty"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"deletedAt,omitempty"`
}

func (r *RutinaUsuario) BeforeCreate(tx *gorm.DB) (err error) {
	// Generar UUID solo si el ID está vacío
	if r.ID == "" {
		r.ID = uuid.New().String()
	}
	return
}

type RutinaAdministrador struct {
	ID          string                   `json:"id"`
	Nombre      string                   `json:"nombre"`
	Descripcion string                   `json:"descripcion"`
	Nivel       string                   `json:"nivel"` // PRINCIPIANTE | INTERMEDIO | AVANZADO
	Ejercicios  []EjercicioAdministrador `json:"ejercicios"`
}

type RutinaPredefinida struct {
	Nombre     string                 `json:"nombre"`
	Ejercicios []EjercicioPredefinido `json:"ejercicios"`
}
