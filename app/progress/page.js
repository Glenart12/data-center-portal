'use client';
import { useState, useEffect } from 'react';
import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';

function ProgressPage() {
  const [tasks, setTasks] = useState([]);
  const [parentTasks, setParentTasks] = useState([]);
  const [projectDates, setProjectDates] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  });
  const [showAddTask, setShowAddTask] = useState(false);
  const [showAddParent, setShowAddParent] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [editingParent, setEditingParent] = useState(null);

  // Load data from localStorage
  useEffect(() => {
    const savedTasks = localStorage.getItem('ganttTasks');
    const savedParents = localStorage.getItem('ganttParents');
    const savedDates = localStorage.getItem('ganttDates');
    
    if (savedTasks) setTasks(JSON.parse(savedTasks));
    if (savedParents) setParentTasks(JSON.parse(savedParents));
    if (savedDates) setProjectDates(JSON.parse(savedDates));
    else {
      // Initialize with sample data
      const today = new Date();
      const sampleParents = [
        { id: 1, name: 'MOP Development', startDate: today.toISOString().split('T')[0], endDate: new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] },
        { id: 2, name: 'SOP Procedures', startDate: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], endDate: new Date(today.getTime() + 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] },
        { id: 3, name: 'EOP Planning', startDate: new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], endDate: new Date(today.getTime() + 35 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] }
      ];
      
      const sampleTasks = [
        { id: 1, name: 'HVAC System Maintenance', parentId: 1, startDate: today.toISOString().split('T')[0], endDate: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], color: '#3B82F6' },
        { id: 2, name: 'Generator Testing', parentId: 1, startDate: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], endDate: new Date(today.getTime() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], color: '#10B981' },
        { id: 3, name: 'Daily Checklist', parentId: 2, startDate: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], endDate: new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], color: '#F59E0B' },
        { id: 4, name: 'Equipment Inventory', parentId: 2, startDate: new Date(today.getTime() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], endDate: new Date(today.getTime() + 17 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], color: '#EF4444' },
        { id: 5, name: 'Power Failure Response', parentId: 3, startDate: new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], endDate: new Date(today.getTime() + 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], color: '#8B5CF6' },
        { id: 6, name: 'Cooling System Failure', parentId: 3, startDate: new Date(today.getTime() + 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], endDate: new Date(today.getTime() + 28 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], color: '#EC4899' }
      ];
      
      setParentTasks(sampleParents);
      setTasks(sampleTasks);
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('ganttTasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('ganttParents', JSON.stringify(parentTasks));
  }, [parentTasks]);

  useEffect(() => {
    localStorage.setItem('ganttDates', JSON.stringify(projectDates));
  }, [projectDates]);

  // Generate timeline periods
  const generateTimeline = () => {
    const periods = [];
    const start = new Date(projectDates.startDate);
    const end = new Date(projectDates.endDate);
    
    let current = new Date(start);
    while (current < end) {
      const periodEnd = new Date(current);
      periodEnd.setDate(periodEnd.getDate() + 6);
      
      periods.push({
        start: new Date(current),
        end: periodEnd > end ? end : periodEnd,
        label: `${current.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}-${periodEnd.toLocaleDateString('en-US', { day: 'numeric' })}`
      });
      
      current.setDate(current.getDate() + 7);
    }
    
    return periods;
  };

  // Calculate bar position and width
  const calculateBarPosition = (startDate, endDate) => {
    const projectStart = new Date(projectDates.startDate);
    const projectEnd = new Date(projectDates.endDate);
    const projectDuration = (projectEnd - projectStart) / (1000 * 60 * 60 * 24);
    
    const taskStart = new Date(startDate);
    const taskEnd = new Date(endDate);
    
    const startOffset = (taskStart - projectStart) / (1000 * 60 * 60 * 24);
    const duration = (taskEnd - taskStart) / (1000 * 60 * 60 * 24) + 1;
    
    const left = (startOffset / projectDuration) * 100;
    const width = (duration / projectDuration) * 100;
    
    return { left: `${left}%`, width: `${width}%` };
  };

  // Add task handler
  const handleAddTask = (taskData) => {
    const newTask = {
      id: Date.now(),
      ...taskData
    };
    setTasks([...tasks, newTask]);
    setShowAddTask(false);
  };

  // Add parent handler
  const handleAddParent = (parentData) => {
    const newParent = {
      id: Date.now(),
      ...parentData
    };
    setParentTasks([...parentTasks, newParent]);
    setShowAddParent(false);
  };

  // Update task handler
  const handleUpdateTask = (taskData) => {
    setTasks(tasks.map(t => t.id === editingTask.id ? { ...t, ...taskData } : t));
    setEditingTask(null);
  };

  // Update parent handler
  const handleUpdateParent = (parentData) => {
    setParentTasks(parentTasks.map(p => p.id === editingParent.id ? { ...p, ...parentData } : p));
    setEditingParent(null);
  };

  // Delete task handler
  const handleDeleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
    setEditingTask(null);
  };

  // Delete parent handler
  const handleDeleteParent = (id) => {
    setTasks(tasks.filter(t => t.parentId !== id));
    setParentTasks(parentTasks.filter(p => p.id !== id));
    setEditingParent(null);
  };

  const timeline = generateTimeline();

  return (
    <div style={{ fontFamily: 'Century Gothic, sans-serif', padding: '32px' }}>
      <h1 style={{ color: '#0A1628', fontSize: '32px', marginBottom: '24px', fontWeight: 'bold' }}>
        Project Timeline
      </h1>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
        <button
            onClick={() => setShowAddTask(true)}
            style={{
              padding: '12px 24px',
              backgroundColor: '#2563EB',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '500'
            }}
          >
            Add Task
          </button>
          <button
            onClick={() => setShowAddParent(true)}
            style={{
              padding: '12px 24px',
              backgroundColor: '#0A1628',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '500'
            }}
          >
            Add Parent Task
          </button>
          <button
            onClick={() => setShowTimeline(true)}
            style={{
              padding: '12px 24px',
              backgroundColor: '#6B7280',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '500'
            }}
          >
            Timeline Settings
          </button>
      </div>

      {/* Gantt Chart */}
      <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        {/* Timeline Header */}
        <div style={{ display: 'flex', borderBottom: '2px solid #E5E7EB', paddingBottom: '16px', marginBottom: '24px' }}>
          {timeline.map((period, index) => (
                <div
                  key={index}
                  style={{
                    flex: 1,
                    textAlign: 'center',
                    fontSize: '12px',
                    color: '#6B7280',
                    borderLeft: index > 0 ? '1px solid #E5E7EB' : 'none',
                    paddingLeft: '4px'
                  }}
                >
                  {period.label}
                </div>
          ))}
        </div>

        {/* Tasks */}
        <div style={{ position: 'relative' }}>
          {parentTasks.map(parent => (
              <div key={parent.id}>
                {/* Parent Task */}
                <div style={{ position: 'relative', marginBottom: '8px', height: '40px' }}>
                  {/* Grid lines */}
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex' }}>
                      {timeline.map((_, index) => (
                        <div
                          key={index}
                          style={{
                            flex: 1,
                            borderLeft: index > 0 ? '1px solid #F3F4F6' : 'none'
                          }}
                        />
                      ))}
                  </div>
                  {/* Parent bar */}
                  <div
                    onClick={() => setEditingParent(parent)}
                    style={{
                      position: 'absolute',
                      top: '8px',
                        height: '24px',
                        backgroundColor: '#0A1628',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        paddingLeft: '8px',
                        color: 'white',
                        fontSize: '12px',
                        zIndex: 1,
                        ...calculateBarPosition(parent.startDate, parent.endDate)
                      }}
                    >
                      {parent.name}
                  </div>
                </div>

                {/* Child Tasks */}
                {tasks.filter(t => t.parentId === parent.id).map(task => (
                  <div key={task.id} style={{ position: 'relative', marginBottom: '8px', height: '36px', paddingLeft: '24px' }}>
                    {/* Grid lines */}
                    <div style={{ position: 'absolute', top: 0, left: '-24px', right: 0, bottom: 0, display: 'flex' }}>
                      {timeline.map((_, index) => (
                        <div
                          key={index}
                          style={{
                            flex: 1,
                            borderLeft: index > 0 ? '1px solid #F3F4F6' : 'none'
                          }}
                        />
                      ))}
                    </div>
                    {/* Task bar */}
                    <div
                      onClick={() => setEditingTask(task)}
                      style={{
                        position: 'absolute',
                        top: '8px',
                          height: '20px',
                          backgroundColor: task.color || '#3B82F6',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          paddingLeft: '8px',
                          color: 'white',
                          fontSize: '11px',
                          zIndex: 1,
                          ...calculateBarPosition(task.startDate, task.endDate)
                        }}
                      >
                        {task.name}
                    </div>
                  </div>
                ))}
              </div>
            ))}
        </div>
      </div>

      {/* Add Task Modal */}
      {showAddTask && (
        <TaskModal
          title="Add Task"
          task={{}}
          parentTasks={parentTasks}
          onSave={handleAddTask}
          onClose={() => setShowAddTask(false)}
        />
      )}

      {/* Edit Task Modal */}
      {editingTask && (
        <TaskModal
          title="Edit Task"
          task={editingTask}
          parentTasks={parentTasks}
          onSave={handleUpdateTask}
          onDelete={() => handleDeleteTask(editingTask.id)}
          onClose={() => setEditingTask(null)}
        />
      )}

      {/* Add Parent Modal */}
      {showAddParent && (
        <ParentModal
          title="Add Parent Task"
          parent={{}}
          onSave={handleAddParent}
          onClose={() => setShowAddParent(false)}
        />
      )}

      {/* Edit Parent Modal */}
      {editingParent && (
        <ParentModal
          title="Edit Parent Task"
          parent={editingParent}
          onSave={handleUpdateParent}
          onDelete={() => handleDeleteParent(editingParent.id)}
          onClose={() => setEditingParent(null)}
        />
      )}

      {/* Timeline Settings Modal */}
      {showTimeline && (
        <TimelineModal
          dates={projectDates}
          onSave={(dates) => {
            setProjectDates(dates);
            setShowTimeline(false);
          }}
          onClose={() => setShowTimeline(false)}
        />
      )}
    </div>
  );
}

