// Módulo de Cursos
class CursosModule {
    constructor() {
        this.cursos = [];
        this.docentes = [];
        this.filteredCursos = [];
        this.currentPage = 1;
        this.pageSize = 10;
        this.searchTerm = '';
        this.filterCiclo = '';
        this.filterDocente = '';
    }

    async render() {
        try {
            const content = document.getElementById('content');
            content.innerHTML = `
                <div class="cursos-page">
                    <div class="page-header mb-3">
                        <div class="d-flex justify-between align-center">
                            <div>
                                <h1 class="page-title">Gestión de Cursos</h1>
                                <p class="text-muted">Administra la información de los cursos académicos</p>
                            </div>
                            <button class="btn btn-primary" onclick="cursosModule.showCreateForm()">
                                <i class="fas fa-plus"></i>
                                Nuevo Curso
                            </button>
                        </div>
                    </div>

                    <div class="filters-section mb-3">
                        <div class="card">
                            <div class="card-body">
                                <div class="d-flex gap-2 align-center">
                                    <div class="search-box">
                                        <input type="text" 
                                               id="search-cursos" 
                                               placeholder="Buscar cursos..."
                                               value="${this.searchTerm}">
                                        <i class="fas fa-search"></i>
                                    </div>
                                    <select id="filter-ciclo" class="form-control" style="width: auto;">
                                        <option value="">Todos los ciclos</option>
                                        <!-- Se llenarán dinámicamente -->
                                    </select>
                                    <select id="filter-docente" class="form-control" style="width: auto;">
                                        <option value="">Todos los docentes</option>
                                        <!-- Se llenarán dinámicamente -->
                                    </select>
                                    <button class="btn btn-secondary" onclick="cursosModule.clearFilters()">
                                        <i class="fas fa-filter"></i>
                                        Limpiar Filtros
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="table-container">
                        <div class="table-header">
                            <h3 class="card-title">Lista de Cursos</h3>
                            <div class="table-actions">
                                <select id="page-size" class="form-control" style="width: auto;">
                                    <option value="5" ${this.pageSize === 5 ? 'selected' : ''}>5 por página</option>
                                    <option value="10" ${this.pageSize === 10 ? 'selected' : ''}>10 por página</option>
                                    <option value="25" ${this.pageSize === 25 ? 'selected' : ''}>25 por página</option>
                                    <option value="50" ${this.pageSize === 50 ? 'selected' : ''}>50 por página</option>
                                </select>
                            </div>
                        </div>

                        <div class="table-content">
                            <table class="data-table" id="cursos-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Nombre del Curso</th>
                                        <th>Docente</th>
                                        <th>Ciclo</th>
                                        <th>Créditos</th>
                                        <th>Horas/Semana</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody id="cursos-tbody">
                                    <!-- Los cursos se cargarán aquí -->
                                </tbody>
                            </table>
                        </div>

                        <div class="table-footer" id="table-footer">
                            <!-- Paginación se cargará aquí -->
                        </div>
                    </div>
                </div>
            `;

            await this.loadData();
            this.setupEventListeners();
        } catch (error) {
            console.error('Error renderizando página de cursos:', error);
            showToast('Error cargando la página de cursos', 'error');
        }
    }

    async loadData() {
        try {
            // Cargar cursos y docentes en paralelo
            const [cursosData, docentesData] = await Promise.all([
                apiService.getCursos(),
                apiService.getDocentes()
            ]);

            this.cursos = cursosData;
            this.docentes = docentesData;

            this.populateFilters();
            this.applyFilters();
            this.renderTable();
            this.renderPagination();
        } catch (error) {
            console.error('Error cargando datos:', error);
            showToast('Error cargando datos', 'error');
        }
    }

    populateFilters() {
        // Llenar filtro de ciclos
        const cicloSelect = document.getElementById('filter-ciclo');
        if (cicloSelect) {
            const ciclos = [...new Set(this.cursos.map(c => c.ciclo))].sort((a, b) => a - b);
            ciclos.forEach(ciclo => {
                const option = document.createElement('option');
                option.value = ciclo;
                option.textContent = `Ciclo ${ciclo}`;
                cicloSelect.appendChild(option);
            });
        }

        // Llenar filtro de docentes
        const docenteSelect = document.getElementById('filter-docente');
        if (docenteSelect) {
            this.docentes.forEach(docente => {
                const option = document.createElement('option');
                option.value = docente.id;
                option.textContent = `${docente.nombres} ${docente.apellidos}`;
                docenteSelect.appendChild(option);
            });
        }
    }

