/**
 * @typedef {'user' | 'admin'} Role
 */

/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} email
 * @property {string} name
 * @property {Role} role
 */

/**
 * @typedef {'pending' | 'in_progress' | 'resolved' | 'rejected'} ComplaintStatus
 */

/**
 * @typedef {'technical' | 'billing' | 'service' | 'other'} ComplaintCategory
 */

/**
 * @typedef {Object} Complaint
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {ComplaintCategory} category
 * @property {ComplaintStatus} status
 * @property {string} userId
 * @property {string} createdAt
 * @property {string} [updatedAt]
 * @property {string} [adminNotes]
 */

export const COMPLAINT_STATUSES = ['pending', 'in_progress', 'resolved', 'rejected']
export const COMPLAINT_CATEGORIES = [
  { value: 'technical', label: 'Technical' },
  { value: 'billing', label: 'Billing' },
  { value: 'service', label: 'Service' },
  { value: 'other', label: 'Other' },
]
