import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

// Handle token refresh on 401
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401 && typeof window !== 'undefined') {
            const refreshToken = localStorage.getItem('refresh_token');
            if (refreshToken) {
                try {
                    const response = await axios.post(`${API_BASE_URL}/token/refresh/`, {
                        refresh: refreshToken,
                    });
                    localStorage.setItem('access_token', response.data.access);
                    error.config.headers.Authorization = `Bearer ${response.data.access}`;
                    return api.request(error.config);
                } catch (refreshError) {
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('refresh_token');
                    window.location.href = '/login';
                }
            }
        }
        return Promise.reject(error);
    }
);

export interface LoginCredentials {
    username: string;
    password: string;
}

export interface TokenResponse {
    access: string;
    refresh: string;
}

export interface PredictionInput {
    marital_status: number;
    application_mode: number;
    application_order: number;
    course: number;
    daytime_evening_attendance: number;
    previous_qualification: number;
    nationality: number;
    gender: number;
    age_at_enrollment: number;
    international: number;
    displaced: number;
    educational_special_needs: number;
    mothers_qualification: number;
    fathers_qualification: number;
    mothers_occupation: number;
    fathers_occupation: number;
    scholarship_holder: number;
    debtor: number;

    tuition_fees_up_to_date: number;
    // admission_grade removed as per backend model update
    curricular_units_1st_sem_credited: number;
    curricular_units_1st_sem_enrolled: number;
    curricular_units_1st_sem_evaluations: number;
    curricular_units_1st_sem_approved: number;
    curricular_units_1st_sem_grade: number;
    curricular_units_1st_sem_without_evaluations: number;
    curricular_units_2nd_sem_credited: number;
    curricular_units_2nd_sem_enrolled: number;
    curricular_units_2nd_sem_evaluations: number;
    curricular_units_2nd_sem_approved: number;
    curricular_units_2nd_sem_grade: number;
    curricular_units_2nd_sem_without_evaluations: number;
    unemployment_rate: number;
    inflation_rate: number;
    gdp: number;
    save_record?: boolean;
}

export interface PredictionResult {
    predicted_class: string;
    dropout_probability: number;
    all_probabilities: Record<string, number>;
    grade_trend: number;
    high_risk: boolean;
    intervention_recommended: boolean;
    saved_record_id?: number;
}

export interface Student extends PredictionInput {
    id: number;
    user?: number;
    last_prediction?: string;
    last_dropout_probability?: number;
    created_at: string;
    updated_at: string;
}

export interface ClassAverage {
    '1st_sem_grade': number;
    '2nd_sem_grade': number;
    '1st_sem_approved': number;
    '2nd_sem_approved': number;
    '1st_sem_enrolled': number;
    '2nd_sem_enrolled': number;
    admission_grade: number;
}

export interface RegisterCredentials extends LoginCredentials {
    email?: string;
    first_name?: string;
    last_name?: string;
    role?: 'Student' | 'Teacher' | 'Analyst';
}

export interface RegisterResponse {
    user: {
        username: string;
        email: string;
        first_name: string;
        last_name: string;
    };
    role: string;
    message: string;
}

// Auth API
export const authApi = {
    login: async (credentials: LoginCredentials): Promise<TokenResponse> => {
        const response = await api.post('/token/', credentials);
        if (typeof window !== 'undefined') {
            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);
        }
        return response.data;
    },
    register: async (data: RegisterCredentials): Promise<RegisterResponse> => {
        const response = await api.post('/register/', data);
        return response.data;
    },
    logout: () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            // Force reload to clear state if needed, or handle in Context
        }
    },
    isAuthenticated: () => {
        if (typeof window !== 'undefined') {
            return !!localStorage.getItem('access_token');
        }
        return false;
    },
};

// Predictions API
export const predictionsApi = {
    predict: async (data: PredictionInput): Promise<PredictionResult> => {
        const response = await api.post('/predict/', data);
        return response.data;
    },
    getStudents: async (): Promise<Student[]> => {
        const response = await api.get('/students/');
        return response.data.results || response.data;
    },
    getStudent: async (id: number): Promise<Student> => {
        const response = await api.get(`/students/${id}/`);
        return response.data;
    },
    createStudent: async (data: PredictionInput): Promise<Student> => {
        const response = await api.post('/students/', data);
        return response.data;
    },
    getClassAverage: async (): Promise<ClassAverage> => {
        const response = await api.get('/class-average/');
        return response.data;
    },
    healthCheck: async (): Promise<{ status: string; ml_models_loaded: boolean }> => {
        const response = await api.get('/health/');
        return response.data;
    },
    uploadCSV: async (file: File): Promise<{ message: string; processed_count: number; high_risk_count: number; errors: string[] }> => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await api.post('/upload/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },
};

export interface SupportTicket {
    id: number;
    subject: string;
    message: string;
    status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
    created_at: string;
}

export interface Notification {
    id: number;
    title: string;
    message: string;
    is_read: boolean;
    type: 'info' | 'warning' | 'success' | 'error';
    created_at: string;
}

export const supportApi = {
    getTickets: async (): Promise<SupportTicket[]> => {
        const response = await api.get('/support/');
        return response.data;
    },
    createTicket: async (data: { subject: string; message: string }): Promise<SupportTicket> => {
        const response = await api.post('/support/', data);
        return response.data;
    },
};

export const notificationApi = {
    getNotifications: async (): Promise<Notification[]> => {
        const response = await api.get('/notifications/');
        return response.data;
    },
    markRead: async (id: number): Promise<void> => {
        await api.post(`/notifications/${id}/mark_read/`);
    },
    markAllRead: async (): Promise<void> => {
        await api.post('/notifications/mark_all_read/');
    },
};


export default api;
