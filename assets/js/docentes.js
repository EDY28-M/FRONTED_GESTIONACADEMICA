// Módulo de Docentes
class DocentesModule {
    constructor() {
        this.docentes = [];
        this.filteredDocentes = [];
        this.currentPage = 1;
        this.pageSize = 10;
        this.searchTerm = '';
    }

    async render() {
        try {
            const content = document.getElementById('content');
            content.innerHTML = `
                <div class="docentes-page">
                    <div class="page-header mb-3">
                        <div class="d-flex justify-between align-center">
                            <div>
                                <h1 class="page-title">Gestión de Docentes</h1>
                                <p class="text-muted">Administra la información de los docentes</p>
                            </div>
                            <button class="btn btn-primary" onclick="docentesModule.showCreateForm()">
                                <i class="fas fa-plus"></i>
                                Nuevo Docente
                            </button>
                        </div>
                    </div>

                    <div class="table-container">
                        <div class="table-header">
                            <h3 class="card-title">Lista de Docentes</h3>
                            <div class="table-actions">
                                <div class="search-box">
                                    <input type="text" 
                                           id="search-docentes" 
                                           placeholder="Buscar docentes..."
                                           value="${this.searchTerm}">
                                    <i class="fas fa-search"></i>
                                </div>
                                <select id="page-size" class="form-control" style="width: auto;">
                                    <option value="5" ${this.pageSize === 5 ? 'selected' : ''}>5 por página</option>
                                    <option value="10" ${this.pageSize === 10 ? 'selected' : ''}>10 por página</option>
                                    <option value="25" ${this.pageSize === 25 ? 'selected' : ''}>25 por página</option>
                                    <option value="50" ${this.pageSize === 50 ? 'selected' : ''}>50 por página</option>
                                </select>
                            </div>
                        </div>

                        <div class="table-content">
                            <table class="data-table" id="docentes-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Nombre Completo</th>
                                        <th>Profesión</th>
                                        <th>Edad</th>
                                        <th>Correo</th>
                                        <th>Cursos</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody id="docentes-tbody">
                                    <!-- Los docentes se cargarán aquí -->
                                </tbody>
                            </table>
                        </div>

                        <div class="table-footer" id="table-footer">
                            <!-- Paginación se cargará aquí -->
                        </div>
                    </div>
                </div>
            `;

            await this.loadDocentes();
            this.setupEventListeners();
        } catch (error) {
            console.error('Error renderizando página de docentes:', error);
            showToast('Error cargando la página de docentes', 'error');
        }
    }

    async loadDocentes() {
        try {
            this.docentes = await apiService.getDocentes();
            this.applyFilters();
            this.renderTable();
            this.renderPagination();
        } catch (error) {
            console.error('Error cargando docentes:', error);
            showToast('Error cargando docentes', 'error');
        }
    }

    applyFilters() {
        let filtered = [...this.docentes];

        // Aplicar búsqueda
        if (this.searchTerm) {
            const searchFields = ['nombres', 'apellidos', 'profesion', 'correo'];
            filtered = Utils.filterTable(this.searchTerm, filtered, searchFields);
        }

        this.filteredDocentes = filtered;
        this.currentPage = 1; // Reset página al filtrar
    }

