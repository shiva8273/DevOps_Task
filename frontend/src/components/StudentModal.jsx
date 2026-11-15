import React, { useState, useEffect } from 'react';

export default function StudentModal({ isOpen, onClose, onSave, student, teachers }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    roll_number: '',
    grade: '',
    teacher: '',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name || '',
        email: student.email || '',
        roll_number: student.roll_number || '',
        grade: student.grade || '',
        teacher: student.teacher ? String(student.teacher) : '',
      });
    } else {
      setFormData({
        name: '',
        email: '',
        roll_number: '',
        grade: '',
        teacher: '',
      });
    }
    setError('');
  }, [student, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.roll_number.trim() || !formData.grade.trim()) {
      setError('Please fill in Name, Email, Roll Number, and Grade.');
      return;
    }
    setIsSubmitting(true);
    setError('');
    try {
      const payload = {
        ...formData,
        teacher: formData.teacher ? Number(formData.teacher) : null,
      };
      await onSave(payload, student ? student.id : null);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save student');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{student ? '✏️ Edit Student' : '➕ Add New Student'}</h3>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        {error && <div className="alert-box alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Student Name <span className="req">*</span></label>
            <input
              type="text"
              name="name"
              placeholder="e.g. Alice Johnson"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Email Address <span className="req">*</span></label>
              <input
                type="email"
                name="email"
                placeholder="e.g. alice@school.edu"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Roll Number <span className="req">*</span></label>
              <input
                type="text"
                name="roll_number"
                placeholder="e.g. CS-201"
                value={formData.roll_number}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Grade / Class <span className="req">*</span></label>
              <input
                type="text"
                name="grade"
                placeholder="e.g. 10th Grade"
                value={formData.grade}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Assigned Teacher</label>
              <select
                name="teacher"
                value={formData.teacher}
                onChange={handleChange}
              >
                <option value="">-- None (Unassigned) --</option>
                {teachers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.subject})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : student ? 'Update Student' : 'Create Student'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
