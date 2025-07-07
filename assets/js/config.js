// Configuración de la API
const API_CONFIG = {
    BASE_URL: 'http://34.60.233.211:8080/api', // URL de API en Google Cloud
    ENDPOINTS: {
        DOCENTES: '/Docentes',
        CURSOS: '/Cursos',
        CURSOS_POR_DOCENTE: '/Cursos/PorDocente',
        CURSOS_POR_CICLO: '/Cursos/PorCiclo'
    },
    TIMEOUT: 10000, // 10 segundos
    HEADERS: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
};

// Estados de carga
const LOADING_STATES = {
    IDLE: 'idle',
    LOADING: 'loading',
    SUCCESS: 'success',
    ERROR: 'error'
};

// Configuración de paginación
const PAGINATION_CONFIG = {
    DEFAULT_PAGE_SIZE: 10,
    PAGE_SIZE_OPTIONS: [5, 10, 25, 50]
};

// Configuración de notificaciones
const TOAST_CONFIG = {
    DURATION: 5000, // 5 segundos
    TYPES: {
        SUCCESS: 'success',
        ERROR: 'error',
        WARNING: 'warning',
        INFO: 'info'
    }
};

// Validaciones
const VALIDATION_RULES = {
    REQUIRED: 'Este campo es obligatorio',
    EMAIL: 'Ingrese un email válido',
    MIN_LENGTH: (min) => `Mínimo ${min} caracteres`,
    MAX_LENGTH: (max) => `Máximo ${max} caracteres`,
    NUMERIC: 'Solo se permiten números',
    RANGE: (min, max) => `El valor debe estar entre ${min} y ${max}`
};