    renderTable() {
        const tbody = document.getElementById('docentes-tbody');
        if (!tbody) return;

        // Calcular elementos para la página actual
        const startIndex = (this.currentPage - 1) * this.pageSize;
        const endIndex = startIndex + this.pageSize;
        const pageData = this.filteredDocentes.slice(startIndex, endIndex);

        if (pageData.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center text-muted">
                        <i class="fas fa-inbox"></i>
                        <p>No se encontraron docentes</p>
                    </td>
                </tr>
            `;
            return;
        }

        let html = '';
        pageData.forEach(docente => {
            const nombreCompleto = `${docente.nombres} ${docente.apellidos}`;
            const edad = Utils.getAge(docente.fechaNacimiento);
            const profesion = docente.profesion || 'Sin especificar';
            const correo = docente.correo || 'Sin especificar';
            const cantidadCursos = docente.cursos ? docente.cursos.length : 0;

            html += `
                <tr>
                    <td><strong>#${docente.id}</strong></td>
                    <td>
                        <div>
                            <strong>${nombreCompleto}</strong>
                            ${docente.fechaNacimiento ? `<br><small class="text-muted">Nacido: ${formatDate(docente.fechaNacimiento)}</small>` : ''}
                        </div>
                    </td>
                    <td>${profesion}</td>
                    <td>${edad}</td>
                    <td>
                        ${correo !== 'Sin especificar' ? `<a href="mailto:${correo}">${correo}</a>` : correo}
                    </td>
                    <td>
                        <span class="badge ${cantidadCursos > 0 ? 'badge-success' : 'badge-secondary'}">
                            ${cantidadCursos} curso${cantidadCursos !== 1 ? 's' : ''}
                        </span>
                    </td>
                    <td>
                        <div class="actions">
                            <button class="btn btn-sm btn-primary btn-icon" 
                                    onclick="docentesModule.viewDocente(${docente.id})"
                                    title="Ver detalles">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="btn btn-sm btn-warning btn-icon" 
                                    onclick="docentesModule.editDocente(${docente.id})"
                                    title="Editar">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-sm btn-danger btn-icon" 
                                    onclick="docentesModule.deleteDocente(${docente.id})"
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

        const totalPages = Math.ceil(this.filteredDocentes.length / this.pageSize);
        const totalItems = this.filteredDocentes.length;
        const startItem = (this.currentPage - 1) * this.pageSize + 1;
        const endItem = Math.min(this.currentPage * this.pageSize, totalItems);

        let paginationHTML = `
            <div class="pagination-info">
                Mostrando ${startItem} a ${endItem} de ${totalItems} docentes
            </div>
        `;

        if (totalPages > 1) {
            paginationHTML += '<div class="pagination">';
            
            // Botón anterior
            paginationHTML += `
                <button class="btn btn-sm btn-secondary ${this.currentPage === 1 ? 'disabled' : ''}" 
                        onclick="docentesModule.goToPage(${this.currentPage - 1})"
                        ${this.currentPage === 1 ? 'disabled' : ''}>
                    <i class="fas fa-chevron-left"></i>
                </button>
            `;

            // Números de página
            for (let i = 1; i <= totalPages; i++) {
                if (i === this.currentPage) {
                    paginationHTML += `<button class="btn btn-sm btn-primary">${i}</button>`;
                } else if (i === 1 || i === totalPages || (i >= this.currentPage - 2 && i <= this.currentPage + 2)) {
                    paginationHTML += `<button class="btn btn-sm btn-secondary" onclick="docentesModule.goToPage(${i})">${i}</button>`;
                } else if (i === this.currentPage - 3 || i === this.currentPage + 3) {
                    paginationHTML += '<span class="pagination-dots">...</span>';
                }
            }

            // Botón siguiente
            paginationHTML += `
                <button class="btn btn-sm btn-secondary ${this.currentPage === totalPages ? 'disabled' : ''}" 
                        onclick="docentesModule.goToPage(${this.currentPage + 1})"
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
        const searchInput = document.getElementById('search-docentes');
        if (searchInput) {
            searchInput.addEventListener('input', Utils.debounce((e) => {
                this.searchTerm = e.target.value;
                this.applyFilters();
                this.renderTable();
                this.renderPagination();
            }, 300));
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

    goToPage(page) {
        const totalPages = Math.ceil(this.filteredDocentes.length / this.pageSize);
        if (page >= 1 && page <= totalPages) {
            this.currentPage = page;
            this.renderTable();
            this.renderPagination();
        }
    }

    showCreateForm() {
        const formHTML = `
            <div class="form-container">
                <h2 class="modal-title">Nuevo Docente</h2>
                <form id="docente-form">
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">Nombres *</label>
                            <input type="text" name="nombres" class="form-control" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Apellidos *</label>
                            <input type="text" name="apellidos" class="form-control" required>
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">Profesión</label>
                            <input type="text" name="profesion" class="form-control">
                        </div>
                        <div class="form-group">
                            <label class="form-label">Fecha de Nacimiento</label>
                            <input type="date" name="fechaNacimiento" class="form-control">
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Correo Electrónico</label>
                        <input type="email" name="correo" class="form-control">
                    </div>

                    <div class="form-actions">
                        <button type="button" class="btn btn-secondary" onclick="hideModal()">
                            Cancelar
                        </button>
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-save"></i>
                            Guardar Docente
                        </button>
                    </div>
                </form>
            </div>
        `;

        showModal(formHTML);

        // Configurar evento de envío
        const form = document.getElementById('docente-form');
        if (form) {
            form.addEventListener('submit', (e) => this.handleCreateSubmit(e));
        }
    }

    async handleCreateSubmit(event) {
        event.preventDefault();

        const formData = new FormData(event.target);
        const docenteData = {
            nombres: formData.get('nombres'),
            apellidos: formData.get('apellidos'),
            profesion: formData.get('profesion') || null,
            fechaNacimiento: formData.get('fechaNacimiento') || null,
            correo: formData.get('correo') || null
        };

        // Validar formulario
        const validation = Utils.validateForm(docenteData, {
            nombres: [
                { type: 'required', message: 'Los nombres son obligatorios' },
                { type: 'maxLength', value: 100, message: 'Máximo 100 caracteres' }
            ],
            apellidos: [
                { type: 'required', message: 'Los apellidos son obligatorios' },
                { type: 'maxLength', value: 100, message: 'Máximo 100 caracteres' }
            ],
            profesion: [
                { type: 'maxLength', value: 100, message: 'Máximo 100 caracteres' }
            ],
            correo: [
                { type: 'email', message: 'Ingrese un correo válido' },
                { type: 'maxLength', value: 100, message: 'Máximo 100 caracteres' }
            ]
        });

        if (!validation.isValid) {
            Utils.showFormErrors(validation.errors);
            return;
        }

        try {
            await apiService.createDocente(docenteData);
            hideModal();
            showToast('Docente creado exitosamente', 'success');
            await this.loadDocentes();
        } catch (error) {
            console.error('Error creando docente:', error);
            showToast('Error al crear el docente', 'error');
        }
    }

    async viewDocente(id) {
        try {
            const docente = await apiService.getDocente(id);
            
            const detailHTML = `
                <div class="docente-detail">
                    <h2 class="modal-title">Detalles del Docente</h2>
                    
                    <div class="detail-section">
                        <h3>Información Personal</h3>
                        <div class="detail-grid">
                            <div class="detail-item">
                                <label>Nombre Completo:</label>
                                <span>${docente.nombres} ${docente.apellidos}</span>
                            </div>
                            <div class="detail-item">
                                <label>Profesión:</label>
                                <span>${docente.profesion || 'Sin especificar'}</span>
                            </div>
                            <div class="detail-item">
                                <label>Fecha de Nacimiento:</label>
                                <span>${docente.fechaNacimiento ? formatDate(docente.fechaNacimiento) : 'Sin especificar'}</span>
                            </div>
                            <div class="detail-item">
                                <label>Edad:</label>
                                <span>${Utils.getAge(docente.fechaNacimiento)}</span>
                            </div>
                            <div class="detail-item">
                                <label>Correo:</label>
                                <span>${docente.correo ? `<a href="mailto:${docente.correo}">${docente.correo}</a>` : 'Sin especificar'}</span>
                            </div>
                        </div>
                    </div>

                    <div class="detail-section">
                        <h3>Cursos Asignados (${docente.cursos ? docente.cursos.length : 0})</h3>
                        ${this.renderDocenteCursos(docente.cursos)}
                    </div>

                    <div class="form-actions">
                        <button type="button" class="btn btn-secondary" onclick="hideModal()">
                            Cerrar
                        </button>
                        <button type="button" class="btn btn-warning" onclick="docentesModule.editDocente(${docente.id}); hideModal();">
                            <i class="fas fa-edit"></i>
                            Editar
                        </button>
                    </div>
                </div>
            `;

            showModal(detailHTML);
        } catch (error) {
            console.error('Error obteniendo docente:', error);
            showToast('Error al cargar los detalles del docente', 'error');
        }
    }

    renderDocenteCursos(cursos) {
        if (!cursos || cursos.length === 0) {
            return '<p class="text-muted">No tiene cursos asignados</p>';
        }

        let html = '<div class="cursos-list">';
        cursos.forEach(curso => {
            html += `
                <div class="curso-item">
                    <div class="curso-info">
                        <h4>${curso.nombreCurso}</h4>
                        <div class="curso-details">
                            <span class="badge badge-primary">Ciclo ${curso.ciclo}</span>
                            <span class="badge badge-success">${curso.creditos} créditos</span>
                            <span class="badge badge-warning">${curso.horasSemanal} hrs/sem</span>
                        </div>
                    </div>
                </div>
            `;
        });
        html += '</div>';

        return html;
    }

    async editDocente(id) {
        try {
            const docente = await apiService.getDocente(id);
            
            const formHTML = `
                <div class="form-container">
                    <h2 class="modal-title">Editar Docente</h2>
                    <form id="docente-edit-form">
                        <input type="hidden" name="id" value="${docente.id}">
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label class="form-label">Nombres *</label>
                                <input type="text" name="nombres" class="form-control" value="${docente.nombres}" required>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Apellidos *</label>
                                <input type="text" name="apellidos" class="form-control" value="${docente.apellidos}" required>
                            </div>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label class="form-label">Profesión</label>
                                <input type="text" name="profesion" class="form-control" value="${docente.profesion || ''}">
                            </div>
                            <div class="form-group">
                                <label class="form-label">Fecha de Nacimiento</label>
                                <input type="date" name="fechaNacimiento" class="form-control" 
                                       value="${docente.fechaNacimiento ? docente.fechaNacimiento.split('T')[0] : ''}">
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Correo Electrónico</label>
                            <input type="email" name="correo" class="form-control" value="${docente.correo || ''}">
                        </div>

                        <div class="form-actions">
                            <button type="button" class="btn btn-secondary" onclick="hideModal()">
                                Cancelar
                            </button>
                            <button type="submit" class="btn btn-primary">
                                <i class="fas fa-save"></i>
                                Actualizar Docente
                            </button>
                        </div>
                    </form>
                </div>
            `;

            showModal(formHTML);

            // Configurar evento de envío
            const form = document.getElementById('docente-edit-form');
            if (form) {
                form.addEventListener('submit', (e) => this.handleEditSubmit(e));
            }
        } catch (error) {
            console.error('Error cargando docente para editar:', error);
            showToast('Error al cargar los datos del docente', 'error');
        }
    }

    async handleEditSubmit(event) {
        event.preventDefault();

        const formData = new FormData(event.target);
        const id = parseInt(formData.get('id'));
        const docenteData = {
            nombres: formData.get('nombres'),
            apellidos: formData.get('apellidos'),
            profesion: formData.get('profesion') || null,
            fechaNacimiento: formData.get('fechaNacimiento') || null,
            correo: formData.get('correo') || null
        };

        // Validar formulario (mismas reglas que crear)
        const validation = Utils.validateForm(docenteData, {
            nombres: [
                { type: 'required', message: 'Los nombres son obligatorios' },
                { type: 'maxLength', value: 100, message: 'Máximo 100 caracteres' }
            ],
            apellidos: [
                { type: 'required', message: 'Los apellidos son obligatorios' },
                { type: 'maxLength', value: 100, message: 'Máximo 100 caracteres' }
            ],
            profesion: [
                { type: 'maxLength', value: 100, message: 'Máximo 100 caracteres' }
            ],
            correo: [
                { type: 'email', message: 'Ingrese un correo válido' },
                { type: 'maxLength', value: 100, message: 'Máximo 100 caracteres' }
            ]
        });

        if (!validation.isValid) {
            Utils.showFormErrors(validation.errors);
            return;
        }

        try {
            await apiService.updateDocente(id, docenteData);
            hideModal();
            showToast('Docente actualizado exitosamente', 'success');
            await this.loadDocentes();
        } catch (error) {
            console.error('Error actualizando docente:', error);
            showToast('Error al actualizar el docente', 'error');
        }
    }

    deleteDocente(id) {
        const docente = this.docentes.find(d => d.id === id);
        if (!docente) return;

        const confirmMessage = `¿Está seguro de que desea eliminar al docente "${docente.nombres} ${docente.apellidos}"?\n\nEsta acción no se puede deshacer.`;
        
        Utils.confirm(confirmMessage, async () => {
            try {
                await apiService.deleteDocente(id);
                showToast('Docente eliminado exitosamente', 'success');
                await this.loadDocentes();
            } catch (error) {
                console.error('Error eliminando docente:', error);
                if (error.message.includes('400')) {
                    showToast('No se puede eliminar el docente porque tiene cursos asignados', 'error');
                } else {
                    showToast('Error al eliminar el docente', 'error');
                }
            }
        });
    }
}

// Instancia global del módulo de docentes
const docentesModule = new DocentesModule();
