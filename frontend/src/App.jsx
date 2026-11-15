import React, { useState, useEffect, useCallback } from 'react';
import {
  getHealth,
  getTeachers,
  createTeacher,
  updateTeacher,
  deleteTeacher,
  getStudents,
  createStudent,
  updateStudent,
  deleteStudent,
} from './services/api';

import TeachersView from './components/TeachersView';
import StudentsView from './components/StudentsView';
import TeacherModal from './components/TeacherModal';
import StudentModal from './components/StudentModal';

import './App.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('students');
  const [backendStatus, setBackendStatus] = useState('checking'); // 'connected' | 'disconnected' | 'checking'

  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  const [searchTeacher, setSearchTeacher] = useState('');
  const [searchStudent, setSearchStudent] = useState('');

  // Modals
  const [teacherModalOpen, setTeacherModalOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  const [studentModalOpen, setStudentModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Toast notifications
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Health check
  const checkBackendHealth = useCallback(async () => {
    try {
      await getHealth();
      setBackendStatus('connected');
    } catch {
      setBackendStatus('disconnected');
    }
  }, []);

  // Fetch teachers
  const loadTeachers = useCallback(async (search = '') => {
    try {
      setLoading(true);
      const data = await getTeachers(search);
      setTeachers(data);
    } catch (err) {
      showToast(err.message || 'Error fetching teachers', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch students
  const loadStudents = useCallback(async (search = '') => {
    try {
      setLoading(true);
      const data = await getStudents(search);
      setStudents(data);
    } catch (err) {
      showToast(err.message || 'Error fetching students', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkBackendHealth();
    loadTeachers();
    loadStudents();
  }, [checkBackendHealth, loadTeachers, loadStudents]);

  // Handle teacher search
  useEffect(() => {
    const timer = setTimeout(() => {
      loadTeachers(searchTeacher);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTeacher, loadTeachers]);

  // Handle student search
  useEffect(() => {
    const timer = setTimeout(() => {
      loadStudents(searchStudent);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchStudent, loadStudents]);

  // Teacher CRUD Handlers
  const handleSaveTeacher = async (data, id) => {
    if (id) {
      await updateTeacher(id, data);
      showToast('Teacher updated successfully!');
    } else {
      await createTeacher(data);
      showToast('Teacher created successfully!');
    }
    loadTeachers(searchTeacher);
    loadStudents(searchStudent);
  };

  const handleDeleteTeacher = async (teacher) => {
    if (window.confirm(`Are you sure you want to delete teacher "${teacher.name}"?`)) {
      try {
        await deleteTeacher(teacher.id);
        showToast('Teacher deleted successfully.');
        loadTeachers(searchTeacher);
        loadStudents(searchStudent);
      } catch (err) {
        showToast(err.message || 'Failed to delete teacher', 'error');
      }
    }
  };

  // Student CRUD Handlers
  const handleSaveStudent = async (data, id) => {
    if (id) {
      await updateStudent(id, data);
      showToast('Student updated successfully!');
    } else {
      await createStudent(data);
      showToast('Student created successfully!');
    }
    loadStudents(searchStudent);
    loadTeachers(searchTeacher);
  };

  const handleDeleteStudent = async (student) => {
    if (window.confirm(`Are you sure you want to delete student "${student.name}" (Roll: ${student.roll_number})?`)) {
      try {
        await deleteStudent(student.id);
        showToast('Student deleted successfully.');
        loadStudents(searchStudent);
        loadTeachers(searchTeacher);
      } catch (err) {
        showToast(err.message || 'Failed to delete student', 'error');
      }
    }
  };

  return (
    <div className="app-container">
      {toast && (
        <div className={`toast-notification toast-${toast.type}`}>
          <span>{toast.type === 'success' ? '✅' : '⚠️'}</span>
          <span>{toast.message}</span>
          <button onClick={() => setToast(null)}>&times;</button>
        </div>
      )}

      <header className="app-header">
        <div className="header-brand">
          <div className="brand-logo">🏫</div>
          <div>
            <h1>School Management System</h1>
          </div>
        </div>

        <div className="header-meta">

        </div>
      </header>

      <main className="main-content">
        <section className="stats-grid">
          <div className="stat-card" onClick={() => setActiveTab('students')}>
            <div className="stat-icon icon-students">🎓</div>
            <div className="stat-info">
              <span className="stat-value">{students.length}</span>
              <span className="stat-label">Total Students</span>
            </div>
          </div>

          <div className="stat-card" onClick={() => setActiveTab('teachers')}>
            <div className="stat-icon icon-teachers">👨‍🏫</div>
            <div className="stat-info">
              <span className="stat-value">{teachers.length}</span>
              <span className="stat-label">Total Faculty / Teachers</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon icon-subjects">📚</div>
            <div className="stat-info">
              <span className="stat-value">
                {new Set(teachers.map((t) => t.subject).filter(Boolean)).size}
              </span>
              <span className="stat-label">Unique Subjects</span>
            </div>
          </div>
        </section>

        <div className="tabs-bar">
          <button
            className={`tab-btn ${activeTab === 'students' ? 'active' : ''}`}
            onClick={() => setActiveTab('students')}
          >
            🎓 Students ({students.length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'teachers' ? 'active' : ''}`}
            onClick={() => setActiveTab('teachers')}
          >
            👨‍🏫 Teachers ({teachers.length})
          </button>
        </div>

        {activeTab === 'students' ? (
          <StudentsView
            students={students}
            loading={loading}
            searchTerm={searchStudent}
            setSearchTerm={setSearchStudent}
            onAddClick={() => {
              setSelectedStudent(null);
              setStudentModalOpen(true);
            }}
            onEditClick={(student) => {
              setSelectedStudent(student);
              setStudentModalOpen(true);
            }}
            onDeleteClick={handleDeleteStudent}
          />
        ) : (
          <TeachersView
            teachers={teachers}
            loading={loading}
            searchTerm={searchTeacher}
            setSearchTerm={setSearchTeacher}
            onAddClick={() => {
              setSelectedTeacher(null);
              setTeacherModalOpen(true);
            }}
            onEditClick={(teacher) => {
              setSelectedTeacher(teacher);
              setTeacherModalOpen(true);
            }}
            onDeleteClick={handleDeleteTeacher}
          />
        )}
      </main>

      <TeacherModal
        isOpen={teacherModalOpen}
        onClose={() => setTeacherModalOpen(false)}
        onSave={handleSaveTeacher}
        teacher={selectedTeacher}
      />

      <StudentModal
        isOpen={studentModalOpen}
        onClose={() => setStudentModalOpen(false)}
        onSave={handleSaveStudent}
        student={selectedStudent}
        teachers={teachers}
      />


    </div>
  );
}
