package models

type EjercicioUsuario struct {
	Nombre       string  `json:"nombre"`
	Repeticiones *string `json:"repeticiones,omitempty"`
}

type EjercicioPredefinido struct {
	Ejercicio    string `json:"ejercicio"`
	Series       string `json:"series"`
	Repeticiones string `json:"repeticiones"`
}

type EjercicioAdministrador struct {
	Ejercicio    string `json:"ejercicio"`
	Series       string `json:"series"`
	Repeticiones string `json:"repeticiones"`
}