    applyFilters() {
        let filtered = [...this.cursos];

        // Aplicar búsqueda
        if (this.searchTerm) {
            const searchFields = ['nombreCurso', 'docente.nombres', 'docente.apellidos'];
            filtered = Utils.filterTable(this.searchTerm, filtered, searchFields);
        }

        // Filtrar por ciclo
        if (this.filterCiclo) {
            filtered = filtered.filter(c => c.ciclo.toString() === this.filterCiclo);
        }

        // Filtrar por docente
        if (this.filterDocente) {
            filtered = filtered.filter(c => c.idDocente && c.idDocente.toString() === this.filterDocente);
        }

        this.filteredCursos = filtered;
        this.currentPage = 1; // Reset página al filtrar
    }

    renderTable() {
        const tbody = document.getElementById('cursos-tbody');
        if (!tbody) return;

        // Calcular elementos para la página actual
        const startIndex = (this.currentPage - 1) * this.pageSize;
        const endIndex = startIndex + this.pageSize;
        const pageData = this.filteredCursos.slice(startIndex, endIndex);

        if (pageData.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center text-muted">
                        <i class="fas fa-inbox"></i>
                        <p>No se encontraron cursos</p>
                    </td>
                </tr>
            `;
            return;
        }

        let html = '';
        pageData.forEach(curso => {
            const docenteNombre = curso.docente 
                ? `${curso.docente.nombres} ${curso.docente.apellidos}`
                : 'Sin asignar';

            html += `
                <tr>
                    <td><strong>#${curso.id}</strong></td>
                    <td>
                        <div>
                            <strong>${Utils.truncateText(curso.nombreCurso, 40)}</strong>
                            <br><small class="text-muted">${curso.nombreCurso}</small>
                        </div>
                    </td>
                    <td>
                        ${curso.docente ? `
                            <div>
                                <strong>${docenteNombre}</strong>
                                <br><small class="text-muted">${curso.docente.profesion || 'Sin especificar'}</small>
                            </div>
                        ` : '<span class="text-muted">Sin asignar</span>'}
                    </td>
                    <td>
                        <span class="badge badge-primary">Ciclo ${curso.ciclo}</span>
                    </td>
                    <td>
                        <span class="badge badge-success">${curso.creditos}</span>
                    </td>
                    <td>
                        <span class="badge badge-warning">${curso.horasSemanal} hrs</span>
                    </td>
                    <td>
                        <div class="actions">
                            <button class="btn btn-sm btn-primary btn-icon" 
                                    onclick="cursosModule.viewCurso(${curso.id})"
                                    title="Ver detalles">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="btn btn-sm btn-warning btn-icon" 
                                    onclick="cursosModule.editCurso(${curso.id})"
                                    title="Editar">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-sm btn-danger btn-icon" 
                                    onclick="cursosModule.deleteCurso(${curso.id})"
                                    title="Eliminar">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        });

