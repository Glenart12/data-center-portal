'use client';

export default function AddTaskModal({ 
  showAddModal, 
  setShowAddModal,
  newTaskForm, 
  setNewTaskForm, 
  addNewTask, 
  tasks 
}) {
  if (!showAddModal) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '8px',
        padding: '32px',
        maxWidth: '500px',
        width: '90%',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        <h2 style={{
          color: '#0A1628',
          marginBottom: '24px',
          fontSize: '1.5rem'
        }}>
          Add New Task
        </h2>

        <div style={{ marginBottom: '16px' }}>
          <label style={{
            display: 'block',
            color: '#4A5568',
            marginBottom: '8px',
            fontSize: '14px',
            fontWeight: '600'
          }}>
            Task Type
          </label>
          <select
            value={newTaskForm.isParent ? 'parent' : 'child'}
            onChange={(e) => setNewTaskForm({ 
              ...newTaskForm, 
              isParent: e.target.value === 'parent',
              parentId: e.target.value === 'parent' ? '' : newTaskForm.parentId
            })}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: '4px',
              border: '1px solid #E2E8F0',
              fontSize: '14px',
              fontFamily: '"Century Gothic", sans-serif'
            }}
          >
            <option value="child">Child Task</option>
            <option value="parent">Parent Task</option>
          </select>
        </div>

        {!newTaskForm.isParent && (
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              color: '#4A5568',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: '600'
            }}>
              Parent Task
            </label>
            <select
              value={newTaskForm.parentId}
              onChange={(e) => setNewTaskForm({ ...newTaskForm, parentId: e.target.value })}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '4px',
                border: '1px solid #E2E8F0',
                fontSize: '14px',
                fontFamily: '"Century Gothic", sans-serif'
              }}
            >
              <option value="">No Parent (Standalone)</option>
              {tasks.filter(t => t.isParent).map(parent => (
                <option key={parent.id} value={parent.id}>{parent.name}</option>
              ))}
            </select>
          </div>
        )}

        <div style={{ marginBottom: '16px' }}>
          <label style={{
            display: 'block',
            color: '#4A5568',
            marginBottom: '8px',
            fontSize: '14px',
            fontWeight: '600'
          }}>
            Task Name
          </label>
          <input
            type="text"
            value={newTaskForm.name}
            onChange={(e) => setNewTaskForm({ ...newTaskForm, name: e.target.value })}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: '4px',
              border: '1px solid #E2E8F0',
              fontSize: '14px',
              fontFamily: '"Century Gothic", sans-serif'
            }}
            placeholder="Enter task name"
          />
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '16px',
          marginBottom: '16px'
        }}>
          <div>
            <label style={{
              display: 'block',
              color: '#4A5568',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: '600'
            }}>
              Start Week
            </label>
            <input
              type="number"
              min="1"
              max="16"
              value={newTaskForm.startWeek}
              onChange={(e) => setNewTaskForm({ 
                ...newTaskForm, 
                startWeek: parseInt(e.target.value) || 1 
              })}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '4px',
                border: '1px solid #E2E8F0',
                fontSize: '14px',
                fontFamily: '"Century Gothic", sans-serif'
              }}
            />
          </div>

          <div>
            <label style={{
              display: 'block',
              color: '#4A5568',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: '600'
            }}>
              End Week
            </label>
            <input
              type="number"
              min={newTaskForm.startWeek}
              max="16"
              value={newTaskForm.endWeek}
              onChange={(e) => setNewTaskForm({ 
                ...newTaskForm, 
                endWeek: parseInt(e.target.value) || newTaskForm.startWeek 
              })}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '4px',
                border: '1px solid #E2E8F0',
                fontSize: '14px',
                fontFamily: '"Century Gothic", sans-serif'
              }}
            />
          </div>
        </div>

        {!newTaskForm.isParent && (
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              color: '#4A5568',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: '600'
            }}>
              Task Color
            </label>
            <div style={{
              display: 'flex',
              gap: '8px',
              flexWrap: 'wrap'
            }}>
              {['#2196F3', '#FFC107', '#4CAF50', '#FF5722', '#9C27B0', '#00BCD4'].map(color => (
                <div
                  key={color}
                  onClick={() => setNewTaskForm({ ...newTaskForm, color })}
                  style={{
                    width: '48px',
                    height: '48px',
                    backgroundColor: color,
                    borderRadius: '4px',
                    cursor: 'pointer',
                    border: newTaskForm.color === color ? '3px solid #0A1628' : '1px solid #E2E8F0',
                    transition: 'all 0.2s ease'
                  }}
                />
              ))}
            </div>
          </div>
        )}

        <div style={{
          display: 'flex',
          gap: '16px',
          justifyContent: 'flex-end'
        }}>
          <button
            onClick={() => {
              setShowAddModal(false);
              setNewTaskForm({
                name: '',
                startWeek: 1,
                endWeek: 2,
                color: '#2196F3',
                isParent: false,
                parentId: '',
                completed: false
              });
            }}
            style={{
              padding: '8px 24px',
              borderRadius: '4px',
              border: '1px solid #E2E8F0',
              backgroundColor: '#FFFFFF',
              color: '#4A5568',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              fontFamily: '"Century Gothic", sans-serif',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#F9FAFB';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#FFFFFF';
            }}
          >
            Cancel
          </button>
          <button
            onClick={addNewTask}
            disabled={!newTaskForm.name}
            style={{
              padding: '8px 24px',
              borderRadius: '4px',
              border: 'none',
              backgroundColor: newTaskForm.name ? '#0A1628' : '#E2E8F0',
              color: newTaskForm.name ? '#FFFFFF' : '#9CA3AF',
              fontSize: '14px',
              fontWeight: '600',
              cursor: newTaskForm.name ? 'pointer' : 'not-allowed',
              fontFamily: '"Century Gothic", sans-serif',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              if (newTaskForm.name) {
                e.target.style.backgroundColor = '#0F1E36';
              }
            }}
            onMouseLeave={(e) => {
              if (newTaskForm.name) {
                e.target.style.backgroundColor = '#0A1628';
              }
            }}
          >
            Add Task
          </button>
        </div>
      </div>
    </div>
  );
}