'use client';

export default function ImportPreviewModal({ 
  showImportModal, 
  setShowImportModal,
  importPreview, 
  setImportPreview,
  confirmImport 
}) {
  if (!showImportModal || !importPreview) return null;

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
        maxWidth: '600px',
        width: '90%',
        maxHeight: '80vh',
        overflowY: 'auto',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        <h2 style={{
          color: '#0A1628',
          marginBottom: '24px',
          fontSize: '1.5rem'
        }}>
          Import Timeline Preview
        </h2>

        <div style={{
          backgroundColor: '#F9FAFB',
          borderRadius: '6px',
          padding: '16px',
          marginBottom: '24px'
        }}>
          <p style={{
            fontSize: '14px',
            color: '#4A5568',
            margin: '0 0 8px 0'
          }}>
            <strong>Export Date:</strong> {new Date(importPreview.exportDate).toLocaleString()}
          </p>
          <p style={{
            fontSize: '14px',
            color: '#4A5568',
            margin: '0 0 8px 0'
          }}>
            <strong>Total Tasks:</strong> {importPreview.metadata?.totalTasks || importPreview.tasks.filter(t => !t.isParent).length}
          </p>
          <p style={{
            fontSize: '14px',
            color: '#4A5568',
            margin: 0
          }}>
            <strong>Completed:</strong> {importPreview.metadata?.completedTasks || importPreview.tasks.filter(t => !t.isParent && t.completed).length}
          </p>
        </div>

        <div style={{
          marginBottom: '24px'
        }}>
          <h3 style={{
            fontSize: '16px',
            color: '#0A1628',
            marginBottom: '12px'
          }}>
            Tasks to Import:
          </h3>
          <div style={{
            maxHeight: '200px',
            overflowY: 'auto',
            border: '1px solid #E2E8F0',
            borderRadius: '6px',
            padding: '12px'
          }}>
            {importPreview.tasks.map(task => (
              <div key={task.id} style={{
                padding: '4px 0',
                fontSize: '13px',
                color: task.isParent ? '#0A1628' : '#4A5568',
                fontWeight: task.isParent ? 'bold' : 'normal',
                paddingLeft: task.isParent ? '0' : '20px'
              }}>
                {task.name} (Week {task.startWeek}-{task.endWeek})
                {task.completed && ' ✅'}
              </div>
            ))}
          </div>
        </div>

        <div style={{
          backgroundColor: '#FFF3E0',
          borderRadius: '6px',
          padding: '12px',
          marginBottom: '24px'
        }}>
          <p style={{
            fontSize: '13px',
            color: '#E65100',
            margin: 0,
            fontWeight: '600'
          }}>
            ⚠️ Warning: Importing will replace all current tasks!
          </p>
        </div>

        <div style={{
          display: 'flex',
          gap: '16px',
          justifyContent: 'flex-end'
        }}>
          <button
            onClick={() => {
              setShowImportModal(false);
              setImportPreview(null);
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
            onClick={confirmImport}
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
            Import Tasks
          </button>
        </div>
      </div>
    </div>
  );
}