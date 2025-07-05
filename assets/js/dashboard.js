// Módulo del Dashboard
class Dashboard {
    constructor() {
        this.stats = null;
    }

    async render() {
        try {
            const content = document.getElementById('content');
            content.innerHTML = `
                <div class="dashboard">
                    <div class="page-header mb-3">
                        <h1 class="page-title">Dashboard</h1>
                        <p class="text-muted">Resumen general del sistema académico</p>
                    </div>

                    <!-- Estadísticas principales -->
                    <div class="stats-grid" id="stats-grid">
                        <!-- Las estadísticas se cargarán aquí -->
                    </div>

                    <!-- Gráficos y tablas resumen -->
                    <div class="dashboard-content">
                        <div class="row">
                            <div class="col-md-8">
                                <div class="card">
                                    <div class="card-header">
                                        <h3 class="card-title">Cursos por Ciclo</h3>
                                    </div>
                                    <div class="card-body">
                                        <div id="cursos-por-ciclo-chart"></div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="card">
                                    <div class="card-header">
                                        <h3 class="card-title">Actividad Reciente</h3>
                                    </div>
                                    <div class="card-body">
                                        <div id="actividad-reciente"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="row mt-3">
                            <div class="col-md-6">
                                <div class="card">
                                    <div class="card-header">
                                        <h3 class="card-title">Docentes Destacados</h3>
                                    </div>
                                    <div class="card-body">
                                        <div id="docentes-destacados"></div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="card">
                                    <div class="card-header">
                                        <h3 class="card-title">Cursos Recientes</h3>
                                    </div>
                                    <div class="card-body">
                                        <div id="cursos-recientes"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            await this.loadStats();
            await this.loadCharts();
            await this.loadRecentActivity();
        } catch (error) {
            console.error('Error renderizando dashboard:', error);
            showToast('Error cargando el dashboard', 'error');
        }
    }

    async loadStats() {
        try {
            this.stats = await apiService.getEstadisticas();
            this.renderStats();
        } catch (error) {
            console.error('Error cargando estadísticas:', error);
            showToast('Error cargando estadísticas', 'error');
        }
    }

    renderStats() {
        const statsGrid = document.getElementById('stats-grid');
        if (!statsGrid || !this.stats) return;

        statsGrid.innerHTML = `
            <div class="stat-card">
                <div class="stat-icon blue">
                    <i class="fas fa-chalkboard-teacher"></i>
                </div>
                <div class="stat-number">${this.stats.totalDocentes}</div>
                <div class="stat-label">Total Docentes</div>
            </div>

            <div class="stat-card">
                <div class="stat-icon green">
                    <i class="fas fa-book"></i>
                </div>
                <div class="stat-number">${this.stats.totalCursos}</div>
                <div class="stat-label">Total Cursos</div>
            </div>

            <div class="stat-card">
                <div class="stat-icon orange">
                    <i class="fas fa-users"></i>
                </div>
                <div class="stat-number">${this.stats.docentesConCursos}</div>
                <div class="stat-label">Docentes Activos</div>
            </div>

            <div class="stat-card">
                <div class="stat-icon red">
                    <i class="fas fa-medal"></i>
                </div>
                <div class="stat-number">${this.stats.totalCreditos}</div>
                <div class="stat-label">Total Créditos</div>
            </div>
        `;
    }

    async loadCharts() {
        try {
            this.renderCursosPorCicloChart();
        } catch (error) {
            console.error('Error cargando gráficos:', error);
        }
    }

    renderCursosPorCicloChart() {
        const chartContainer = document.getElementById('cursos-por-ciclo-chart');
        if (!chartContainer || !this.stats) return;

        const { cursosPorCiclo } = this.stats;
        const ciclos = Object.keys(cursosPorCiclo).sort((a, b) => parseInt(a) - parseInt(b));
        const maxCursos = Math.max(...Object.values(cursosPorCiclo));

        let chartHTML = '<div class="chart-bars">';
        
        ciclos.forEach(ciclo => {
            const cantidad = cursosPorCiclo[ciclo];
            const porcentaje = (cantidad / maxCursos) * 100;
            
            chartHTML += `
                <div class="chart-bar-container">
                    <div class="chart-bar-label">Ciclo ${ciclo}</div>
                    <div class="chart-bar">
                        <div class="chart-bar-fill" style="height: ${porcentaje}%"></div>
                    </div>
                    <div class="chart-bar-value">${cantidad}</div>
                </div>
            `;
        });
        
        chartHTML += '</div>';

        // Agregar estilos para el gráfico
        if (!document.getElementById('chart-styles')) {
            const style = document.createElement('style');
            style.id = 'chart-styles';
            style.textContent = `
                .chart-bars {
                    display: flex;
                    align-items: end;
                    gap: 1rem;
                    height: 200px;
                    padding: 1rem 0;
                }
                .chart-bar-container {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    height: 100%;
                }
                .chart-bar {
                    flex: 1;
                    width: 40px;
                    background: var(--gray-200);
                    border-radius: 4px;
                    position: relative;
                    margin: 0.5rem 0;
                    display: flex;
                    align-items: end;
                }
                .chart-bar-fill {
                    width: 100%;
                    background: linear-gradient(to top, var(--primary-color), var(--accent-color));
                    border-radius: 4px;
                    transition: height 0.5s ease;
                    min-height: 10px;
                }
                .chart-bar-label {
                    font-size: 0.8rem;
                    font-weight: 500;
                    color: var(--gray-600);
                }
                .chart-bar-value {
                    font-size: 0.9rem;
                    font-weight: bold;
                    color: var(--gray-800);
                }
            `;
            document.head.appendChild(style);
        }

        chartContainer.innerHTML = chartHTML;
    }

    async loadRecentActivity() {
        try {
            const [docentes, cursos] = await Promise.all([
                apiService.getDocentes(),
                apiService.getCursos()
            ]);

            this.renderDocentesDestacados(docentes);
            this.renderCursosRecientes(cursos);
            this.renderActividadReciente();
        } catch (error) {
            console.error('Error cargando actividad reciente:', error);
        }
    }

    renderDocentesDestacados(docentes) {
        const container = document.getElementById('docentes-destacados');
        if (!container) return;

        // Ordenar docentes por cantidad de cursos
        const docentesOrdenados = docentes
            .filter(d => d.cursos && d.cursos.length > 0)
            .sort((a, b) => b.cursos.length - a.cursos.length)
            .slice(0, 5);

        if (docentesOrdenados.length === 0) {
            container.innerHTML = '<p class="text-muted">No hay docentes con cursos asignados</p>';
            return;
        }

        let html = '<div class="list-group">';
        docentesOrdenados.forEach((docente, index) => {
            html += `
                <div class="list-group-item d-flex justify-between align-center">
                    <div>
                        <h6 class="mb-1">${docente.nombres} ${docente.apellidos}</h6>
                        <small class="text-muted">${docente.profesion || 'Sin especificar'}</small>
                    </div>
                    <div class="text-right">
                        <span class="badge badge-primary">${docente.cursos.length} cursos</span>
                    </div>
                </div>
            `;
        });
        html += '</div>';

        container.innerHTML = html;
    }

    renderCursosRecientes(cursos) {
        const container = document.getElementById('cursos-recientes');
        if (!container) return;

        // Mostrar últimos 5 cursos (simulamos que están ordenados por ID)
        const cursosRecientes = cursos.slice(-5).reverse();

        if (cursosRecientes.length === 0) {
            container.innerHTML = '<p class="text-muted">No hay cursos registrados</p>';
            return;
        }

        let html = '<div class="list-group">';
        cursosRecientes.forEach(curso => {
            const docenteNombre = curso.docente 
                ? `${curso.docente.nombres} ${curso.docente.apellidos}`
                : 'Sin asignar';

            html += `
                <div class="list-group-item">
                    <div class="d-flex justify-between align-center">
                        <div>
                            <h6 class="mb-1">${Utils.truncateText(curso.nombreCurso, 30)}</h6>
                            <small class="text-muted">
                                <i class="fas fa-user"></i> ${docenteNombre} | 
                                <i class="fas fa-layer-group"></i> Ciclo ${curso.ciclo}
                            </small>
                        </div>
                        <div class="text-right">
                            <span class="badge badge-success">${curso.creditos} créditos</span>
                        </div>
                    </div>
                </div>
            `;
        });
        html += '</div>';

        container.innerHTML = html;
    }

    renderActividadReciente() {
        const container = document.getElementById('actividad-reciente');
        if (!container) return;

        // Simulamos actividad reciente
        const actividades = [
            {
                tipo: 'docente',
                accion: 'creado',
                descripcion: 'Nuevo docente registrado',
                tiempo: '2 horas ago'
            },
            {
                tipo: 'curso',
                accion: 'actualizado',
                descripcion: 'Curso actualizado',
                tiempo: '4 horas ago'
            },
            {
                tipo: 'docente',
                accion: 'eliminado',
                descripcion: 'Docente eliminado',
                tiempo: '1 día ago'
            }
        ];

        let html = '<div class="activity-list">';
        actividades.forEach(actividad => {
            const icon = actividad.tipo === 'docente' ? 'fa-chalkboard-teacher' : 'fa-book';
            const color = actividad.accion === 'creado' ? 'success' : 
                         actividad.accion === 'actualizado' ? 'warning' : 'danger';

            html += `
                <div class="activity-item">
                    <div class="activity-icon ${color}">
                        <i class="fas ${icon}"></i>
                    </div>
                    <div class="activity-content">
                        <p class="activity-description">${actividad.descripcion}</p>
                        <small class="activity-time text-muted">${actividad.tiempo}</small>
                    </div>
                </div>
            `;
        });
        html += '</div>';

        // Agregar estilos para la actividad
        if (!document.getElementById('activity-styles')) {
            const style = document.createElement('style');
            style.id = 'activity-styles';
            style.textContent = `
                .activity-list {
                    max-height: 300px;
                    overflow-y: auto;
                }
                .activity-item {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    padding: 0.75rem 0;
                    border-bottom: 1px solid var(--gray-200);
                }
                .activity-item:last-child {
                    border-bottom: none;
                }
                .activity-icon {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-size: 0.9rem;
                }
                .activity-icon.success { background: var(--accent-color); }
                .activity-icon.warning { background: var(--warning-color); }
                .activity-icon.danger { background: var(--danger-color); }
                .activity-content {
                    flex: 1;
                }
                .activity-description {
                    margin: 0;
                    font-size: 0.9rem;
                    color: var(--gray-700);
                }
                .activity-time {
                    font-size: 0.8rem;
                }
                .list-group {
                    border-radius: var(--border-radius);
                    overflow: hidden;
                }
                .list-group-item {
                    border: none;
                    border-bottom: 1px solid var(--gray-200);
                    padding: 1rem;
                }
                .list-group-item:last-child {
                    border-bottom: none;
                }
                .list-group-item h6 {
                    margin-bottom: 0.25rem;
                    color: var(--gray-800);
                }
            `;
            document.head.appendChild(style);
        }

        container.innerHTML = html;
    }
}

// Instancia global del dashboard
const dashboard = new Dashboard();
