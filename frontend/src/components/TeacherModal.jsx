import React, { useState, useEffect } from 'react';

export default function TeacherModal({ isOpen, onClose, onSave, teacher }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    phone: '',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (teacher) {
      setFormData({
        name: teacher.name || '',
        email: teacher.email || '',
        subject: teacher.subject || '',
        phone: teacher.phone || '',
      });
    } else {
      setFormData({
        name: '',
        email: '',
        subject: '',
        phone: '',
      });
    }
    setError('');
  }, [teacher, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.subject.trim()) {
      setError('Please fill in all required fields (Name, Email, and Subject).');
      return;
    }
    setIsSubmitting(true);
    setError('');
    try {
      await onSave(formData, teacher ? teacher.id : null);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save teacher');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{teacher ? '✏️ Edit Teacher' : '➕ Add New Teacher'}</h3>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        {error && <div className="alert-box alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Full Name <span className="req">*</span></label>
            <input
              type="text"
              name="name"
              placeholder="e.g. Dr. John Watson"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email Address <span className="req">*</span></label>
            <input
              type="email"
              name="email"
              placeholder="e.g. jwatson@school.edu"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Subject / Department <span className="req">*</span></label>
            <input
              type="text"
              name="subject"
              placeholder="e.g. Biology, Mathematics, History"
              value={formData.subject}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="text"
              name="phone"
              placeholder="e.g. +1 555-0142"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : teacher ? 'Update Teacher' : 'Create Teacher'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
