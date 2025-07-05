// Funciones para interactuar con la API
class ApiService {
    constructor() {
        this.baseURL = API_CONFIG.BASE_URL;
        this.headers = API_CONFIG.HEADERS;
    }

    // Método genérico para hacer peticiones HTTP
    async request(url, options = {}) {
        try {
            showLoading();
            
            const config = {
                headers: this.headers,
                ...options
            };

            const response = await fetch(`${this.baseURL}${url}`, config);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            hideLoading();
            return data;
        } catch (error) {
            hideLoading();
            console.error('API Error:', error);
            throw error;
        }
    }

    // ==================== DOCENTES ====================
    
    // Obtener todos los docentes
    async getDocentes() {
        return await this.request(API_CONFIG.ENDPOINTS.DOCENTES);
    }

    // Obtener docente por ID
    async getDocente(id) {
        return await this.request(`${API_CONFIG.ENDPOINTS.DOCENTES}/${id}`);
    }

    // Crear nuevo docente
    async createDocente(docente) {
        return await this.request(API_CONFIG.ENDPOINTS.DOCENTES, {
            method: 'POST',
            body: JSON.stringify(docente)
        });
    }

    // Actualizar docente
    async updateDocente(id, docente) {
        return await this.request(`${API_CONFIG.ENDPOINTS.DOCENTES}/${id}`, {
            method: 'PUT',
            body: JSON.stringify(docente)
        });
    }

    // Eliminar docente
    async deleteDocente(id) {
        return await this.request(`${API_CONFIG.ENDPOINTS.DOCENTES}/${id}`, {
            method: 'DELETE'
        });
    }

    // ==================== CURSOS ====================
    
    // Obtener todos los cursos
    async getCursos() {
        return await this.request(API_CONFIG.ENDPOINTS.CURSOS);
    }

    // Obtener curso por ID
    async getCurso(id) {
        return await this.request(`${API_CONFIG.ENDPOINTS.CURSOS}/${id}`);
    }

    // Crear nuevo curso
    async createCurso(curso) {
        return await this.request(API_CONFIG.ENDPOINTS.CURSOS, {
            method: 'POST',
            body: JSON.stringify(curso)
        });
    }

    // Actualizar curso
    async updateCurso(id, curso) {
        return await this.request(`${API_CONFIG.ENDPOINTS.CURSOS}/${id}`, {
            method: 'PUT',
            body: JSON.stringify(curso)
        });
    }

    // Eliminar curso
    async deleteCurso(id) {
        return await this.request(`${API_CONFIG.ENDPOINTS.CURSOS}/${id}`, {
            method: 'DELETE'
        });
    }

    // Obtener cursos por docente
    async getCursosPorDocente(docenteId) {
        return await this.request(`${API_CONFIG.ENDPOINTS.CURSOS_POR_DOCENTE}/${docenteId}`);
    }

    // Obtener cursos por ciclo
    async getCursosPorCiclo(ciclo) {
        return await this.request(`${API_CONFIG.ENDPOINTS.CURSOS_POR_CICLO}/${ciclo}`);
    }

    // ==================== ESTADÍSTICAS ====================
    
    // Obtener estadísticas del dashboard
    async getEstadisticas() {
        try {
            const [docentes, cursos] = await Promise.all([
                this.getDocentes(),
                this.getCursos()
            ]);

            const totalDocentes = docentes.length;
            const totalCursos = cursos.length;
            
            // Calcular docentes con cursos
            const docentesConCursos = docentes.filter(d => d.cursos && d.cursos.length > 0).length;
            
            // Calcular cursos por ciclo
            const cursosPorCiclo = {};
            cursos.forEach(curso => {
                const ciclo = curso.ciclo;
                cursosPorCiclo[ciclo] = (cursosPorCiclo[ciclo] || 0) + 1;
            });

            // Calcular total de créditos
            const totalCreditos = cursos.reduce((sum, curso) => sum + curso.creditos, 0);

            return {
                totalDocentes,
                totalCursos,
                docentesConCursos,
                docentesSinCursos: totalDocentes - docentesConCursos,
                cursosPorCiclo,
                totalCreditos,
                promedioCreditos: totalCursos > 0 ? (totalCreditos / totalCursos).toFixed(2) : 0
            };
        } catch (error) {
            console.error('Error obteniendo estadísticas:', error);
            throw error;
        }
    }
}

// Instancia global del servicio de API
const apiService = new ApiService();
