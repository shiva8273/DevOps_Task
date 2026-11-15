import React, { useState } from 'react';

export default function TeachersView({
  teachers,
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
          <h2>👨‍🏫 Teachers Management</h2>
          <p className="section-subtitle">Manage faculty members, departments, and course instructors</p>
        </div>
        <button className="btn btn-primary" onClick={onAddClick}>
          ➕ Add Teacher
        </button>
      </div>

      <div className="table-controls">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search teachers by name, subject, or email..."
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
          Showing {teachers.length} teacher{teachers.length === 1 ? '' : 's'}
        </div>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading teachers...</p>
        </div>
      ) : teachers.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">📋</span>
          <h3>No Teachers Found</h3>
          <p>{searchTerm ? 'Try adjusting your search criteria.' : 'Click "Add Teacher" above to add the first teacher.'}</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Subject</th>
                <th>Phone</th>
                <th>Students</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {teachers.map((teacher) => (
                <tr key={teacher.id}>
                  <td><span className="id-badge">#{teacher.id}</span></td>
                  <td className="font-semibold">{teacher.name}</td>
                  <td>
                    <a href={`mailto:${teacher.email}`} className="text-link">
                      {teacher.email}
                    </a>
                  </td>
                  <td>
                    <span className="badge badge-subject">{teacher.subject}</span>
                  </td>
                  <td>{teacher.phone || <span className="text-muted">—</span>}</td>
                  <td>
                    <span className="badge badge-count-small">
                      {teacher.students_count || 0} students
                    </span>
                  </td>
                  <td className="text-right actions-cell">
                    <button
                      className="btn-action btn-edit"
                      onClick={() => onEditClick(teacher)}
                      title="Edit Teacher"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      className="btn-action btn-delete"
                      onClick={() => onDeleteClick(teacher)}
                      title="Delete Teacher"
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