// Task Modal Component
function TaskModal({ title, task, parentTasks, onSave, onDelete, onClose }) {
  const [formData, setFormData] = useState({
    name: task.name || '',
    parentId: task.parentId || '',
    startDate: task.startDate || new Date().toISOString().split('T')[0],
    endDate: task.endDate || new Date().toISOString().split('T')[0],
    color: task.color || '#3B82F6'
  });

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '32px',
        width: '500px',
        maxWidth: '90%'
      }}>
        <h2 style={{ color: '#0A1628', marginBottom: '24px', fontSize: '24px', fontWeight: 'bold' }}>{title}</h2>
        
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', color: '#374151', fontSize: '14px' }}>Task Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #D1D5DB',
              borderRadius: '4px',
              fontSize: '14px'
            }}
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', color: '#374151', fontSize: '14px' }}>Parent Task</label>
          <select
            value={formData.parentId}
            onChange={(e) => setFormData({ ...formData, parentId: parseInt(e.target.value) })}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #D1D5DB',
              borderRadius: '4px',
              fontSize: '14px'
            }}
          >
            <option value="">Select Parent Task</option>
            {parentTasks.map(parent => (
              <option key={parent.id} value={parent.id}>{parent.name}</option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#374151', fontSize: '14px' }}>Start Date</label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #D1D5DB',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#374151', fontSize: '14px' }}>End Date</label>
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #D1D5DB',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
          </div>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', marginBottom: '8px', color: '#374151', fontSize: '14px' }}>Color</label>
          <input
            type="color"
            value={formData.color}
            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
            style={{
              width: '60px',
              height: '40px',
              border: '1px solid #D1D5DB',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end' }}>
          {onDelete && (
            <button
              onClick={onDelete}
              style={{
                padding: '8px 16px',
                backgroundColor: '#EF4444',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                marginRight: 'auto'
              }}
            >
              Delete
            </button>
          )}
          <button
            onClick={onClose}
            style={{
              padding: '8px 16px',
              backgroundColor: '#E5E7EB',
              color: '#374151',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(formData)}
            style={{
              padding: '8px 16px',
              backgroundColor: '#2563EB',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

// Parent Modal Component
function ParentModal({ title, parent, onSave, onDelete, onClose }) {
  const [formData, setFormData] = useState({
    name: parent.name || '',
    startDate: parent.startDate || new Date().toISOString().split('T')[0],
    endDate: parent.endDate || new Date().toISOString().split('T')[0]
  });

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '32px',
        width: '500px',
        maxWidth: '90%'
      }}>
        <h2 style={{ color: '#0A1628', marginBottom: '24px', fontSize: '24px', fontWeight: 'bold' }}>{title}</h2>
        
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', color: '#374151', fontSize: '14px' }}>Parent Task Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #D1D5DB',
              borderRadius: '4px',
              fontSize: '14px'
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#374151', fontSize: '14px' }}>Start Date</label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #D1D5DB',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#374151', fontSize: '14px' }}>End Date</label>
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #D1D5DB',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end' }}>
          {onDelete && (
            <button
              onClick={onDelete}
              style={{
                padding: '8px 16px',
                backgroundColor: '#EF4444',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                marginRight: 'auto'
              }}
            >
              Delete
            </button>
          )}
          <button
            onClick={onClose}
            style={{
              padding: '8px 16px',
              backgroundColor: '#E5E7EB',
              color: '#374151',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(formData)}
            style={{
              padding: '8px 16px',
              backgroundColor: '#0A1628',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

// Timeline Settings Modal Component
function TimelineModal({ dates, onSave, onClose }) {
  const [formData, setFormData] = useState({
    startDate: dates.startDate,
    endDate: dates.endDate
  });

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '32px',
        width: '500px',
        maxWidth: '90%'
      }}>
        <h2 style={{ color: '#0A1628', marginBottom: '24px', fontSize: '24px', fontWeight: 'bold' }}>Timeline Settings</h2>
        
        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#374151', fontSize: '14px' }}>Project Start Date</label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #D1D5DB',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#374151', fontSize: '14px' }}>Project End Date</label>
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #D1D5DB',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            style={{
              padding: '8px 16px',
              backgroundColor: '#E5E7EB',
              color: '#374151',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(formData)}
            style={{
              padding: '8px 16px',
              backgroundColor: '#6B7280',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default withPageAuthRequired(ProgressPage);