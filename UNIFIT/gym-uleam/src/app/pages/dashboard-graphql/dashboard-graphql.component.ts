import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GraphqlService } from '../../services/graphql.service';
import * as TYPES from '../../graphql/graphql.types';

@Component({
  selector: 'app-dashboard-graphql',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-graphql.component.html',
  styleUrls: ['./dashboard-graphql.component.css']
})
export class DashboardGraphqlComponent implements OnInit {
  
  loading = true;
  error: string | null = null;

  // Datos del dashboard
  estadisticas: TYPES.EstadisticasReservas | null = null;
  rutinasPopulares: TYPES.RutinaPopular[] = [];
  usuariosActivos: TYPES.UsuarioActivo[] = [];
  reporteOcupacion: TYPES.ReporteOcupacion[] = [];

  constructor(private graphqlService: GraphqlService) {}

  ngOnInit(): void {
    this.cargarDashboard();
  }

  cargarDashboard(): void {
    this.loading = true;
    this.error = null;

    this.graphqlService.getDashboardCompleto().subscribe({
      next: (data) => {
        this.estadisticas = data.estadisticas;
        this.rutinasPopulares = data.topRutinas;
        this.usuariosActivos = data.topUsuarios;
        this.reporteOcupacion = data.ocupacion;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar dashboard:', err);
        this.error = 'Error al cargar los datos del dashboard';
        this.loading = false;
      }
    });
  }

  recargarDatos(): void {
    this.cargarDashboard();
  }
}
