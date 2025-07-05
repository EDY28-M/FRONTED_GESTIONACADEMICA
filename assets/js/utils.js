// Funciones de utilidad
class Utils {
    // ==================== LOADING ====================
    
    static showLoading() {
        const spinner = document.getElementById('loading-spinner');
        if (spinner) {
            spinner.classList.add('show');
        }
    }

    static hideLoading() {
        const spinner = document.getElementById('loading-spinner');
        if (spinner) {
            spinner.classList.remove('show');
        }
    }

    // ==================== NOTIFICATIONS ====================
    
    static showToast(message, type = 'info', duration = 5000) {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icon = this.getToastIcon(type);
        toast.innerHTML = `
            <div class="d-flex align-center gap-1">
                <i class="${icon}"></i>
                <span>${message}</span>
            </div>
        `;

        container.appendChild(toast);

        // Auto remove
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, duration);

        // Click to remove
        toast.addEventListener('click', () => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        });
    }

    static getToastIcon(type) {
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };
        return icons[type] || icons.info;
    }

    // ==================== MODAL ====================
    
    static showModal(content) {
        const modal = document.getElementById('modal');
        const modalBody = document.getElementById('modal-body');
        
        if (modal && modalBody) {
            modalBody.innerHTML = content;
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
    }

    static hideModal() {
        const modal = document.getElementById('modal');
        if (modal) {
            modal.classList.remove('show');
            document.body.style.overflow = 'auto';
        }
    }

    // ==================== DATES ====================
    
    static formatDate(dateString) {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES');
    }

    static formatDateTime(dateString) {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleString('es-ES');
    }

    static getAge(birthDate) {
        if (!birthDate) return '-';
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        
        return age;
    }

    // ==================== VALIDATION ====================
    
    static validateForm(formData, rules) {
        const errors = {};
        
        for (const [field, fieldRules] of Object.entries(rules)) {
            const value = formData[field];
            
            for (const rule of fieldRules) {
                if (rule.type === 'required' && (!value || value.trim() === '')) {
                    errors[field] = rule.message;
                    break;
                }
                
                if (rule.type === 'email' && value && !this.isValidEmail(value)) {
                    errors[field] = rule.message;
                    break;
                }
                
                if (rule.type === 'minLength' && value && value.length < rule.value) {
                    errors[field] = rule.message;
                    break;
                }
                
                if (rule.type === 'maxLength' && value && value.length > rule.value) {
                    errors[field] = rule.message;
                    break;
                }
                
                if (rule.type === 'numeric' && value && isNaN(value)) {
                    errors[field] = rule.message;
                    break;
                }
                
                if (rule.type === 'range' && value && (value < rule.min || value > rule.max)) {
                    errors[field] = rule.message;
                    break;
                }
            }
        }
        
        return {
            isValid: Object.keys(errors).length === 0,
            errors
        };
    }

    static isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    static showFormErrors(errors) {
        // Limpiar errores previos
        document.querySelectorAll('.form-error').forEach(el => el.remove());
        document.querySelectorAll('.form-control.error').forEach(el => el.classList.remove('error'));
        
        // Mostrar nuevos errores
        for (const [field, message] of Object.entries(errors)) {
            const input = document.querySelector(`[name="${field}"]`);
            if (input) {
                input.classList.add('error');
                
                const errorDiv = document.createElement('div');
                errorDiv.className = 'form-error text-danger mt-1';
                errorDiv.textContent = message;
                
                input.parentNode.appendChild(errorDiv);
            }
        }
    }

    // ==================== SEARCH AND FILTER ====================
    
    static filterTable(searchTerm, data, searchFields) {
        if (!searchTerm) return data;
        
        const term = searchTerm.toLowerCase();
        return data.filter(item => {
            return searchFields.some(field => {
                const value = this.getNestedValue(item, field);
                return value && value.toString().toLowerCase().includes(term);
            });
        });
    }

    static getNestedValue(obj, path) {
        return path.split('.').reduce((current, key) => current && current[key], obj);
    }

    // ==================== FORMATTING ====================
    
    static formatNumber(number) {
        return new Intl.NumberFormat('es-ES').format(number);
    }

    static truncateText(text, maxLength = 50) {
        if (!text) return '';
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    }

    static capitalize(str) {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }

    // ==================== STORAGE ====================
    
    static saveToStorage(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (error) {
            console.error('Error saving to localStorage:', error);
        }
    }

    static getFromStorage(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return null;
        }
    }

    static removeFromStorage(key) {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error('Error removing from localStorage:', error);
        }
    }

    // ==================== DEBOUNCE ====================
    
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // ==================== CONFIRMATION ====================
    
    static confirm(message, callback) {
        const confirmed = window.confirm(message);
        if (confirmed && typeof callback === 'function') {
            callback();
        }
        return confirmed;
    }
}

// Alias para funciones comunes
const showLoading = () => Utils.showLoading();
const hideLoading = () => Utils.hideLoading();
const showToast = (message, type, duration) => Utils.showToast(message, type, duration);
const showModal = (content) => Utils.showModal(content);
const hideModal = () => Utils.hideModal();
const formatDate = (date) => Utils.formatDate(date);
const formatDateTime = (date) => Utils.formatDateTime(date);