        tbody.innerHTML = html;
    }

    renderPagination() {
        const footer = document.getElementById('table-footer');
        if (!footer) return;

        const totalPages = Math.ceil(this.filteredCursos.length / this.pageSize);
        const totalItems = this.filteredCursos.length;
        const startItem = (this.currentPage - 1) * this.pageSize + 1;
        const endItem = Math.min(this.currentPage * this.pageSize, totalItems);

        let paginationHTML = `
            <div class="pagination-info">
                Mostrando ${startItem} a ${endItem} de ${totalItems} cursos
            </div>
        `;

        if (totalPages > 1) {
            paginationHTML += '<div class="pagination">';
            
            // Botón anterior
            paginationHTML += `
                <button class="btn btn-sm btn-secondary ${this.currentPage === 1 ? 'disabled' : ''}" 
                        onclick="cursosModule.goToPage(${this.currentPage - 1})"
                        ${this.currentPage === 1 ? 'disabled' : ''}>
                    <i class="fas fa-chevron-left"></i>
                </button>
            `;

            // Números de página
            for (let i = 1; i <= totalPages; i++) {
                if (i === this.currentPage) {
                    paginationHTML += `<button class="btn btn-sm btn-primary">${i}</button>`;
                } else if (i === 1 || i === totalPages || (i >= this.currentPage - 2 && i <= this.currentPage + 2)) {
                    paginationHTML += `<button class="btn btn-sm btn-secondary" onclick="cursosModule.goToPage(${i})">${i}</button>`;
                } else if (i === this.currentPage - 3 || i === this.currentPage + 3) {
                    paginationHTML += '<span class="pagination-dots">...</span>';
                }
            }

            // Botón siguiente
            paginationHTML += `
                <button class="btn btn-sm btn-secondary ${this.currentPage === totalPages ? 'disabled' : ''}" 
                        onclick="cursosModule.goToPage(${this.currentPage + 1})"
                        ${this.currentPage === totalPages ? 'disabled' : ''}>
                    <i class="fas fa-chevron-right"></i>
                </button>
            `;

            paginationHTML += '</div>';
        }

        footer.innerHTML = paginationHTML;
    }

    setupEventListeners() {
        // Búsqueda
        const searchInput = document.getElementById('search-cursos');
        if (searchInput) {
            searchInput.addEventListener('input', Utils.debounce((e) => {
                this.searchTerm = e.target.value;
                this.applyFilters();
                this.renderTable();
                this.renderPagination();
            }, 300));
        }

        // Filtro por ciclo
        const cicloSelect = document.getElementById('filter-ciclo');
        if (cicloSelect) {
            cicloSelect.addEventListener('change', (e) => {
                this.filterCiclo = e.target.value;
                this.applyFilters();
                this.renderTable();
                this.renderPagination();
            });
        }

        // Filtro por docente
        const docenteSelect = document.getElementById('filter-docente');
        if (docenteSelect) {
            docenteSelect.addEventListener('change', (e) => {
                this.filterDocente = e.target.value;
                this.applyFilters();
                this.renderTable();
                this.renderPagination();
            });
        }

        // Tamaño de página
        const pageSizeSelect = document.getElementById('page-size');
        if (pageSizeSelect) {
            pageSizeSelect.addEventListener('change', (e) => {
                this.pageSize = parseInt(e.target.value);
                this.currentPage = 1;
                this.renderTable();
                this.renderPagination();
            });
        }
    }

    clearFilters() {
        this.searchTerm = '';
        this.filterCiclo = '';
        this.filterDocente = '';

        // Limpiar inputs
        const searchInput = document.getElementById('search-cursos');
        const cicloSelect = document.getElementById('filter-ciclo');
        const docenteSelect = document.getElementById('filter-docente');

        if (searchInput) searchInput.value = '';
        if (cicloSelect) cicloSelect.value = '';
        if (docenteSelect) docenteSelect.value = '';

        this.applyFilters();
        this.renderTable();
        this.renderPagination();
    }

    goToPage(page) {
        const totalPages = Math.ceil(this.filteredCursos.length / this.pageSize);
        if (page >= 1 && page <= totalPages) {
            this.currentPage = page;
            this.renderTable();
            this.renderPagination();
        }
    }

    showCreateForm() {
        const docentesOptions = this.docentes.map(d => 
            `<option value="${d.id}">${d.nombres} ${d.apellidos}</option>`
        ).join('');

        const formHTML = `
            <div class="form-container">
                <h2 class="modal-title">Nuevo Curso</h2>
                <form id="curso-form">
                    <div class="form-group">
                        <label class="form-label">Nombre del Curso *</label>
                        <input type="text" name="nombreCurso" class="form-control" required>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">Créditos *</label>
                            <input type="number" name="creditos" class="form-control" min="1" max="10" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Horas por Semana *</label>
                            <input type="number" name="horasSemanal" class="form-control" min="1" max="40" required>
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">Ciclo *</label>
                            <select name="ciclo" class="form-control" required>
                                <option value="">Seleccionar ciclo</option>
                                <option value="1">Ciclo 1</option>
                                <option value="2">Ciclo 2</option>
                                <option value="3">Ciclo 3</option>
                                <option value="4">Ciclo 4</option>
                                <option value="5">Ciclo 5</option>
                                <option value="6">Ciclo 6</option>
                                <option value="7">Ciclo 7</option>
                                <option value="8">Ciclo 8</option>
                                <option value="9">Ciclo 9</option>
                                <option value="10">Ciclo 10</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Docente</label>
                            <select name="idDocente" class="form-control">
                                <option value="">Sin asignar</option>
                                ${docentesOptions}
                            </select>
                        </div>
                    </div>

                    <div class="form-actions">
                        <button type="button" class="btn btn-secondary" onclick="hideModal()">
                            Cancelar
                        </button>
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-save"></i>
                            Guardar Curso
                        </button>
                    </div>
                </form>
            </div>
        `;

        showModal(formHTML);

        // Configurar evento de envío
        const form = document.getElementById('curso-form');
        if (form) {
            form.addEventListener('submit', (e) => this.handleCreateSubmit(e));
        }
    }

    async handleCreateSubmit(event) {
        event.preventDefault();

        const formData = new FormData(event.target);
        const cursoData = {
            nombreCurso: formData.get('nombreCurso'),
            creditos: parseInt(formData.get('creditos')),
            horasSemanal: parseInt(formData.get('horasSemanal')),
            ciclo: parseInt(formData.get('ciclo')),
            idDocente: formData.get('idDocente') ? parseInt(formData.get('idDocente')) : null
        };

        // Validar formulario
        const validation = Utils.validateForm(cursoData, {
            nombreCurso: [
                { type: 'required', message: 'El nombre del curso es obligatorio' },
                { type: 'maxLength', value: 200, message: 'Máximo 200 caracteres' }
            ],
            creditos: [
                { type: 'required', message: 'Los créditos son obligatorios' },
                { type: 'range', min: 1, max: 10, message: 'Los créditos deben estar entre 1 y 10' }
            ],
            horasSemanal: [
                { type: 'required', message: 'Las horas semanales son obligatorias' },
                { type: 'range', min: 1, max: 40, message: 'Las horas deben estar entre 1 y 40' }
            ],
            ciclo: [
                { type: 'required', message: 'El ciclo es obligatorio' },
                { type: 'range', min: 1, max: 10, message: 'El ciclo debe estar entre 1 y 10' }
            ]
        });

        if (!validation.isValid) {
            Utils.showFormErrors(validation.errors);
            return;
        }

        try {
            await apiService.createCurso(cursoData);
            hideModal();
            showToast('Curso creado exitosamente', 'success');
            await this.loadData();
        } catch (error) {
            console.error('Error creando curso:', error);
            showToast('Error al crear el curso', 'error');
        }
    }

    async viewCurso(id) {
        try {
            const curso = await apiService.getCurso(id);
            
            const detailHTML = `
                <div class="curso-detail">
                    <h2 class="modal-title">Detalles del Curso</h2>
                    
                    <div class="detail-section">
                        <h3>Información General</h3>
                        <div class="detail-grid">
                            <div class="detail-item">
                                <label>Nombre del Curso:</label>
                                <span>${curso.nombreCurso}</span>
                            </div>
                            <div class="detail-item">
                                <label>Ciclo:</label>
                                <span class="badge badge-primary">Ciclo ${curso.ciclo}</span>
                            </div>
                            <div class="detail-item">
                                <label>Créditos:</label>
                                <span class="badge badge-success">${curso.creditos} créditos</span>
                            </div>
                            <div class="detail-item">
                                <label>Horas por Semana:</label>
                                <span class="badge badge-warning">${curso.horasSemanal} horas</span>
                            </div>
                        </div>
                    </div>

                    <div class="detail-section">
                        <h3>Docente Asignado</h3>
                        ${this.renderCursoDocente(curso.docente)}
                    </div>

                    <div class="form-actions">
                        <button type="button" class="btn btn-secondary" onclick="hideModal()">
                            Cerrar
                        </button>
                        <button type="button" class="btn btn-warning" onclick="cursosModule.editCurso(${curso.id}); hideModal();">
                            <i class="fas fa-edit"></i>
                            Editar
                        </button>
                    </div>
                </div>
            `;

            showModal(detailHTML);
        } catch (error) {
            console.error('Error obteniendo curso:', error);
            showToast('Error al cargar los detalles del curso', 'error');
        }
    }

    renderCursoDocente(docente) {
        if (!docente) {
            return '<p class="text-muted">No hay docente asignado a este curso</p>';
        }

        return `
            <div class="docente-info">
                <div class="docente-card">
                    <div class="docente-avatar">
                        <i class="fas fa-user-tie"></i>
                    </div>
                    <div class="docente-details">
                        <h4>${docente.nombres} ${docente.apellidos}</h4>
                        <p class="text-muted">${docente.profesion || 'Sin especificar'}</p>
                        <div class="docente-actions">
                            <button class="btn btn-sm btn-primary" onclick="docentesModule.viewDocente(${docente.id}); hideModal();">
                                Ver Perfil
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    async editCurso(id) {
        try {
            const curso = await apiService.getCurso(id);
            const docentesOptions = this.docentes.map(d => 
                `<option value="${d.id}" ${curso.idDocente === d.id ? 'selected' : ''}>${d.nombres} ${d.apellidos}</option>`
            ).join('');

            const formHTML = `
                <div class="form-container">
                    <h2 class="modal-title">Editar Curso</h2>
                    <form id="curso-edit-form">
                        <input type="hidden" name="id" value="${curso.id}">
                        
                        <div class="form-group">
                            <label class="form-label">Nombre del Curso *</label>
                            <input type="text" name="nombreCurso" class="form-control" value="${curso.nombreCurso}" required>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label class="form-label">Créditos *</label>
                                <input type="number" name="creditos" class="form-control" min="1" max="10" value="${curso.creditos}" required>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Horas por Semana *</label>
                                <input type="number" name="horasSemanal" class="form-control" min="1" max="40" value="${curso.horasSemanal}" required>
                            </div>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label class="form-label">Ciclo *</label>
                                <select name="ciclo" class="form-control" required>
                                    <option value="">Seleccionar ciclo</option>
                                    ${[1,2,3,4,5,6,7,8,9,10].map(c => 
                                        `<option value="${c}" ${curso.ciclo === c ? 'selected' : ''}>Ciclo ${c}</option>`
                                    ).join('')}
                                </select>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Docente</label>
                                <select name="idDocente" class="form-control">
                                    <option value="" ${!curso.idDocente ? 'selected' : ''}>Sin asignar</option>
                                    ${docentesOptions}
                                </select>
                            </div>
                        </div>

                        <div class="form-actions">
                            <button type="button" class="btn btn-secondary" onclick="hideModal()">
                                Cancelar
                            </button>
                            <button type="submit" class="btn btn-primary">
                                <i class="fas fa-save"></i>
                                Actualizar Curso
                            </button>
                        </div>
                    </form>
                </div>
            `;

            showModal(formHTML);

            // Configurar evento de envío
            const form = document.getElementById('curso-edit-form');
            if (form) {
                form.addEventListener('submit', (e) => this.handleEditSubmit(e));
            }
        } catch (error) {
            console.error('Error cargando curso para editar:', error);
            showToast('Error al cargar los datos del curso', 'error');
        }
    }

    async handleEditSubmit(event) {
        event.preventDefault();

        const formData = new FormData(event.target);
        const id = parseInt(formData.get('id'));
        const cursoData = {
            nombreCurso: formData.get('nombreCurso'),
            creditos: parseInt(formData.get('creditos')),
            horasSemanal: parseInt(formData.get('horasSemanal')),
            ciclo: parseInt(formData.get('ciclo')),
            idDocente: formData.get('idDocente') ? parseInt(formData.get('idDocente')) : null
        };

        // Validar formulario (mismas reglas que crear)
        const validation = Utils.validateForm(cursoData, {
            nombreCurso: [
                { type: 'required', message: 'El nombre del curso es obligatorio' },
                { type: 'maxLength', value: 200, message: 'Máximo 200 caracteres' }
            ],
            creditos: [
                { type: 'required', message: 'Los créditos son obligatorios' },
                { type: 'range', min: 1, max: 10, message: 'Los créditos deben estar entre 1 y 10' }
            ],
            horasSemanal: [
                { type: 'required', message: 'Las horas semanales son obligatorias' },
                { type: 'range', min: 1, max: 40, message: 'Las horas deben estar entre 1 y 40' }
            ],
            ciclo: [
                { type: 'required', message: 'El ciclo es obligatorio' },
                { type: 'range', min: 1, max: 10, message: 'El ciclo debe estar entre 1 y 10' }
            ]
        });

        if (!validation.isValid) {
            Utils.showFormErrors(validation.errors);
            return;
        }

        try {
            await apiService.updateCurso(id, cursoData);
            hideModal();
            showToast('Curso actualizado exitosamente', 'success');
            await this.loadData();
        } catch (error) {
            console.error('Error actualizando curso:', error);
            showToast('Error al actualizar el curso', 'error');
        }
    }

    deleteCurso(id) {
        const curso = this.cursos.find(c => c.id === id);
        if (!curso) return;

        const confirmMessage = `¿Está seguro de que desea eliminar el curso "${curso.nombreCurso}"?\n\nEsta acción no se puede deshacer.`;
        
        Utils.confirm(confirmMessage, async () => {
            try {
                await apiService.deleteCurso(id);
                showToast('Curso eliminado exitosamente', 'success');
                await this.loadData();
            } catch (error) {
                console.error('Error eliminando curso:', error);
                showToast('Error al eliminar el curso', 'error');
            }
        });
    }
}

// Instancia global del módulo de cursos
const cursosModule = new CursosModule();
