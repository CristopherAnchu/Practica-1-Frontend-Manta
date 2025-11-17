package models

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Equipo struct {
	gorm.Model
	ID     string  `gorm:"type:uuid;primaryKey;not null;uniqueIndex" json:"id"`
	Nombre string  `gorm:"type:varchar(255)" json:"nombre" validate:"required"`
	Tipo   string  `gorm:"type:varchar(100)" json:"tipo" validate:"required"`
	Estado string  `gorm:"type:varchar(30)" json:"estado" validate:"required,oneof=DISPONIBLE MANTENIMIENTO FUERA_SERVICIO"`
	Imagen *string `gorm:"type:text" json:"imagen,omitempty"`
}

func (e *Equipo) BeforeCreate(tx *gorm.DB) (err error) {
	// Generar UUID solo si el ID está vacío
	if e.ID == "" {
		e.ID = uuid.New().String()
	}
	return
}
