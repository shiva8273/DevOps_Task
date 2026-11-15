/**
 * API Service for communicating with the Django backend.
 * Uses the native fetch API for maximum simplicity and zero external dependencies.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

async function handleResponse(response) {
  if (response.status === 204) {
    return null;
  }
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    // Format error message from DRF validation dictionary or string
    let message = 'An error occurred';
    if (typeof data === 'object') {
      message = Object.entries(data)
        .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
        .join(' | ');
    } else if (typeof data === 'string') {
      message = data;
    }
    throw new Error(message || `Request failed with status ${response.status}`);
  }
  return data;
}

// Health check
export async function getHealth() {
  const res = await fetch(`${API_BASE_URL}/health/`);
  return handleResponse(res);
}

// Teacher API endpoints
export async function getTeachers(search = '') {
  const url = search 
    ? `${API_BASE_URL}/api/teachers/?search=${encodeURIComponent(search)}` 
    : `${API_BASE_URL}/api/teachers/`;
  const res = await fetch(url);
  return handleResponse(res);
}

export async function createTeacher(teacherData) {
  const res = await fetch(`${API_BASE_URL}/api/teachers/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(teacherData),
  });
  return handleResponse(res);
}

export async function updateTeacher(id, teacherData) {
  const res = await fetch(`${API_BASE_URL}/api/teachers/${id}/`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(teacherData),
  });
  return handleResponse(res);
}

export async function deleteTeacher(id) {
  const res = await fetch(`${API_BASE_URL}/api/teachers/${id}/`, {
    method: 'DELETE',
  });
  return handleResponse(res);
}

// Student API endpoints
export async function getStudents(search = '') {
  const url = search 
    ? `${API_BASE_URL}/api/students/?search=${encodeURIComponent(search)}` 
    : `${API_BASE_URL}/api/students/`;
  const res = await fetch(url);
  return handleResponse(res);
}

export async function createStudent(studentData) {
  const res = await fetch(`${API_BASE_URL}/api/students/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(studentData),
  });
  return handleResponse(res);
}

export async function updateStudent(id, studentData) {
  const res = await fetch(`${API_BASE_URL}/api/students/${id}/`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(studentData),
  });
  return handleResponse(res);
}

export async function deleteStudent(id) {
  const res = await fetch(`${API_BASE_URL}/api/students/${id}/`, {
    method: 'DELETE',
  });
  return handleResponse(res);
}
