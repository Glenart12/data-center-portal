'use client';

import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import { useState, useEffect } from 'react';

function Progress() {
  const [mounted, setMounted] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    startWeek: 1,
    endWeek: 1,
    color: '#4A90E2'
  });
  const [creatingTask, setCreatingTask] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: '',
    parentId: 1,
    startWeek: 1,
    endWeek: 1,
    color: '#4A90E2',
    completed: false
  });
  const [creatingDependency, setCreatingDependency] = useState(false);
  const [dependencyForm, setDependencyForm] = useState({
    name: '',
    startWeek: 1,
    endWeek: 8
  });
  const [showSettings, setShowSettings] = useState(false);
  const [projectSettings, setProjectSettings] = useState({
    startDate: new Date('2025-01-01').toISOString().split('T')[0],
    endDate: new Date('2025-04-30').toISOString().split('T')[0],
    displayMode: 'weeks' // 'weeks' or 'dates'
  });
  const [zoomLevel, setZoomLevel] = useState(75); // Default 75px per week

  const defaultTasks = [
    // MOP Parent and Children
    { id: 1, name: 'ALL MOP WORK', type: 'parent', startWeek: 1, endWeek: 8, color: '#0A1628', completed: false },
    { id: 2, name: 'MOP Planning', type: 'child', parentId: 1, startWeek: 1, endWeek: 2, color: '#4A90E2', completed: false },
    { id: 3, name: 'MOP Documentation', type: 'child', parentId: 1, startWeek: 2, endWeek: 4, color: '#4A90E2', completed: false },
    { id: 4, name: 'MOP Review', type: 'child', parentId: 1, startWeek: 4, endWeek: 6, color: '#4A90E2', completed: false },
    { id: 5, name: 'MOP Implementation', type: 'child', parentId: 1, startWeek: 6, endWeek: 8, color: '#4A90E2', completed: false },
    
    // SOP Parent and Children
    { id: 6, name: 'ALL SOP WORK', type: 'parent', startWeek: 8, endWeek: 12, color: '#0A1628', completed: false },
    { id: 7, name: 'SOP Development', type: 'child', parentId: 6, startWeek: 8, endWeek: 9, color: '#50C878', completed: false },
    { id: 8, name: 'SOP Testing', type: 'child', parentId: 6, startWeek: 9, endWeek: 10, color: '#50C878', completed: false },
    { id: 9, name: 'SOP Training', type: 'child', parentId: 6, startWeek: 10, endWeek: 11, color: '#50C878', completed: false },
    { id: 10, name: 'SOP Deployment', type: 'child', parentId: 6, startWeek: 11, endWeek: 12, color: '#50C878', completed: false },
    
    // EOP Parent and Children
    { id: 11, name: 'ALL EOP WORK', type: 'parent', startWeek: 12, endWeek: 16, color: '#0A1628', completed: false },
    { id: 12, name: 'EOP Assessment', type: 'child', parentId: 11, startWeek: 12, endWeek: 13, color: '#FF6B6B', completed: false },
    { id: 13, name: 'EOP Procedures', type: 'child', parentId: 11, startWeek: 13, endWeek: 14, color: '#FF6B6B', completed: false },
    { id: 14, name: 'EOP Drills', type: 'child', parentId: 11, startWeek: 14, endWeek: 15, color: '#FF6B6B', completed: false },
    { id: 15, name: 'EOP Finalization', type: 'child', parentId: 11, startWeek: 15, endWeek: 16, color: '#FF6B6B', completed: false }
  ];

  useEffect(() => {
    setMounted(true);
    
    // Load tasks from localStorage if they exist
    const savedTasks = localStorage.getItem('ganttChartTasks');
    if (savedTasks) {
      try {
        const parsedTasks = JSON.parse(savedTasks);
        setTasks(parsedTasks);
      } catch (error) {
        console.error('Error loading saved tasks:', error);
        setTasks(defaultTasks);
      }
    } else {
      setTasks(defaultTasks);
    }
    
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('ganttChartSettings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setProjectSettings(parsedSettings);
      } catch (error) {
        console.error('Error loading saved settings:', error);
      }
    }
  }, []);

  if (!mounted) {
    return <div>Loading...</div>;
  }

  const weeks = Array.from({ length: 16 }, (_, i) => i + 1);
  const weekWidth = zoomLevel;
  const chartWidth = weekWidth * 16;
  const rowHeight = 30;
  const headerHeight = 40;
  
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(120, prev + 10));
  };
  
  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(40, prev - 10));
  };
  
  const handleTaskClick = (task) => {
    setEditingTask(task);
    setEditForm({
      name: task.name,
      startWeek: task.startWeek,
      endWeek: task.endWeek,
      color: task.color
    });
  };
  
  const handleSaveEdit = () => {
    const updatedTasks = tasks.map(task => {
      if (task.id === editingTask.id) {
        return {
          ...task,
          name: editForm.name,
          startWeek: parseInt(editForm.startWeek),
          endWeek: parseInt(editForm.endWeek),
          color: editForm.color
        };
      }
      return task;
    });
    
    // Update parent task dates based on children
    const finalTasks = updatedTasks.map(task => {
      if (task.type === 'parent') {
        const children = updatedTasks.filter(t => t.parentId === task.id);
        if (children.length > 0) {
          const minStart = Math.min(...children.map(c => c.startWeek));
          const maxEnd = Math.max(...children.map(c => c.endWeek));
          return { ...task, startWeek: minStart, endWeek: maxEnd };
        }
      }
      return task;
    });
    
    setTasks(finalTasks);
    // Auto-save to localStorage
    localStorage.setItem('ganttChartTasks', JSON.stringify(finalTasks));
    setEditingTask(null);
    setEditForm({ name: '', startWeek: 1, endWeek: 1, color: '#4A90E2' });
  };
  
  const handleCancelEdit = () => {
    setEditingTask(null);
    setEditForm({ name: '', startWeek: 1, endWeek: 1, color: '#4A90E2' });
  };
  
  const getDateFromWeek = (weekNumber) => {
    if (projectSettings.displayMode === 'weeks') {
      return `Week ${weekNumber}`;
    }
    
    const startDate = new Date(projectSettings.startDate);
    const endDate = new Date(projectSettings.endDate);
    const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    const daysPerWeek = totalDays / 16;
    
    const weekStart = new Date(startDate);
    weekStart.setDate(startDate.getDate() + Math.floor((weekNumber - 1) * daysPerWeek));
    const weekEnd = new Date(startDate);
    weekEnd.setDate(startDate.getDate() + Math.floor(weekNumber * daysPerWeek) - 1);
    
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    if (weekStart.getMonth() === weekEnd.getMonth()) {
      return `${monthNames[weekStart.getMonth()]} ${weekStart.getDate()}-${weekEnd.getDate()}`;
    } else {
      return `${monthNames[weekStart.getMonth()]} ${weekStart.getDate()} - ${monthNames[weekEnd.getMonth()]} ${weekEnd.getDate()}`;
    }
  };
  
  const handleCreateDependency = () => {
    const newId = Math.max(...tasks.map(t => t.id), 0) + 1;
    const newDependency = {
      id: newId,
      name: dependencyForm.name,
      type: 'parent',
      startWeek: parseInt(dependencyForm.startWeek),
      endWeek: parseInt(dependencyForm.endWeek),
      color: '#0A1628',
      completed: false
    };
    
    const newTasks = [...tasks, newDependency];
    setTasks(newTasks);
    localStorage.setItem('ganttChartTasks', JSON.stringify(newTasks));
    setCreatingDependency(false);
    setDependencyForm({ name: '', startWeek: 1, endWeek: 8 });
  };
  
  const handleSaveSettings = () => {
    localStorage.setItem('ganttChartSettings', JSON.stringify(projectSettings));
    setShowSettings(false);
  };
  
  const updateParentTasks = (taskList) => {
    return taskList.map(task => {
      if (task.type === 'parent') {
        const children = taskList.filter(t => t.parentId === task.id);
        if (children.length > 0) {
          const minStart = Math.min(...children.map(c => c.startWeek));
          const maxEnd = Math.max(...children.map(c => c.endWeek));
          const allCompleted = children.every(c => c.completed);
          return { ...task, startWeek: minStart, endWeek: maxEnd, completed: allCompleted };
        }
      }
      return task;
    });
  };
  
  const handleDeleteTask = () => {
    if (confirm(`Are you sure you want to delete "${editingTask.name}"?`)) {
      const filteredTasks = tasks.filter(task => task.id !== editingTask.id);
      const updatedTasks = updateParentTasks(filteredTasks);
      setTasks(updatedTasks);
      localStorage.setItem('ganttChartTasks', JSON.stringify(updatedTasks));
      setEditingTask(null);
      setEditForm({ name: '', startWeek: 1, endWeek: 1, color: '#4A90E2' });
    }
  };
  
  const handleCreateTask = () => {
    const newId = Math.max(...tasks.map(t => t.id)) + 1;
    const newTask = {
      id: newId,
      name: createForm.name,
      type: 'child',
      parentId: parseInt(createForm.parentId),
      startWeek: parseInt(createForm.startWeek),
      endWeek: parseInt(createForm.endWeek),
      color: createForm.color,
      completed: false
    };
    
    const newTasks = [...tasks, newTask];
    const updatedTasks = updateParentTasks(newTasks);
    setTasks(updatedTasks);
    localStorage.setItem('ganttChartTasks', JSON.stringify(updatedTasks));
    setCreatingTask(false);
    setCreateForm({ name: '', parentId: 1, startWeek: 1, endWeek: 1, color: '#4A90E2', completed: false });
  };
  
  const handleToggleComplete = (taskId) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        return { ...task, completed: !task.completed };
      }
      return task;
    });
    
    const finalTasks = updateParentTasks(updatedTasks);
    setTasks(finalTasks);
    localStorage.setItem('ganttChartTasks', JSON.stringify(finalTasks));
  };
  
  const presetColors = ['#4A90E2', '#50C878', '#FF6B6B', '#FFD700', '#9B59B6', '#FF8C00', '#00CED1'];

  return (
    <div style={{ padding: '24px' }}>
      <h1 style={{ fontFamily: 'Century Gothic, sans-serif', marginBottom: '24px' }}>Progress Tracking</h1>
      
      <div style={{ 
        backgroundColor: 'white', 
        padding: '24px', 
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontFamily: 'Century Gothic, sans-serif', margin: 0 }}>Project Gantt Chart</h2>
          
          {/* Zoom Controls */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: '#6B7280', fontFamily: 'Century Gothic, sans-serif' }}>Zoom:</span>
            <button
              onClick={handleZoomOut}
              style={{
                padding: '4px 8px',
                borderRadius: '4px',
                border: '1px solid #E5E7EB',
                backgroundColor: 'white',
                color: '#6B7280',
                fontSize: '12px',
                fontFamily: 'Century Gothic, sans-serif',
                cursor: zoomLevel > 40 ? 'pointer' : 'not-allowed',
                opacity: zoomLevel > 40 ? 1 : 0.5,
                transition: 'all 0.2s'
              }}
              disabled={zoomLevel <= 40}
              onMouseEnter={(e) => { if (zoomLevel > 40) e.target.style.backgroundColor = '#F9FAFB'; }}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
            >
              - Zoom Out
            </button>
            <button
              onClick={handleZoomIn}
              style={{
                padding: '4px 8px',
                borderRadius: '4px',
                border: '1px solid #E5E7EB',
                backgroundColor: 'white',
                color: '#6B7280',
                fontSize: '12px',
                fontFamily: 'Century Gothic, sans-serif',
                cursor: zoomLevel < 120 ? 'pointer' : 'not-allowed',
                opacity: zoomLevel < 120 ? 1 : 0.5,
                transition: 'all 0.2s'
              }}
              disabled={zoomLevel >= 120}
              onMouseEnter={(e) => { if (zoomLevel < 120) e.target.style.backgroundColor = '#F9FAFB'; }}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
            >
              + Zoom In
            </button>
          </div>
        </div>
        
        {/* Control Bar */}
        <div style={{
          display: 'flex',
          gap: '12px',
          marginBottom: '20px',
          padding: '12px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          alignItems: 'center'
        }}>
          <button
            onClick={() => setCreatingTask(true)}
            style={{
              padding: '10px 20px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: '#007bff',
              color: 'white',
              fontFamily: 'Century Gothic, sans-serif',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#0056b3'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#007bff'}
          >
            ➕ Add Task
          </button>
          
          <button
            onClick={() => setCreatingDependency(true)}
            style={{
              padding: '10px 20px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: '#9C27B0',
              color: 'white',
              fontFamily: 'Century Gothic, sans-serif',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#7B1FA2'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#9C27B0'}
          >
            🔗 Add Dependency
          </button>
          
          <button
            onClick={() => setShowSettings(true)}
            style={{
              padding: '10px 20px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: '#6B7280',
              color: 'white',
              fontFamily: 'Century Gothic, sans-serif',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#4B5563'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#6B7280'}
          >
            ⚙️ Timeline Settings
          </button>
          
          <div style={{
            marginLeft: 'auto',
            fontSize: '12px',
            color: '#6c757d',
            fontFamily: 'Century Gothic, sans-serif'
          }}>
            All changes are auto-saved
          </div>
        </div>
        
        <div style={{ 
          overflowX: 'auto',
          overflowY: 'hidden',
          border: '1px solid #e0e0e0',
          borderRadius: '8px',
          maxHeight: '600px'
        }}>
          {/* Chart Container */}
          <div style={{ minWidth: `${chartWidth}px`, position: 'relative' }}>
            
            {/* Week Headers */}
            <div style={{ 
              display: 'flex', 
              borderBottom: '2px solid #333',
              backgroundColor: '#f5f5f5'
            }}>
              {weeks.map(week => (
                <div key={week} style={{
                  width: `${weekWidth}px`,
                  height: `${headerHeight}px`,
                  borderRight: '1px solid #ddd',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  fontSize: '12px',
                  fontFamily: 'Century Gothic, sans-serif'
                }}>
                  {getDateFromWeek(week)}
                </div>
              ))}
            </div>
            
            {/* Tasks */}
            <div style={{ position: 'relative' }}>
              {tasks.map((task, index) => {
                const taskLeft = (task.startWeek - 1) * weekWidth;
                const taskWidth = (task.endWeek - task.startWeek + 1) * weekWidth;
                const taskTop = index * rowHeight;
                
                return (
                  <div key={task.id} style={{ position: 'relative', height: `${rowHeight}px` }}>
                    {/* Grid lines */}
                    {weeks.map(week => (
                      <div key={week} style={{
                        position: 'absolute',
                        left: `${(week - 1) * weekWidth}px`,
                        width: `${weekWidth}px`,
                        height: '100%',
                        borderRight: '1px solid #e0e0e0',
                        borderBottom: '1px solid #f0f0f0'
                      }} />
                    ))}
                    
                    {/* Checkbox for child tasks only */}
                    {task.type === 'child' && (
                      <input
                        type="checkbox"
                        checked={task.completed || false}
                        onChange={() => handleToggleComplete(task.id)}
                        style={{
                          position: 'absolute',
                          left: `${taskLeft - 20}px`,
                          top: '8px',
                          cursor: 'pointer',
                          zIndex: 1
                        }}
                      />
                    )}
                    
                    {/* Task bar */}
                    <div 
                      onClick={() => handleTaskClick(task)}
                      style={{
                        position: 'absolute',
                        left: `${taskLeft}px`,
                        top: '5px',
                        width: `${taskWidth - 4}px`,
                        height: '20px',
                        backgroundColor: task.completed ? '#9ca3af' : task.color,
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        paddingLeft: '8px',
                        fontSize: task.type === 'parent' ? '12px' : '11px',
                        fontWeight: task.type === 'parent' ? 'bold' : 'normal',
                        color: 'white',
                        fontFamily: 'Century Gothic, sans-serif',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis',
                        marginLeft: task.type === 'child' ? '20px' : '0',
                        boxShadow: task.type === 'parent' ? '0 2px 4px rgba(0,0,0,0.2)' : '0 1px 2px rgba(0,0,0,0.1)',
                        cursor: 'pointer',
                        transition: 'opacity 0.2s',
                        textDecoration: task.completed ? 'line-through' : 'none',
                        opacity: task.completed ? 0.7 : 1
                      }}
                      onMouseEnter={(e) => {
                        if (!task.completed) {
                          e.currentTarget.style.opacity = '0.9';
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.opacity = task.completed ? '0.7' : '1';
                      }}
                    >
                      {task.name}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        
        {/* Legend */}
        <div style={{ 
          marginTop: '24px', 
          display: 'flex', 
          gap: '20px',
          fontFamily: 'Century Gothic, sans-serif',
          fontSize: '14px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '20px', height: '20px', backgroundColor: '#0A1628', borderRadius: '4px' }}></div>
            <span>Parent Tasks</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '20px', height: '20px', backgroundColor: '#4A90E2', borderRadius: '4px' }}></div>
            <span>MOP Tasks</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '20px', height: '20px', backgroundColor: '#50C878', borderRadius: '4px' }}></div>
            <span>SOP Tasks</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '20px', height: '20px', backgroundColor: '#FF6B6B', borderRadius: '4px' }}></div>
            <span>EOP Tasks</span>
          </div>
        </div>
      </div>
      
      {/* Edit Modal */}
      {editingTask && (
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
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            minWidth: '400px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.2)'
          }}>
            <h3 style={{ 
              fontFamily: 'Century Gothic, sans-serif', 
              marginBottom: '20px',
              color: '#0A1628'
            }}>
              Edit Task
            </h3>
            
            {/* Task Name Input */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '4px',
                fontSize: '14px',
                fontFamily: 'Century Gothic, sans-serif'
              }}>
                Task Name
              </label>
              <input
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid #ddd',
                  fontFamily: 'Century Gothic, sans-serif'
                }}
              />
            </div>
            
            {/* Start Week Input */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '4px',
                fontSize: '14px',
                fontFamily: 'Century Gothic, sans-serif'
              }}>
                Start Week (1-16)
              </label>
              <input
                type="number"
                min="1"
                max="16"
                value={editForm.startWeek}
                onChange={(e) => setEditForm({ ...editForm, startWeek: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid #ddd',
                  fontFamily: 'Century Gothic, sans-serif'
                }}
              />
            </div>
            
            {/* End Week Input */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '4px',
                fontSize: '14px',
                fontFamily: 'Century Gothic, sans-serif'
              }}>
                End Week (1-16)
              </label>
              <input
                type="number"
                min="1"
                max="16"
                value={editForm.endWeek}
                onChange={(e) => setEditForm({ ...editForm, endWeek: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid #ddd',
                  fontFamily: 'Century Gothic, sans-serif'
                }}
              />
            </div>
            
            {/* Color Picker */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px',
                fontSize: '14px',
                fontFamily: 'Century Gothic, sans-serif'
              }}>
                Task Color
              </label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {presetColors.map(color => (
                  <div
                    key={color}
                    onClick={() => setEditForm({ ...editForm, color })}
                    style={{
                      width: '40px',
                      height: '40px',
                      backgroundColor: color,
                      borderRadius: '8px',
                      cursor: 'pointer',
                      border: editForm.color === color ? '3px solid #0A1628' : '2px solid #ddd',
                      transition: 'all 0.2s'
                    }}
                  />
                ))}
              </div>
            </div>
            
            {/* Buttons */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'space-between' }}>
              <button
                onClick={handleDeleteTask}
                style={{
                  padding: '10px 20px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  fontFamily: 'Century Gothic, sans-serif',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#c82333'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#dc3545'}
              >
                🗑️ Delete
              </button>
              
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={handleCancelEdit}
                style={{
                  padding: '10px 20px',
                  borderRadius: '6px',
                  border: '1px solid #ddd',
                  backgroundColor: 'white',
                  fontFamily: 'Century Gothic, sans-serif',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                style={{
                  padding: '10px 20px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: '#0A1628',
                  color: 'white',
                  fontFamily: 'Century Gothic, sans-serif',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#1A2638'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#0A1628'}
              >
                Save Changes
              </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Create Task Modal */}
      {creatingTask && (
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
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            minWidth: '400px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.2)'
          }}>
            <h3 style={{ 
              fontFamily: 'Century Gothic, sans-serif', 
              marginBottom: '20px',
              color: '#0A1628'
            }}>
              Add New Task
            </h3>
            
            {/* Task Name Input */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '4px',
                fontSize: '14px',
                fontFamily: 'Century Gothic, sans-serif'
              }}>
                Task Name
              </label>
              <input
                type="text"
                value={createForm.name}
                onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid #ddd',
                  fontFamily: 'Century Gothic, sans-serif'
                }}
              />
            </div>
            
            {/* Parent Task Selection */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '4px',
                fontSize: '14px',
                fontFamily: 'Century Gothic, sans-serif'
              }}>
                Parent Task
              </label>
              <select
                value={createForm.parentId}
                onChange={(e) => setCreateForm({ ...createForm, parentId: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid #ddd',
                  fontFamily: 'Century Gothic, sans-serif'
                }}
              >
                {tasks.filter(t => t.type === 'parent').map(parent => (
                  <option key={parent.id} value={parent.id}>
                    {parent.name}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Start Week Input */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '4px',
                fontSize: '14px',
                fontFamily: 'Century Gothic, sans-serif'
              }}>
                Start Week (1-16)
              </label>
              <input
                type="number"
                min="1"
                max="16"
                value={createForm.startWeek}
                onChange={(e) => setCreateForm({ ...createForm, startWeek: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid #ddd',
                  fontFamily: 'Century Gothic, sans-serif'
                }}
              />
            </div>
            
            {/* End Week Input */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '4px',
                fontSize: '14px',
                fontFamily: 'Century Gothic, sans-serif'
              }}>
                End Week (1-16)
              </label>
              <input
                type="number"
                min="1"
                max="16"
                value={createForm.endWeek}
                onChange={(e) => setCreateForm({ ...createForm, endWeek: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid #ddd',
                  fontFamily: 'Century Gothic, sans-serif'
                }}
              />
            </div>
            
            {/* Color Picker */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px',
                fontSize: '14px',
                fontFamily: 'Century Gothic, sans-serif'
              }}>
                Task Color
              </label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {presetColors.map(color => (
                  <div
                    key={color}
                    onClick={() => setCreateForm({ ...createForm, color })}
                    style={{
                      width: '40px',
                      height: '40px',
                      backgroundColor: color,
                      borderRadius: '8px',
                      cursor: 'pointer',
                      border: createForm.color === color ? '3px solid #0A1628' : '2px solid #ddd',
                      transition: 'all 0.2s'
                    }}
                  />
                ))}
              </div>
            </div>
            
            {/* Buttons */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  setCreatingTask(false);
                  setCreateForm({ name: '', parentId: 1, startWeek: 1, endWeek: 1, color: '#4A90E2', completed: false });
                }}
                style={{
                  padding: '10px 20px',
                  borderRadius: '6px',
                  border: '1px solid #ddd',
                  backgroundColor: 'white',
                  fontFamily: 'Century Gothic, sans-serif',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTask}
                style={{
                  padding: '10px 20px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: '#28a745',
                  color: 'white',
                  fontFamily: 'Century Gothic, sans-serif',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#218838'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#28a745'}
                disabled={!createForm.name}
              >
                ➕ Create Task
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Create Dependency Modal */}
      {creatingDependency && (
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
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            minWidth: '400px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.2)'
          }}>
            <h3 style={{ 
              fontFamily: 'Century Gothic, sans-serif', 
              marginBottom: '20px',
              color: '#0A1628'
            }}>
              Add New Dependency
            </h3>
            
            {/* Dependency Name Input */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '4px',
                fontSize: '14px',
                fontFamily: 'Century Gothic, sans-serif'
              }}>
                Dependency Name
              </label>
              <input
                type="text"
                value={dependencyForm.name}
                onChange={(e) => setDependencyForm({ ...dependencyForm, name: e.target.value })}
                placeholder="e.g., Infrastructure Setup"
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid #ddd',
                  fontFamily: 'Century Gothic, sans-serif'
                }}
              />
            </div>
            
            {/* Start Week Input */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '4px',
                fontSize: '14px',
                fontFamily: 'Century Gothic, sans-serif'
              }}>
                Start Week (1-16)
              </label>
              <input
                type="number"
                min="1"
                max="16"
                value={dependencyForm.startWeek}
                onChange={(e) => setDependencyForm({ ...dependencyForm, startWeek: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid #ddd',
                  fontFamily: 'Century Gothic, sans-serif'
                }}
              />
            </div>
            
            {/* End Week Input */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '4px',
                fontSize: '14px',
                fontFamily: 'Century Gothic, sans-serif'
              }}>
                End Week (1-16)
              </label>
              <input
                type="number"
                min="1"
                max="16"
                value={dependencyForm.endWeek}
                onChange={(e) => setDependencyForm({ ...dependencyForm, endWeek: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid #ddd',
                  fontFamily: 'Century Gothic, sans-serif'
                }}
              />
            </div>
            
            {/* Buttons */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  setCreatingDependency(false);
                  setDependencyForm({ name: '', startWeek: 1, endWeek: 8 });
                }}
                style={{
                  padding: '10px 20px',
                  borderRadius: '6px',
                  border: '1px solid #ddd',
                  backgroundColor: 'white',
                  fontFamily: 'Century Gothic, sans-serif',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
              >
                Cancel
              </button>
              <button
                onClick={handleCreateDependency}
                style={{
                  padding: '10px 20px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: '#9C27B0',
                  color: 'white',
                  fontFamily: 'Century Gothic, sans-serif',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#5a32a3'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#6f42c1'}
                disabled={!dependencyForm.name}
              >
                Create Dependency
              </button>
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
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            minWidth: '400px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.2)'
          }}>
            <h3 style={{ 
              fontFamily: 'Century Gothic, sans-serif', 
              marginBottom: '20px',
              color: '#0A1628'
            }}>
              Timeline Settings
            </h3>
            
            {/* Project Start Date */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '4px',
                fontSize: '14px',
                fontFamily: 'Century Gothic, sans-serif'
              }}>
                Project Start Date
              </label>
              <input
                type="date"
                value={projectSettings.startDate}
                onChange={(e) => setProjectSettings({ ...projectSettings, startDate: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid #ddd',
                  fontFamily: 'Century Gothic, sans-serif'
                }}
              />
            </div>
            
            {/* Project End Date */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '4px',
                fontSize: '14px',
                fontFamily: 'Century Gothic, sans-serif'
              }}>
                Project End Date
              </label>
              <input
                type="date"
                value={projectSettings.endDate}
                onChange={(e) => setProjectSettings({ ...projectSettings, endDate: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid #ddd',
                  fontFamily: 'Century Gothic, sans-serif'
                }}
              />
            </div>
            
            {/* Display Mode Toggle */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px',
                fontSize: '14px',
                fontFamily: 'Century Gothic, sans-serif'
              }}>
                Display Mode
              </label>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => setProjectSettings({ ...projectSettings, displayMode: 'weeks' })}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '6px',
                    border: '1px solid #ddd',
                    backgroundColor: projectSettings.displayMode === 'weeks' ? '#0A1628' : 'white',
                    color: projectSettings.displayMode === 'weeks' ? 'white' : '#333',
                    fontFamily: 'Century Gothic, sans-serif',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  Weeks
                </button>
                <button
                  onClick={() => setProjectSettings({ ...projectSettings, displayMode: 'dates' })}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '6px',
                    border: '1px solid #ddd',
                    backgroundColor: projectSettings.displayMode === 'dates' ? '#0A1628' : 'white',
                    color: projectSettings.displayMode === 'dates' ? 'white' : '#333',
                    fontFamily: 'Century Gothic, sans-serif',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  Dates
                </button>
              </div>
            </div>
            
            {/* Buttons */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowSettings(false)}
                style={{
                  padding: '10px 20px',
                  borderRadius: '6px',
                  border: '1px solid #ddd',
                  backgroundColor: 'white',
                  fontFamily: 'Century Gothic, sans-serif',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveSettings}
                style={{
                  padding: '10px 20px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: '#6B7280',
                  color: 'white',
                  fontFamily: 'Century Gothic, sans-serif',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#5a6268'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#6c757d'}
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

export default withPageAuthRequired(Progress);// Deploy trigger
