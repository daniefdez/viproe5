/**
 * 🚀 SERVICIO API ROCK AND ROLL
 * Cliente seguro para comunicación con backend
 */

const API_BASE = import.meta.env.PROD 
  ? 'https://api.visionai-pro.com' 
  : 'http://localhost:3001';

class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
    this.name = 'ApiError';
  }
}

class ApiService {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('authToken');
  }

  // 🔐 AUTENTICACIÓN
  setToken(token: string) {
    this.token = token;
    localStorage.setItem('authToken', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('authToken');
  }

  // 🌐 REQUEST BASE
  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE}/api${endpoint}`;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(
          errorData.error || `HTTP ${response.status}`,
          response.status
        );
      }

      return response.json();
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Error de conexión', 0);
    }
  }

  // 👤 AUTENTICACIÓN
  async register(userData: { email: string; password: string; name: string }) {
    const response = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
    
    if (response.token) {
      this.setToken(response.token);
    }
    
    return response;
  }

  async login(credentials: { email: string; password: string }) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
    
    if (response.token) {
      this.setToken(response.token);
    }
    
    return response;
  }

  async refreshToken() {
    if (!this.token) throw new ApiError('No token available', 401);
    
    const response = await this.request('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ token: this.token })
    });
    
    if (response.token) {
      this.setToken(response.token);
    }
    
    return response;
  }

  // 🔍 ANÁLISIS
  async analyzeImage(file: File) {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${API_BASE}/api/analysis/analyze`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.token}`
      },
      body: formData,
      credentials: 'include'
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(errorData.error || 'Error en análisis', response.status);
    }

    return response.json();
  }

  // 💬 CHAT
  async startChat(file: File, analysisContext: any) {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('analysisContext', JSON.stringify(analysisContext));

    const response = await fetch(`${API_BASE}/api/analysis/chat/start`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.token}`
      },
      body: formData,
      credentials: 'include'
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(errorData.error || 'Error iniciando chat', response.status);
    }

    return response.json();
  }

  async sendChatMessage(message: string, chatId: string) {
    return this.request('/analysis/chat/message', {
      method: 'POST',
      body: JSON.stringify({ message, chatId })
    });
  }

  // 🎨 GENERACIÓN CREATIVA
  async generateImage(prompt: string) {
    return this.request('/creative/generate', {
      method: 'POST',
      body: JSON.stringify({ prompt })
    });
  }

  async analyzeCreativeImage(imageUrl: string) {
    return this.request('/creative/analyze', {
      method: 'POST',
      body: JSON.stringify({ imageUrl })
    });
  }

  // 📊 UTILIDADES
  async healthCheck() {
    const response = await fetch(`${API_BASE}/health`);
    return response.json();
  }
}

// 🌟 INSTANCIA SINGLETON
export const apiService = new ApiService();

// 🔄 AUTO-REFRESH TOKEN
setInterval(async () => {
  try {
    await apiService.refreshToken();
  } catch (error) {
    // Token expirado, redirigir a login
    if (error instanceof ApiError && error.status === 401) {
      apiService.clearToken();
      window.location.href = '/login';
    }
  }
}, 23 * 60 * 60 * 1000); // 23 horas

export { ApiError };