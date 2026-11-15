import React from 'react';

export default function StudentsView({
  students,
  loading,
  onAddClick,
  onEditClick,
  onDeleteClick,
  searchTerm,
  setSearchTerm,
}) {
  return (
    <div className="section-card">
      <div className="section-header">
        <div>
          <h2>🎓 Students Management</h2>
          <p className="section-subtitle">Maintain student records, grades, and teacher assignments</p>
        </div>
        <button className="btn btn-primary" onClick={onAddClick}>
          ➕ Add Student
        </button>
      </div>

      <div className="table-controls">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search students by name, roll number, or grade..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="clear-btn" onClick={() => setSearchTerm('')}>
              &times;
            </button>
          )}
        </div>
        <div className="badge-count">
          Showing {students.length} student{students.length === 1 ? '' : 's'}
        </div>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading students...</p>
        </div>
      ) : students.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">🎒</span>
          <h3>No Students Found</h3>
          <p>{searchTerm ? 'Try adjusting your search query.' : 'Click "Add Student" to create your first student record.'}</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Roll Number</th>
                <th>Name</th>
                <th>Email</th>
                <th>Grade / Class</th>
                <th>Assigned Teacher</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id}>
                  <td><span className="id-badge">#{student.id}</span></td>
                  <td>
                    <span className="badge badge-roll">{student.roll_number}</span>
                  </td>
                  <td className="font-semibold">{student.name}</td>
                  <td>
                    <a href={`mailto:${student.email}`} className="text-link">
                      {student.email}
                    </a>
                  </td>
                  <td>
                    <span className="badge badge-grade">{student.grade}</span>
                  </td>
                  <td>
                    {student.teacher_name ? (
                      <span className="badge badge-teacher">👨‍🏫 {student.teacher_name}</span>
                    ) : (
                      <span className="text-muted">Unassigned</span>
                    )}
                  </td>
                  <td className="text-right actions-cell">
                    <button
                      className="btn-action btn-edit"
                      onClick={() => onEditClick(student)}
                      title="Edit Student"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      className="btn-action btn-delete"
                      onClick={() => onDeleteClick(student)}
                      title="Delete Student"
                    >
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
