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

  const defaultTasks = [
    // MOP Parent and Children
    { id: 1, name: 'ALL MOP WORK', type: 'parent', startWeek: 1, endWeek: 8, color: '#0A1628' },
    { id: 2, name: 'MOP Planning', type: 'child', parentId: 1, startWeek: 1, endWeek: 2, color: '#4A90E2' },
    { id: 3, name: 'MOP Documentation', type: 'child', parentId: 1, startWeek: 2, endWeek: 4, color: '#4A90E2' },
    { id: 4, name: 'MOP Review', type: 'child', parentId: 1, startWeek: 4, endWeek: 6, color: '#4A90E2' },
    { id: 5, name: 'MOP Implementation', type: 'child', parentId: 1, startWeek: 6, endWeek: 8, color: '#4A90E2' },
    
    // SOP Parent and Children
    { id: 6, name: 'ALL SOP WORK', type: 'parent', startWeek: 8, endWeek: 12, color: '#0A1628' },
    { id: 7, name: 'SOP Development', type: 'child', parentId: 6, startWeek: 8, endWeek: 9, color: '#50C878' },
    { id: 8, name: 'SOP Testing', type: 'child', parentId: 6, startWeek: 9, endWeek: 10, color: '#50C878' },
    { id: 9, name: 'SOP Training', type: 'child', parentId: 6, startWeek: 10, endWeek: 11, color: '#50C878' },
    { id: 10, name: 'SOP Deployment', type: 'child', parentId: 6, startWeek: 11, endWeek: 12, color: '#50C878' },
    
    // EOP Parent and Children
    { id: 11, name: 'ALL EOP WORK', type: 'parent', startWeek: 12, endWeek: 16, color: '#0A1628' },
    { id: 12, name: 'EOP Assessment', type: 'child', parentId: 11, startWeek: 12, endWeek: 13, color: '#FF6B6B' },
    { id: 13, name: 'EOP Procedures', type: 'child', parentId: 11, startWeek: 13, endWeek: 14, color: '#FF6B6B' },
    { id: 14, name: 'EOP Drills', type: 'child', parentId: 11, startWeek: 14, endWeek: 15, color: '#FF6B6B' },
    { id: 15, name: 'EOP Finalization', type: 'child', parentId: 11, startWeek: 15, endWeek: 16, color: '#FF6B6B' }
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
  }, []);

  if (!mounted) {
    return <div>Loading...</div>;
  }

  const weeks = Array.from({ length: 16 }, (_, i) => i + 1);
  const chartWidth = 1200;
  const rowHeight = 30;
  const headerHeight = 40;
  const weekWidth = chartWidth / 16;
  
  const handleTaskClick = (task) => {
    if (task.type === 'child') {
      setEditingTask(task);
      setEditForm({
        name: task.name,
        startWeek: task.startWeek,
        endWeek: task.endWeek,
        color: task.color
      });
    }
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
    // Save to localStorage
    localStorage.setItem('ganttChartTasks', JSON.stringify(finalTasks));
    setEditingTask(null);
    setEditForm({ name: '', startWeek: 1, endWeek: 1, color: '#4A90E2' });
  };
  
  const handleCancelEdit = () => {
    setEditingTask(null);
    setEditForm({ name: '', startWeek: 1, endWeek: 1, color: '#4A90E2' });
  };
  
  const handleSaveAll = () => {
    localStorage.setItem('ganttChartTasks', JSON.stringify(tasks));
    alert('All changes saved successfully!');
  };
  
  const handleResetToDefault = () => {
    if (confirm('Are you sure you want to reset to default tasks? This will remove all your changes.')) {
      setTasks(defaultTasks);
      localStorage.setItem('ganttChartTasks', JSON.stringify(defaultTasks));
    }
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
        <h2 style={{ fontFamily: 'Century Gothic, sans-serif', marginBottom: '20px' }}>Project Gantt Chart</h2>
        
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
            onClick={handleSaveAll}
            style={{
              padding: '10px 20px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: '#28a745',
              color: 'white',
              fontFamily: 'Century Gothic, sans-serif',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#218838'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#28a745'}
          >
            💾 Save All Changes
          </button>
          
          <button
            onClick={handleResetToDefault}
            style={{
              padding: '10px 20px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: '#fd7e14',
              color: 'white',
              fontFamily: 'Century Gothic, sans-serif',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#e56b00'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#fd7e14'}
          >
            🔄 Reset to Default
          </button>
          
          <div style={{
            marginLeft: 'auto',
            fontSize: '12px',
            color: '#6c757d',
            fontFamily: 'Century Gothic, sans-serif'
          }}>
            Click on child tasks to edit them
          </div>
        </div>
        
        <div style={{ 
          overflowX: 'auto',
          border: '1px solid #e0e0e0',
          borderRadius: '8px'
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
                  Week {week}
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
                    
                    {/* Task bar */}
                    <div 
                      onClick={() => handleTaskClick(task)}
                      style={{
                        position: 'absolute',
                        left: `${taskLeft}px`,
                        top: '5px',
                        width: `${taskWidth - 4}px`,
                        height: '20px',
                        backgroundColor: task.color,
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
                        cursor: task.type === 'child' ? 'pointer' : 'default',
                        transition: 'opacity 0.2s',
                        '&:hover': { opacity: task.type === 'child' ? 0.9 : 1 }
                      }}
                      onMouseEnter={(e) => {
                        if (task.type === 'child') {
                          e.currentTarget.style.opacity = '0.9';
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.opacity = '1';
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
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
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
      )}
    </div>
  );
}

export default withPageAuthRequired(Progress);