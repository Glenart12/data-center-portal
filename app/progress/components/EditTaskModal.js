'use client';

export default function EditTaskModal({ 
  editingTask, 
  editForm, 
  setEditForm, 
  saveTask, 
  deleteTask, 
  cancelEdit 
}) {
  if (!editingTask) return null;

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
          Edit Task
        </h2>

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
            value={editForm.name}
            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: '4px',
              border: '1px solid #E2E8F0',
              fontSize: '14px',
              fontFamily: '"Century Gothic", "Questrial", -apple-system, sans-serif'
            }}
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
              value={editForm.startWeek}
              onChange={(e) => setEditForm({ 
                ...editForm, 
                startWeek: parseInt(e.target.value) || 1 
              })}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '4px',
                border: '1px solid #E2E8F0',
                fontSize: '14px',
                fontFamily: '"Century Gothic", "Questrial", -apple-system, sans-serif'
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
              min={editForm.startWeek}
              max="16"
              value={editForm.endWeek}
              onChange={(e) => setEditForm({ 
                ...editForm, 
                endWeek: parseInt(e.target.value) || editForm.startWeek 
              })}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '4px',
                border: '1px solid #E2E8F0',
                fontSize: '14px',
                fontFamily: '"Century Gothic", "Questrial", -apple-system, sans-serif'
              }}
            />
          </div>
        </div>

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
                onClick={() => setEditForm({ ...editForm, color })}
                style={{
                  width: '48px',
                  height: '48px',
                  backgroundColor: color,
                  borderRadius: '4px',
                  cursor: 'pointer',
                  border: editForm.color === color ? '3px solid #0A1628' : '1px solid #E2E8F0',
                  transition: 'all 0.2s ease'
                }}
              />
            ))}
          </div>
        </div>

        <div style={{
          display: 'flex',
          gap: '16px',
          justifyContent: 'space-between'
        }}>
          <button
            onClick={deleteTask}
            style={{
              padding: '8px 24px',
              borderRadius: '4px',
              border: 'none',
              backgroundColor: '#DC2626',
              color: '#FFFFFF',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              fontFamily: '"Century Gothic", "Questrial", -apple-system, sans-serif',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#B91C1C';
              e.target.style.transform = 'translateY(-1px)';
              e.target.style.boxShadow = '0 4px 12px rgba(220, 38, 38, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#DC2626';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
          >
            🗑️ Delete Task
          </button>
          
          <div style={{
            display: 'flex',
            gap: '16px'
          }}>
            <button
              onClick={cancelEdit}
              style={{
                padding: '8px 24px',
                borderRadius: '4px',
                border: '1px solid #E2E8F0',
                backgroundColor: '#FFFFFF',
                color: '#4A5568',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                fontFamily: '"Century Gothic", "Questrial", -apple-system, sans-serif',
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
              onClick={saveTask}
              style={{
                padding: '8px 24px',
                borderRadius: '4px',
                border: 'none',
                backgroundColor: '#0A1628',
                color: '#FFFFFF',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                fontFamily: '"Century Gothic", "Questrial", -apple-system, sans-serif',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#0F1E36';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#0A1628';
              }}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}