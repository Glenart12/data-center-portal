'use client';

import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import { useState, useEffect } from 'react';

function Progress() {
  const [mounted, setMounted] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [showAddTask, setShowAddTask] = useState(false);
  const [showAddParent, setShowAddParent] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [columnWidth, setColumnWidth] = useState(80);
  
  const [projectSettings, setProjectSettings] = useState({
    startDate: '2025-01-01',
    endDate: '2025-04-30'
  });
  
  const [taskForm, setTaskForm] = useState({
    name: '',
    parentId: null,
    startDate: '',
    endDate: '',
    color: '#2563EB'
  });
  
  const [parentForm, setParentForm] = useState({
    name: '',
    startDate: '',
    endDate: ''
  });
  
  const colors = ['#0A1628', '#2563EB', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
  
  // Calculate date periods (7-day chunks)
  const getDatePeriods = () => {
    const periods = [];
    const start = new Date(projectSettings.startDate);
    const end = new Date(projectSettings.endDate);
    let current = new Date(start);
    
    while (current <= end) {
      const periodStart = new Date(current);
      const periodEnd = new Date(current);
      periodEnd.setDate(periodEnd.getDate() + 6);
      
      if (periodEnd > end) {
        periodEnd.setTime(end.getTime());
      }
      
      periods.push({
        start: periodStart,
        end: periodEnd,
        label: formatPeriodLabel(periodStart, periodEnd)
      });
      
      current.setDate(current.getDate() + 7);
    }
    
    return periods;
  };
  
  const formatPeriodLabel = (start, end) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const startMonth = months[start.getMonth()];
    const endMonth = months[end.getMonth()];
    const startDay = start.getDate();
    const endDay = end.getDate();
    
    if (start.getMonth() === end.getMonth()) {
      return `${startMonth} ${startDay}-${endDay}`;
    } else {
      return `${startMonth} ${startDay}-${endMonth} ${endDay}`;
    }
  };
  
  const getTaskPosition = (startDate, endDate) => {
    const projectStart = new Date(projectSettings.startDate);
    const projectEnd = new Date(projectSettings.endDate);
    const taskStart = new Date(startDate);
    const taskEnd = new Date(endDate);
    
    const totalDays = (projectEnd - projectStart) / (1000 * 60 * 60 * 24);
    const startDays = (taskStart - projectStart) / (1000 * 60 * 60 * 24);
    const duration = (taskEnd - taskStart) / (1000 * 60 * 60 * 24) + 1;
    
    const periods = getDatePeriods();
    const startPercent = (startDays / totalDays) * 100;
    const widthPercent = (duration / totalDays) * 100;
    
    return {
      left: `${startPercent}%`,
      width: `${widthPercent}%`
    };
  };
  
  // Default tasks with dates
  const getDefaultTasks = () => {
    const start = new Date(projectSettings.startDate);
    const end = new Date(projectSettings.endDate);
    const totalDays = (end - start) / (1000 * 60 * 60 * 24);
    const periodDays = totalDays / 4; // Divide into 4 quarters
    
    const mopStart = new Date(start);
    const mopEnd = new Date(start);
    mopEnd.setDate(mopEnd.getDate() + periodDays);
    
    const sopStart = new Date(mopEnd);
    sopStart.setDate(sopStart.getDate() + 1);
    const sopEnd = new Date(sopStart);
    sopEnd.setDate(sopEnd.getDate() + periodDays);
    
    const eopStart = new Date(sopEnd);
    eopStart.setDate(eopStart.getDate() + 1);
    const eopEnd = new Date(eopStart);
    eopEnd.setDate(eopEnd.getDate() + periodDays);
    
    return [
      // MOP Tasks
      { id: 1, name: 'ALL MOP WORK', type: 'parent', startDate: mopStart.toISOString().split('T')[0], endDate: mopEnd.toISOString().split('T')[0], color: '#0A1628' },
      { id: 2, name: 'MOP Planning', type: 'child', parentId: 1, startDate: mopStart.toISOString().split('T')[0], endDate: new Date(mopStart.getTime() + periodDays * 0.25 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], color: '#2563EB' },
      { id: 3, name: 'MOP Documentation', type: 'child', parentId: 1, startDate: new Date(mopStart.getTime() + periodDays * 0.25 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], endDate: new Date(mopStart.getTime() + periodDays * 0.5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], color: '#2563EB' },
      { id: 4, name: 'MOP Review', type: 'child', parentId: 1, startDate: new Date(mopStart.getTime() + periodDays * 0.5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], endDate: new Date(mopStart.getTime() + periodDays * 0.75 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], color: '#2563EB' },
      { id: 5, name: 'MOP Implementation', type: 'child', parentId: 1, startDate: new Date(mopStart.getTime() + periodDays * 0.75 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], endDate: mopEnd.toISOString().split('T')[0], color: '#2563EB' },
      
      // SOP Tasks
      { id: 6, name: 'ALL SOP WORK', type: 'parent', startDate: sopStart.toISOString().split('T')[0], endDate: sopEnd.toISOString().split('T')[0], color: '#0A1628' },
      { id: 7, name: 'SOP Development', type: 'child', parentId: 6, startDate: sopStart.toISOString().split('T')[0], endDate: new Date(sopStart.getTime() + periodDays * 0.3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], color: '#10B981' },
      { id: 8, name: 'SOP Testing', type: 'child', parentId: 6, startDate: new Date(sopStart.getTime() + periodDays * 0.3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], endDate: new Date(sopStart.getTime() + periodDays * 0.6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], color: '#10B981' },
      { id: 9, name: 'SOP Training', type: 'child', parentId: 6, startDate: new Date(sopStart.getTime() + periodDays * 0.6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], endDate: sopEnd.toISOString().split('T')[0], color: '#10B981' },
      
      // EOP Tasks
      { id: 10, name: 'ALL EOP WORK', type: 'parent', startDate: eopStart.toISOString().split('T')[0], endDate: eopEnd.toISOString().split('T')[0], color: '#0A1628' },
      { id: 11, name: 'EOP Assessment', type: 'child', parentId: 10, startDate: eopStart.toISOString().split('T')[0], endDate: new Date(eopStart.getTime() + periodDays * 0.33 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], color: '#EF4444' },
      { id: 12, name: 'EOP Procedures', type: 'child', parentId: 10, startDate: new Date(eopStart.getTime() + periodDays * 0.33 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], endDate: new Date(eopStart.getTime() + periodDays * 0.66 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], color: '#EF4444' },
      { id: 13, name: 'EOP Finalization', type: 'child', parentId: 10, startDate: new Date(eopStart.getTime() + periodDays * 0.66 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], endDate: eopEnd.toISOString().split('T')[0], color: '#EF4444' }
    ];
  };
  
  useEffect(() => {
    setMounted(true);
    
    // Load saved data
    const savedTasks = localStorage.getItem('ganttTasks');
    const savedSettings = localStorage.getItem('ganttSettings');
    
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setProjectSettings(settings);
    }
    
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    } else {
      setTasks(getDefaultTasks());
    }
  }, []);
  
  useEffect(() => {
    if (mounted && tasks.length > 0) {
      localStorage.setItem('ganttTasks', JSON.stringify(tasks));
    }
  }, [tasks, mounted]);
  
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('ganttSettings', JSON.stringify(projectSettings));
    }
  }, [projectSettings, mounted]);
  
  const handleAddTask = () => {
    const newId = Math.max(...tasks.map(t => t.id), 0) + 1;
    const newTask = {
      id: newId,
      name: taskForm.name,
      type: 'child',
      parentId: parseInt(taskForm.parentId),
      startDate: taskForm.startDate,
      endDate: taskForm.endDate,
      color: taskForm.color
    };
    
    // Update parent dates
    const updatedTasks = [...tasks, newTask];
    const parent = updatedTasks.find(t => t.id === parseInt(taskForm.parentId));
    if (parent) {
      const children = updatedTasks.filter(t => t.parentId === parent.id);
      const minDate = children.reduce((min, child) => child.startDate < min ? child.startDate : min, children[0].startDate);
      const maxDate = children.reduce((max, child) => child.endDate > max ? child.endDate : max, children[0].endDate);
      parent.startDate = minDate;
      parent.endDate = maxDate;
    }
    
    setTasks(updatedTasks);
    setShowAddTask(false);
    setTaskForm({ name: '', parentId: null, startDate: '', endDate: '', color: '#2563EB' });
  };
  
  const handleAddParent = () => {
    const newId = Math.max(...tasks.map(t => t.id), 0) + 1;
    const newParent = {
      id: newId,
      name: parentForm.name,
      type: 'parent',
      startDate: parentForm.startDate,
      endDate: parentForm.endDate,
      color: '#0A1628'
    };
    
    setTasks([...tasks, newParent]);
    setShowAddParent(false);
    setParentForm({ name: '', startDate: '', endDate: '' });
  };
  
  const handleEditTask = (task) => {
    setEditingTask(task);
    if (task.type === 'child') {
      setTaskForm({
        name: task.name,
        parentId: task.parentId,
        startDate: task.startDate,
        endDate: task.endDate,
        color: task.color
      });
    } else {
      setParentForm({
        name: task.name,
        startDate: task.startDate,
        endDate: task.endDate
      });
    }
  };
  
  const handleUpdateTask = () => {
    const updatedTasks = tasks.map(t => {
      if (t.id === editingTask.id) {
        if (t.type === 'child') {
          return { ...t, ...taskForm };
        } else {
          return { ...t, ...parentForm, color: '#0A1628' };
        }
      }
      return t;
    });
    
    // Update parent dates if child was edited
    if (editingTask.type === 'child') {
      const parent = updatedTasks.find(t => t.id === taskForm.parentId);
      if (parent) {
        const children = updatedTasks.filter(t => t.parentId === parent.id);
        const minDate = children.reduce((min, child) => child.startDate < min ? child.startDate : min, children[0].startDate);
        const maxDate = children.reduce((max, child) => child.endDate > max ? child.endDate : max, children[0].endDate);
        parent.startDate = minDate;
        parent.endDate = maxDate;
      }
    }
    
    setTasks(updatedTasks);
    setEditingTask(null);
  };
  
  const handleDeleteTask = () => {
    if (confirm(`Delete "${editingTask.name}"?`)) {
      const filteredTasks = tasks.filter(t => t.id !== editingTask.id && t.parentId !== editingTask.id);
      setTasks(filteredTasks);
      setEditingTask(null);
    }
  };
  
  if (!mounted) {
    return <div>Loading...</div>;
  }
  
  const periods = getDatePeriods();
  const parentTasks = tasks.filter(t => t.type === 'parent');
  
  return (
    <div style={{ padding: '24px', fontFamily: 'Century Gothic, sans-serif' }}>
      <h1 style={{ marginBottom: '24px' }}>Progress Tracking</h1>
      
      {/* Control Bar */}
      <div style={{ 
        display: 'flex', 
        gap: '12px', 
        marginBottom: '24px',
        padding: '16px',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        alignItems: 'center'
      }}>
        <button
          onClick={() => setShowAddTask(true)}
          style={{
            padding: '10px 20px',
            backgroundColor: '#2563EB',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Add Task
        </button>
        
        <button
          onClick={() => setShowAddParent(true)}
          style={{
            padding: '10px 20px',
            backgroundColor: '#8B5CF6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Add Parent Task
        </button>
        
        <button
          onClick={() => setShowSettings(true)}
          style={{
            padding: '10px 20px',
            backgroundColor: '#6B7280',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Timeline Settings
        </button>
        
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setColumnWidth(Math.max(50, columnWidth - 10))}
            style={{
              padding: '6px 12px',
              backgroundColor: 'white',
              color: '#6B7280',
              border: '1px solid #E5E7EB',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            Zoom Out -
          </button>
          <button
            onClick={() => setColumnWidth(Math.min(150, columnWidth + 10))}
            style={{
              padding: '6px 12px',
              backgroundColor: 'white',
              color: '#6B7280',
              border: '1px solid #E5E7EB',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            Zoom In +
          </button>
        </div>
      </div>
      
      {/* Gantt Chart */}
      <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        {/* Date Headers */}
        <div style={{ display: 'flex', borderBottom: '2px solid #E5E7EB', marginBottom: '20px' }}>
          {periods.map((period, index) => (
            <div
              key={index}
              style={{
                width: `${columnWidth}px`,
                padding: '10px 0',
                textAlign: 'center',
                borderRight: '1px solid #E5E7EB',
                fontSize: '12px',
                fontWeight: 'bold',
                color: '#374151'
              }}
            >
              {period.label}
            </div>
          ))}
        </div>
        
        {/* Tasks */}
        <div style={{ position: 'relative' }}>
          {parentTasks.map(parent => {
            const children = tasks.filter(t => t.parentId === parent.id);
            return (
              <div key={parent.id}>
                {/* Parent Task */}
                <div style={{ position: 'relative', height: '40px', marginBottom: '8px' }}>
                  <div
                    onClick={() => handleEditTask(parent)}
                    style={{
                      position: 'absolute',
                      ...getTaskPosition(parent.startDate, parent.endDate),
                      height: '32px',
                      backgroundColor: parent.color,
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      paddingLeft: '8px',
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '14px',
                      cursor: 'pointer',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                  >
                    {parent.name}
                  </div>
                </div>
                
                {/* Child Tasks */}
                {children.map(child => (
                  <div key={child.id} style={{ position: 'relative', height: '32px', marginBottom: '4px', marginLeft: '20px' }}>
                    <div
                      onClick={() => handleEditTask(child)}
                      style={{
                        position: 'absolute',
                        ...getTaskPosition(child.startDate, child.endDate),
                        height: '24px',
                        backgroundColor: child.color,
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        paddingLeft: '8px',
                        color: 'white',
                        fontSize: '12px',
                        cursor: 'pointer'
                      }}
                    >
                      {child.name}
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Add Task Modal */}
      {showAddTask && (
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
            padding: '24px',
            width: '400px'
          }}>
            <h2 style={{ marginBottom: '16px' }}>Add Task</h2>
            
            <input
              placeholder="Task Name"
              value={taskForm.name}
              onChange={(e) => setTaskForm({ ...taskForm, name: e.target.value })}
              style={{
                width: '100%',
                padding: '8px',
                marginBottom: '12px',
                border: '1px solid #E5E7EB',
                borderRadius: '4px'
              }}
            />
            
            <select
              value={taskForm.parentId}
              onChange={(e) => setTaskForm({ ...taskForm, parentId: e.target.value })}
              style={{
                width: '100%',
                padding: '8px',
                marginBottom: '12px',
                border: '1px solid #E5E7EB',
                borderRadius: '4px'
              }}
            >
              <option value="">Select Parent Task</option>
              {parentTasks.map(parent => (
                <option key={parent.id} value={parent.id}>{parent.name}</option>
              ))}
            </select>
            
            <input
              type="date"
              value={taskForm.startDate}
              onChange={(e) => setTaskForm({ ...taskForm, startDate: e.target.value })}
              style={{
                width: '100%',
                padding: '8px',
                marginBottom: '12px',
                border: '1px solid #E5E7EB',
                borderRadius: '4px'
              }}
            />
            
            <input
              type="date"
              value={taskForm.endDate}
              onChange={(e) => setTaskForm({ ...taskForm, endDate: e.target.value })}
              style={{
                width: '100%',
                padding: '8px',
                marginBottom: '12px',
                border: '1px solid #E5E7EB',
                borderRadius: '4px'
              }}
            />
            
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              {colors.map(color => (
                <div
                  key={color}
                  onClick={() => setTaskForm({ ...taskForm, color })}
                  style={{
                    width: '32px',
                    height: '32px',
                    backgroundColor: color,
                    borderRadius: '4px',
                    cursor: 'pointer',
                    border: taskForm.color === color ? '2px solid #000' : '2px solid transparent'
                  }}
                />
              ))}
            </div>
            
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  setShowAddTask(false);
                  setTaskForm({ name: '', parentId: null, startDate: '', endDate: '', color: '#2563EB' });
                }}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#F3F4F6',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleAddTask}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#2563EB',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Create Task
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Add Parent Task Modal */}
      {showAddParent && (
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
            padding: '24px',
            width: '400px'
          }}>
            <h2 style={{ marginBottom: '16px' }}>Add Parent Task</h2>
            
            <input
              placeholder="Parent Task Name"
              value={parentForm.name}
              onChange={(e) => setParentForm({ ...parentForm, name: e.target.value })}
              style={{
                width: '100%',
                padding: '8px',
                marginBottom: '12px',
                border: '1px solid #E5E7EB',
                borderRadius: '4px'
              }}
            />
            
            <input
              type="date"
              value={parentForm.startDate}
              onChange={(e) => setParentForm({ ...parentForm, startDate: e.target.value })}
              style={{
                width: '100%',
                padding: '8px',
                marginBottom: '12px',
                border: '1px solid #E5E7EB',
                borderRadius: '4px'
              }}
            />
            
            <input
              type="date"
              value={parentForm.endDate}
              onChange={(e) => setParentForm({ ...parentForm, endDate: e.target.value })}
              style={{
                width: '100%',
                padding: '8px',
                marginBottom: '12px',
                border: '1px solid #E5E7EB',
                borderRadius: '4px'
              }}
            />
            
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  setShowAddParent(false);
                  setParentForm({ name: '', startDate: '', endDate: '' });
                }}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#F3F4F6',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleAddParent}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#8B5CF6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Create Parent Task
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Edit Task Modal */}
      {editingTask && (
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
            padding: '24px',
            width: '400px'
          }}>
            <h2 style={{ marginBottom: '16px' }}>Edit {editingTask.type === 'parent' ? 'Parent Task' : 'Task'}</h2>
            
            <input
              placeholder="Name"
              value={editingTask.type === 'child' ? taskForm.name : parentForm.name}
              onChange={(e) => {
                if (editingTask.type === 'child') {
                  setTaskForm({ ...taskForm, name: e.target.value });
                } else {
                  setParentForm({ ...parentForm, name: e.target.value });
                }
              }}
              style={{
                width: '100%',
                padding: '8px',
                marginBottom: '12px',
                border: '1px solid #E5E7EB',
                borderRadius: '4px'
              }}
            />
            
            {editingTask.type === 'child' && (
              <select
                value={taskForm.parentId}
                onChange={(e) => setTaskForm({ ...taskForm, parentId: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px',
                  marginBottom: '12px',
                  border: '1px solid #E5E7EB',
                  borderRadius: '4px'
                }}
              >
                <option value="">Select Parent Task</option>
                {parentTasks.map(parent => (
                  <option key={parent.id} value={parent.id}>{parent.name}</option>
                ))}
              </select>
            )}
            
            <input
              type="date"
              value={editingTask.type === 'child' ? taskForm.startDate : parentForm.startDate}
              onChange={(e) => {
                if (editingTask.type === 'child') {
                  setTaskForm({ ...taskForm, startDate: e.target.value });
                } else {
                  setParentForm({ ...parentForm, startDate: e.target.value });
                }
              }}
              style={{
                width: '100%',
                padding: '8px',
                marginBottom: '12px',
                border: '1px solid #E5E7EB',
                borderRadius: '4px'
              }}
            />
            
            <input
              type="date"
              value={editingTask.type === 'child' ? taskForm.endDate : parentForm.endDate}
              onChange={(e) => {
                if (editingTask.type === 'child') {
                  setTaskForm({ ...taskForm, endDate: e.target.value });
                } else {
                  setParentForm({ ...parentForm, endDate: e.target.value });
                }
              }}
              style={{
                width: '100%',
                padding: '8px',
                marginBottom: '12px',
                border: '1px solid #E5E7EB',
                borderRadius: '4px'
              }}
            />
            
            {editingTask.type === 'child' && (
              <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                {colors.map(color => (
                  <div
                    key={color}
                    onClick={() => setTaskForm({ ...taskForm, color })}
                    style={{
                      width: '32px',
                      height: '32px',
                      backgroundColor: color,
                      borderRadius: '4px',
                      cursor: 'pointer',
                      border: taskForm.color === color ? '2px solid #000' : '2px solid transparent'
                    }}
                  />
                ))}
              </div>
            )}
            
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button
                onClick={handleDeleteTask}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#EF4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                🗑️ Delete
              </button>
              
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => setEditingTask(null)}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#F3F4F6',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateTask}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: editingTask.type === 'parent' ? '#8B5CF6' : '#2563EB',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Timeline Settings Modal */}
      {showSettings && (
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
            padding: '24px',
            width: '400px'
          }}>
            <h2 style={{ marginBottom: '16px' }}>Timeline Settings</h2>
            
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#374151' }}>
              Project Start Date
            </label>
            <input
              type="date"
              value={projectSettings.startDate}
              onChange={(e) => setProjectSettings({ ...projectSettings, startDate: e.target.value })}
              style={{
                width: '100%',
                padding: '8px',
                marginBottom: '16px',
                border: '1px solid #E5E7EB',
                borderRadius: '4px'
              }}
            />
            
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#374151' }}>
              Project End Date
            </label>
            <input
              type="date"
              value={projectSettings.endDate}
              onChange={(e) => setProjectSettings({ ...projectSettings, endDate: e.target.value })}
              style={{
                width: '100%',
                padding: '8px',
                marginBottom: '16px',
                border: '1px solid #E5E7EB',
                borderRadius: '4px'
              }}
            />
            
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowSettings(false)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#F3F4F6',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowSettings(false);
                  localStorage.setItem('ganttSettings', JSON.stringify(projectSettings));
                }}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#6B7280',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default withPageAuthRequired(Progress);