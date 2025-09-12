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
  const [zoomLevel, setZoomLevel] = useState(1);
  const baseColumnWidth = 80;
  
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
    
    // Calculate standard periods
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
        label: formatPeriodLabel(periodStart, periodEnd),
        isPostProject: false
      });
      
      current.setDate(current.getDate() + 7);
    }
    
    // Add extra periods when zoomed out
    if (zoomLevel < 1) {
      const extraPeriods = Math.ceil((1 - zoomLevel) * 8);
      for (let i = 0; i < extraPeriods; i++) {
        const periodStart = new Date(current);
        const periodEnd = new Date(current);
        periodEnd.setDate(periodEnd.getDate() + 6);
        
        periods.push({
          start: periodStart,
          end: periodEnd,
          label: formatPeriodLabel(periodStart, periodEnd),
          isPostProject: true
        });
        
        current.setDate(current.getDate() + 7);
      }
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
    const taskStart = new Date(startDate);
    const taskEnd = new Date(endDate);
    
    const periods = getDatePeriods();
    const totalPeriods = periods.filter(p => !p.isPostProject).length;
    const totalDays = totalPeriods * 7;
    
    const startDays = (taskStart - projectStart) / (1000 * 60 * 60 * 24);
    const duration = (taskEnd - taskStart) / (1000 * 60 * 60 * 24) + 1;
    
    const columnWidth = baseColumnWidth * zoomLevel;
    const totalWidth = periods.length * columnWidth;
    
    const leftPx = (startDays / 7) * columnWidth;
    const widthPx = (duration / 7) * columnWidth;
    
    return {
      left: `${leftPx}px`,
      width: `${widthPx}px`
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
  
  // Calculate all tasks for row coloring
  const allTasksOrdered = [];
  parentTasks.forEach(parent => {
    allTasksOrdered.push(parent);
    const children = tasks.filter(t => t.parentId === parent.id);
    allTasksOrdered.push(...children);
  });
  
  return (
    <div style={{ padding: '24px', fontFamily: 'Century Gothic, sans-serif' }}>
      <h1 style={{ marginBottom: '24px', fontFamily: 'Century Gothic, sans-serif' }}>Progress Tracking</h1>
      
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
            fontWeight: 'bold',
            fontFamily: 'Century Gothic, sans-serif',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#1D4ED8'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#2563EB'}
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
            fontWeight: 'bold',
            fontFamily: 'Century Gothic, sans-serif',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#7C3AED'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#8B5CF6'}
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
            fontWeight: 'bold',
            fontFamily: 'Century Gothic, sans-serif',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#4B5563'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#6B7280'}
        >
          Timeline Settings
        </button>
        
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', color: '#6B7280', fontFamily: 'Century Gothic, sans-serif' }}>
            Zoom: {Math.round(zoomLevel * 100)}%
          </span>
          <button
            onClick={() => setZoomLevel(Math.max(0.5, zoomLevel - 0.25))}
            disabled={zoomLevel <= 0.5}
            style={{
              padding: '6px 12px',
              backgroundColor: zoomLevel <= 0.5 ? '#F3F4F6' : 'white',
              color: zoomLevel <= 0.5 ? '#9CA3AF' : '#6B7280',
              border: '1px solid #E5E7EB',
              borderRadius: '4px',
              cursor: zoomLevel <= 0.5 ? 'not-allowed' : 'pointer',
              fontSize: '12px',
              fontFamily: 'Century Gothic, sans-serif',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => { if (zoomLevel > 0.5) { e.target.style.backgroundColor = '#F9FAFB'; e.target.style.borderColor = '#9CA3AF'; }}}
            onMouseLeave={(e) => { if (zoomLevel > 0.5) { e.target.style.backgroundColor = 'white'; e.target.style.borderColor = '#E5E7EB'; }}}
          >
            Zoom Out -
          </button>
          <button
            onClick={() => setZoomLevel(Math.min(2, zoomLevel + 0.25))}
            disabled={zoomLevel >= 2}
            style={{
              padding: '6px 12px',
              backgroundColor: zoomLevel >= 2 ? '#F3F4F6' : 'white',
              color: zoomLevel >= 2 ? '#9CA3AF' : '#6B7280',
              border: '1px solid #E5E7EB',
              borderRadius: '4px',
              cursor: zoomLevel >= 2 ? 'not-allowed' : 'pointer',
              fontSize: '12px',
              fontFamily: 'Century Gothic, sans-serif',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => { if (zoomLevel < 2) { e.target.style.backgroundColor = '#F9FAFB'; e.target.style.borderColor = '#9CA3AF'; }}}
            onMouseLeave={(e) => { if (zoomLevel < 2) { e.target.style.backgroundColor = 'white'; e.target.style.borderColor = '#E5E7EB'; }}}
          >
            Zoom In +
          </button>
        </div>
      </div>
      
      {/* Gantt Chart */}
      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: '8px', 
        border: '1px solid #D1D5DB',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        overflow: 'auto',
        maxWidth: '100%'
      }}>
        {/* Date Headers */}
        <div style={{ 
          display: 'flex', 
          borderBottom: '2px solid #374151',
          backgroundColor: '#F3F4F6',
          position: 'sticky',
          top: 0,
          zIndex: 10
        }}>
          {periods.map((period, index) => (
            <div
              key={index}
              style={{
                width: `${baseColumnWidth * zoomLevel}px`,
                minWidth: `${baseColumnWidth * zoomLevel}px`,
                padding: '12px 4px',
                textAlign: 'center',
                borderRight: '1px solid #D1D5DB',
                fontSize: '11px',
                fontWeight: 'bold',
                color: period.isPostProject ? '#9CA3AF' : '#1F2937',
                backgroundColor: period.isPostProject ? '#F9FAFB' : '#F3F4F6',
                fontFamily: 'Century Gothic, sans-serif',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {period.label}
            </div>
          ))}
        </div>
        
        {/* Tasks Container */}
        <div style={{ 
          position: 'relative',
          minWidth: `${periods.length * baseColumnWidth * zoomLevel}px`,
          padding: '16px'
        }}>
          {/* Grid Background */}
          <div style={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            pointerEvents: 'none',
            zIndex: 2
          }}>
            {periods.map((period, colIndex) => (
              <div
                key={colIndex}
                style={{
                  position: 'absolute',
                  left: `${colIndex * baseColumnWidth * zoomLevel}px`,
                  top: 0,
                  width: '1px',
                  height: '100%',
                  backgroundColor: period.isPostProject ? '#D1D5DB' : '#E5E7EB',
                  opacity: period.isPostProject ? 0.5 : 1
                }}
              />
            ))}
          </div>
          
          {/* Tasks */}
          <div style={{ position: 'relative', zIndex: 3 }}>
            {parentTasks.map((parent, parentIndex) => {
              const children = tasks.filter(t => t.parentId === parent.id);
              let rowIndex = 0;
              for (let i = 0; i < parentIndex; i++) {
                rowIndex++;
                rowIndex += tasks.filter(t => t.parentId === parentTasks[i].id).length;
              }
              
              return (
                <div key={parent.id}>
                  {/* Parent Task */}
                  <div style={{ 
                    position: 'relative', 
                    height: '40px', 
                    marginBottom: '8px'
                  }}>
                    {/* Row Background */}
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: '-16px',
                      right: '-16px',
                      height: '100%',
                      backgroundColor: rowIndex % 2 === 0 ? 'white' : '#F9FAFB',
                      zIndex: 1
                    }} />
                    <div
                      onClick={() => handleEditTask(parent)}
                      style={{
                        position: 'absolute',
                        ...getTaskPosition(parent.startDate, parent.endDate),
                        top: '4px',
                        height: '32px',
                        backgroundColor: parent.color,
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        paddingLeft: '12px',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '14px',
                        cursor: 'pointer',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        fontFamily: 'Century Gothic, sans-serif',
                        zIndex: 3
                      }}
                      onMouseEnter={(e) => { 
                        e.currentTarget.style.transform = 'scale(1.02)';
                        e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
                      }}
                      onMouseLeave={(e) => { 
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.15)';
                      }}
                    >
                      {parent.name}
                    </div>
                  </div>
                  
                  {/* Child Tasks */}
                  {children.map((child, childIndex) => {
                    rowIndex++;
                    return (
                      <div key={child.id} style={{ 
                        position: 'relative', 
                        height: '32px', 
                        marginBottom: '4px'
                      }}>
                        {/* Row Background */}
                        <div style={{
                          position: 'absolute',
                          top: 0,
                          left: '-16px',
                          right: '-16px',
                          height: '100%',
                          backgroundColor: rowIndex % 2 === 0 ? 'white' : '#F9FAFB',
                          zIndex: 1
                        }} />
                        <div
                          onClick={() => handleEditTask(child)}
                          style={{
                            position: 'absolute',
                            ...getTaskPosition(child.startDate, child.endDate),
                            top: '4px',
                            height: '24px',
                            backgroundColor: child.color,
                            borderRadius: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            paddingLeft: '10px',
                            marginLeft: '20px',
                            color: 'white',
                            fontSize: '12px',
                            cursor: 'pointer',
                            transition: 'transform 0.2s, box-shadow 0.2s',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
                            fontFamily: 'Century Gothic, sans-serif',
                            zIndex: 3
                          }}
                          onMouseEnter={(e) => { 
                            e.currentTarget.style.transform = 'scale(1.02)';
                            e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.15)';
                          }}
                          onMouseLeave={(e) => { 
                            e.currentTarget.style.transform = 'scale(1)';
                            e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.12)';
                          }}
                        >
                          {child.name}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
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
            width: '420px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
          }}>
            <h2 style={{ marginBottom: '24px', fontSize: '22px', fontWeight: 'bold', fontFamily: 'Century Gothic, sans-serif', color: '#1F2937' }}>
              Add Task
            </h2>
            
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', color: '#4A5568', fontFamily: 'Century Gothic, sans-serif' }}>
              Task Name
            </label>
            <input
              placeholder="Enter task name"
              value={taskForm.name}
              onChange={(e) => setTaskForm({ ...taskForm, name: e.target.value })}
              style={{
                width: '100%',
                padding: '10px',
                marginBottom: '16px',
                border: '1px solid #D1D5DB',
                borderRadius: '6px',
                fontFamily: 'Century Gothic, sans-serif',
                fontSize: '14px'
              }}
            />
            
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', color: '#4A5568', fontFamily: 'Century Gothic, sans-serif' }}>
              Parent Task
            </label>
            <select
              value={taskForm.parentId}
              onChange={(e) => setTaskForm({ ...taskForm, parentId: e.target.value })}
              style={{
                width: '100%',
                padding: '10px',
                marginBottom: '16px',
                border: '1px solid #D1D5DB',
                borderRadius: '6px',
                fontFamily: 'Century Gothic, sans-serif',
                fontSize: '14px',
                backgroundColor: 'white'
              }}
            >
              <option value="">Select Parent Task</option>
              {parentTasks.map(parent => (
                <option key={parent.id} value={parent.id}>{parent.name}</option>
              ))}
            </select>
            
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', color: '#4A5568', fontFamily: 'Century Gothic, sans-serif' }}>
              Start Date
            </label>
            <input
              type="date"
              value={taskForm.startDate}
              onChange={(e) => setTaskForm({ ...taskForm, startDate: e.target.value })}
              style={{
                width: '100%',
                padding: '10px',
                marginBottom: '16px',
                border: '1px solid #D1D5DB',
                borderRadius: '6px',
                fontFamily: 'Century Gothic, sans-serif',
                fontSize: '14px'
              }}
            />
            
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', color: '#4A5568', fontFamily: 'Century Gothic, sans-serif' }}>
              End Date
            </label>
            <input
              type="date"
              value={taskForm.endDate}
              onChange={(e) => setTaskForm({ ...taskForm, endDate: e.target.value })}
              style={{
                width: '100%',
                padding: '10px',
                marginBottom: '16px',
                border: '1px solid #D1D5DB',
                borderRadius: '6px',
                fontFamily: 'Century Gothic, sans-serif',
                fontSize: '14px'
              }}
            />
            
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#4A5568', fontFamily: 'Century Gothic, sans-serif' }}>
              Task Color
            </label>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
              {colors.map(color => (
                <div
                  key={color}
                  onClick={() => setTaskForm({ ...taskForm, color })}
                  style={{
                    width: '40px',
                    height: '40px',
                    backgroundColor: color,
                    borderRadius: '6px',
                    cursor: 'pointer',
                    border: taskForm.color === color ? '3px solid #1F2937' : '2px solid transparent',
                    transition: 'all 0.2s',
                    transform: taskForm.color === color ? 'scale(1.1)' : 'scale(1)'
                  }}
                  onMouseEnter={(e) => {
                    if (taskForm.color !== color) {
                      e.currentTarget.style.transform = 'scale(1.05)';
                      e.currentTarget.style.border = '2px solid #9CA3AF';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (taskForm.color !== color) {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.border = '2px solid transparent';
                    }
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
                  padding: '10px 24px',
                  backgroundColor: '#F3F4F6',
                  color: '#374151',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontFamily: 'Century Gothic, sans-serif',
                  fontWeight: '600',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#E5E7EB'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#F3F4F6'}
              >
                Cancel
              </button>
              <button
                onClick={handleAddTask}
                style={{
                  padding: '10px 24px',
                  backgroundColor: '#2563EB',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontFamily: 'Century Gothic, sans-serif',
                  fontWeight: 'bold',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#1D4ED8'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#2563EB'}
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
            width: '420px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
          }}>
            <h2 style={{ marginBottom: '24px', fontSize: '22px', fontWeight: 'bold', fontFamily: 'Century Gothic, sans-serif', color: '#1F2937' }}>
              Add Parent Task
            </h2>
            
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', color: '#4A5568', fontFamily: 'Century Gothic, sans-serif' }}>
              Parent Task Name
            </label>
            <input
              placeholder="Enter parent task name"
              value={parentForm.name}
              onChange={(e) => setParentForm({ ...parentForm, name: e.target.value })}
              style={{
                width: '100%',
                padding: '10px',
                marginBottom: '16px',
                border: '1px solid #D1D5DB',
                borderRadius: '6px',
                fontFamily: 'Century Gothic, sans-serif',
                fontSize: '14px'
              }}
            />
            
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', color: '#4A5568', fontFamily: 'Century Gothic, sans-serif' }}>
              Start Date
            </label>
            <input
              type="date"
              value={parentForm.startDate}
              onChange={(e) => setParentForm({ ...parentForm, startDate: e.target.value })}
              style={{
                width: '100%',
                padding: '10px',
                marginBottom: '16px',
                border: '1px solid #D1D5DB',
                borderRadius: '6px',
                fontFamily: 'Century Gothic, sans-serif',
                fontSize: '14px'
              }}
            />
            
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', color: '#4A5568', fontFamily: 'Century Gothic, sans-serif' }}>
              End Date
            </label>
            <input
              type="date"
              value={parentForm.endDate}
              onChange={(e) => setParentForm({ ...parentForm, endDate: e.target.value })}
              style={{
                width: '100%',
                padding: '10px',
                marginBottom: '24px',
                border: '1px solid #D1D5DB',
                borderRadius: '6px',
                fontFamily: 'Century Gothic, sans-serif',
                fontSize: '14px'
              }}
            />
            
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  setShowAddParent(false);
                  setParentForm({ name: '', startDate: '', endDate: '' });
                }}
                style={{
                  padding: '10px 24px',
                  backgroundColor: '#F3F4F6',
                  color: '#374151',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontFamily: 'Century Gothic, sans-serif',
                  fontWeight: '600',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#E5E7EB'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#F3F4F6'}
              >
                Cancel
              </button>
              <button
                onClick={handleAddParent}
                style={{
                  padding: '10px 24px',
                  backgroundColor: '#8B5CF6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontFamily: 'Century Gothic, sans-serif',
                  fontWeight: 'bold',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#7C3AED'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#8B5CF6'}
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
            width: '420px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
          }}>
            <h2 style={{ marginBottom: '24px', fontSize: '22px', fontWeight: 'bold', fontFamily: 'Century Gothic, sans-serif', color: '#1F2937' }}>
              Edit {editingTask.type === 'parent' ? 'Parent Task' : 'Task'}
            </h2>
            
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', color: '#4A5568', fontFamily: 'Century Gothic, sans-serif' }}>
              {editingTask.type === 'parent' ? 'Parent Task Name' : 'Task Name'}
            </label>
            <input
              placeholder="Enter name"
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
                padding: '10px',
                marginBottom: '16px',
                border: '1px solid #D1D5DB',
                borderRadius: '6px',
                fontFamily: 'Century Gothic, sans-serif',
                fontSize: '14px'
              }}
            />
            
            {editingTask.type === 'child' && (
              <>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', color: '#4A5568', fontFamily: 'Century Gothic, sans-serif' }}>
                  Parent Task
                </label>
                <select
                  value={taskForm.parentId}
                  onChange={(e) => setTaskForm({ ...taskForm, parentId: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px',
                    marginBottom: '16px',
                    border: '1px solid #D1D5DB',
                    borderRadius: '6px',
                    fontFamily: 'Century Gothic, sans-serif',
                    fontSize: '14px',
                    backgroundColor: 'white'
                  }}
                >
                  <option value="">Select Parent Task</option>
                  {parentTasks.map(parent => (
                    <option key={parent.id} value={parent.id}>{parent.name}</option>
                  ))}
                </select>
              </>
            )}
            
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', color: '#4A5568', fontFamily: 'Century Gothic, sans-serif' }}>
              Start Date
            </label>
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
                padding: '10px',
                marginBottom: '16px',
                border: '1px solid #D1D5DB',
                borderRadius: '6px',
                fontFamily: 'Century Gothic, sans-serif',
                fontSize: '14px'
              }}
            />
            
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', color: '#4A5568', fontFamily: 'Century Gothic, sans-serif' }}>
              End Date
            </label>
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
                padding: '10px',
                marginBottom: editingTask.type === 'child' ? '16px' : '24px',
                border: '1px solid #D1D5DB',
                borderRadius: '6px',
                fontFamily: 'Century Gothic, sans-serif',
                fontSize: '14px'
              }}
            />
            
            {editingTask.type === 'child' && (
              <>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#4A5568', fontFamily: 'Century Gothic, sans-serif' }}>
                  Task Color
                </label>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
                  {colors.map(color => (
                    <div
                      key={color}
                      onClick={() => setTaskForm({ ...taskForm, color })}
                      style={{
                        width: '40px',
                        height: '40px',
                        backgroundColor: color,
                        borderRadius: '6px',
                        cursor: 'pointer',
                        border: taskForm.color === color ? '3px solid #1F2937' : '2px solid transparent',
                        transition: 'all 0.2s',
                        transform: taskForm.color === color ? 'scale(1.1)' : 'scale(1)'
                      }}
                      onMouseEnter={(e) => {
                        if (taskForm.color !== color) {
                          e.currentTarget.style.transform = 'scale(1.05)';
                          e.currentTarget.style.border = '2px solid #9CA3AF';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (taskForm.color !== color) {
                          e.currentTarget.style.transform = 'scale(1)';
                          e.currentTarget.style.border = '2px solid transparent';
                        }
                      }}
                    />
                  ))}
                </div>
              </>
            )}
            
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button
                onClick={handleDeleteTask}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#EF4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontFamily: 'Century Gothic, sans-serif',
                  fontWeight: 'bold',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#DC2626'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#EF4444'}
              >
                🗑️ Delete
              </button>
              
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => setEditingTask(null)}
                  style={{
                    padding: '10px 24px',
                    backgroundColor: '#F3F4F6',
                    color: '#374151',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontFamily: 'Century Gothic, sans-serif',
                    fontWeight: '600',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#E5E7EB'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#F3F4F6'}
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateTask}
                  style={{
                    padding: '10px 24px',
                    backgroundColor: editingTask.type === 'parent' ? '#8B5CF6' : '#2563EB',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontFamily: 'Century Gothic, sans-serif',
                    fontWeight: 'bold',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = editingTask.type === 'parent' ? '#7C3AED' : '#1D4ED8'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = editingTask.type === 'parent' ? '#8B5CF6' : '#2563EB'}
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
            width: '420px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
          }}>
            <h2 style={{ marginBottom: '24px', fontSize: '22px', fontWeight: 'bold', fontFamily: 'Century Gothic, sans-serif', color: '#1F2937' }}>
              Timeline Settings
            </h2>
            
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#4A5568', fontFamily: 'Century Gothic, sans-serif' }}>
              Project Start Date
            </label>
            <input
              type="date"
              value={projectSettings.startDate}
              onChange={(e) => setProjectSettings({ ...projectSettings, startDate: e.target.value })}
              style={{
                width: '100%',
                padding: '10px',
                marginBottom: '20px',
                border: '1px solid #D1D5DB',
                borderRadius: '6px',
                fontFamily: 'Century Gothic, sans-serif',
                fontSize: '14px'
              }}
            />
            
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#4A5568', fontFamily: 'Century Gothic, sans-serif' }}>
              Project End Date
            </label>
            <input
              type="date"
              value={projectSettings.endDate}
              onChange={(e) => setProjectSettings({ ...projectSettings, endDate: e.target.value })}
              style={{
                width: '100%',
                padding: '10px',
                marginBottom: '24px',
                border: '1px solid #D1D5DB',
                borderRadius: '6px',
                fontFamily: 'Century Gothic, sans-serif',
                fontSize: '14px'
              }}
            />
            
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowSettings(false)}
                style={{
                  padding: '10px 24px',
                  backgroundColor: '#F3F4F6',
                  color: '#374151',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontFamily: 'Century Gothic, sans-serif',
                  fontWeight: '600',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#E5E7EB'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#F3F4F6'}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowSettings(false);
                  localStorage.setItem('ganttSettings', JSON.stringify(projectSettings));
                }}
                style={{
                  padding: '10px 24px',
                  backgroundColor: '#6B7280',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontFamily: 'Century Gothic, sans-serif',
                  fontWeight: 'bold',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#4B5563'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#6B7280'}
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