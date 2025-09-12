'use client';

import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import { useState, useEffect } from 'react';
import { useNotifications } from '../contexts/NotificationContext';

function Progress() {
  const { setNotificationCount } = useNotifications();
  
  // Default task data with completion tracking
  const defaultTasks = [
    {
      id: 'mop-parent',
      name: 'ALL MOP WORK',
      startWeek: 1,
      endWeek: 8,
      color: '#0A1628',
      isParent: true,
      children: ['mop-mechanical', 'mop-electrical', 'mop-whitespace'],
      completed: false
    },
    {
      id: 'mop-mechanical',
      name: 'Mechanical MOP',
      startWeek: 1,
      endWeek: 4,
      color: '#2196F3',
      isParent: false,
      parentId: 'mop-parent',
      completed: false
    },
    {
      id: 'mop-electrical',
      name: 'Electrical MOP',
      startWeek: 4,
      endWeek: 6,
      color: '#FFC107',
      isParent: false,
      parentId: 'mop-parent',
      completed: false
    },
    {
      id: 'mop-whitespace',
      name: 'White Space MOP',
      startWeek: 6,
      endWeek: 8,
      color: '#4CAF50',
      isParent: false,
      parentId: 'mop-parent',
      completed: false
    },
    {
      id: 'sop-parent',
      name: 'ALL SOP WORK',
      startWeek: 8,
      endWeek: 12,
      color: '#0A1628',
      isParent: true,
      children: ['sop-mechanical', 'sop-electrical', 'sop-whitespace'],
      completed: false
    },
    {
      id: 'sop-mechanical',
      name: 'Mechanical SOP',
      startWeek: 8,
      endWeek: 10,
      color: '#2196F3',
      isParent: false,
      parentId: 'sop-parent',
      completed: false
    },
    {
      id: 'sop-electrical',
      name: 'Electrical SOP',
      startWeek: 10,
      endWeek: 11,
      color: '#FFC107',
      isParent: false,
      parentId: 'sop-parent',
      completed: false
    },
    {
      id: 'sop-whitespace',
      name: 'White Space SOP',
      startWeek: 11,
      endWeek: 12,
      color: '#4CAF50',
      isParent: false,
      parentId: 'sop-parent',
      completed: false
    },
    {
      id: 'eop-parent',
      name: 'ALL EOP WORK',
      startWeek: 12,
      endWeek: 16,
      color: '#0A1628',
      isParent: true,
      children: ['eop-mechanical', 'eop-electrical', 'eop-whitespace'],
      completed: false
    },
    {
      id: 'eop-mechanical',
      name: 'Mechanical EOP',
      startWeek: 12,
      endWeek: 14,
      color: '#2196F3',
      isParent: false,
      parentId: 'eop-parent',
      completed: false
    },
    {
      id: 'eop-electrical',
      name: 'Electrical EOP',
      startWeek: 14,
      endWeek: 15,
      color: '#FFC107',
      isParent: false,
      parentId: 'eop-parent',
      completed: false
    },
    {
      id: 'eop-whitespace',
      name: 'White Space EOP',
      startWeek: 15,
      endWeek: 16,
      color: '#4CAF50',
      isParent: false,
      parentId: 'eop-parent',
      completed: false
    }
  ];

  // Initialize tasks from localStorage or use defaults
  const [tasks, setTasks] = useState(defaultTasks);
  const [editingTask, setEditingTask] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    startWeek: 1,
    endWeek: 1,
    color: '#2196F3',
    completed: false
  });
  const [saveStatus, setSaveStatus] = useState(''); // 'saved', 'saving', ''
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTaskForm, setNewTaskForm] = useState({
    name: '',
    startWeek: 1,
    endWeek: 2,
    color: '#2196F3',
    isParent: false,
    parentId: '',
    completed: false
  });
  const [showImportModal, setShowImportModal] = useState(false);
  const [importPreview, setImportPreview] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [hoveredButton, setHoveredButton] = useState(null);
  const [dismissedNotifications, setDismissedNotifications] = useState(() => {
    const saved = localStorage.getItem('dismissedNotifications');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Reset if it's a new day
      if (parsed.date !== new Date().toDateString()) {
        return { date: new Date().toDateString(), overdue: false, upcoming: false };
      }
      return parsed;
    }
    return { date: new Date().toDateString(), overdue: false, upcoming: false };
  });

  // Load tasks from localStorage on mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('ganttChartTasks');
    if (savedTasks) {
      try {
        const parsedTasks = JSON.parse(savedTasks);
        setTasks(parsedTasks);
      } catch (error) {
        console.error('Error loading saved tasks:', error);
        setTasks(defaultTasks);
      }
    }
  }, []);

  // Auto-save to localStorage whenever tasks change
  useEffect(() => {
    if (tasks !== defaultTasks) {
      localStorage.setItem('ganttChartTasks', JSON.stringify(tasks));
      
      // Show auto-save indicator
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus(''), 2000);
    }
  }, [tasks]);

  // Update parent task dates based on children
  const updateParentDates = (parentId, updatedTasks) => {
    const parent = updatedTasks.find(t => t.id === parentId);
    if (parent && parent.children) {
      const childTasks = updatedTasks.filter(t => parent.children.includes(t.id));
      if (childTasks.length > 0) {
        const minStart = Math.min(...childTasks.map(t => t.startWeek));
        const maxEnd = Math.max(...childTasks.map(t => t.endWeek));
        parent.startWeek = minStart;
        parent.endWeek = maxEnd;
      }
    }
    return updatedTasks;
  };

  // Handle task click to open edit modal
  const handleTaskClick = (task) => {
    if (!task.isParent) {
      setEditingTask(task);
      setEditForm({
        name: task.name,
        startWeek: task.startWeek,
        endWeek: task.endWeek,
        color: task.color,
        completed: task.completed || false
      });
    }
  };

  // Toggle task completion
  const toggleTaskCompletion = (taskId, event) => {
    event.stopPropagation(); // Prevent opening edit modal
    
    let updatedTasks = tasks.map(task => 
      task.id === taskId
        ? { ...task, completed: !task.completed }
        : task
    );

    // Check if parent should be marked complete
    tasks.forEach(task => {
      if (task.isParent && task.children) {
        const childTasks = updatedTasks.filter(t => task.children.includes(t.id));
        const allChildrenComplete = childTasks.every(t => t.completed);
        updatedTasks = updatedTasks.map(t => 
          t.id === task.id
            ? { ...t, completed: allChildrenComplete }
            : t
        );
      }
    });

    setTasks(updatedTasks);
  };

  // Add new task
  const addNewTask = () => {
    const taskId = `task-${Date.now()}`;
    const newTask = {
      id: taskId,
      ...newTaskForm
    };

    let updatedTasks = [...tasks, newTask];

    // If adding child task, update parent
    if (newTaskForm.parentId) {
      updatedTasks = updatedTasks.map(task => 
        task.id === newTaskForm.parentId
          ? { ...task, children: [...(task.children || []), taskId] }
          : task
      );
      updatedTasks = updateParentDates(newTaskForm.parentId, updatedTasks);
    }

    setTasks(updatedTasks);
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
  };

  // Delete task
  const deleteTask = () => {
    const confirmMessage = editingTask.isParent 
      ? 'Delete this parent task and all its children?' 
      : 'Are you sure you want to delete this task?';
    
    if (confirm(confirmMessage)) {
      let updatedTasks = tasks;
      
      if (editingTask.isParent) {
        // Remove parent and all children
        const childIds = editingTask.children || [];
        updatedTasks = tasks.filter(t => 
          t.id !== editingTask.id && !childIds.includes(t.id)
        );
      } else {
        // Remove single task
        updatedTasks = tasks.filter(t => t.id !== editingTask.id);
        
        // Update parent's children array if this was a child
        if (editingTask.parentId) {
          updatedTasks = updatedTasks.map(task => 
            task.id === editingTask.parentId
              ? { ...task, children: task.children.filter(id => id !== editingTask.id) }
              : task
          );
          updatedTasks = updateParentDates(editingTask.parentId, updatedTasks);
        }
      }
      
      setTasks(updatedTasks);
      setEditingTask(null);
    }
  };

  // Save edited task
  const saveTask = () => {
    let updatedTasks = tasks.map(task => 
      task.id === editingTask.id
        ? { ...task, ...editForm }
        : task
    );

    // Update parent dates if this is a child task
    if (editingTask.parentId) {
      updatedTasks = updateParentDates(editingTask.parentId, updatedTasks);
    }

    setTasks(updatedTasks);
    setEditingTask(null);
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingTask(null);
    setEditForm({
      name: '',
      startWeek: 1,
      endWeek: 1,
      color: '#2196F3'
    });
  };

  // Manual save all changes
  const saveAllChanges = () => {
    setSaveStatus('saving');
    localStorage.setItem('ganttChartTasks', JSON.stringify(tasks));
    
    // Show success toast
    setTimeout(() => {
      setSaveStatus('saved');
      setShowSuccessToast(true);
      setTimeout(() => {
        setSaveStatus('');
        setShowSuccessToast(false);
      }, 3000);
    }, 500);
  };

  // Reset to default tasks
  const resetToDefault = () => {
    if (confirm('Are you sure you want to reset all tasks to their default values? This will clear all your changes.')) {
      localStorage.removeItem('ganttChartTasks');
      setTasks(defaultTasks);
      setSaveStatus('saved');
      setShowSuccessToast(true);
      setTimeout(() => {
        setSaveStatus('');
        setShowSuccessToast(false);
      }, 3000);
    }
  };

  // Export timeline as JSON
  const exportTimeline = () => {
    const exportData = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      projectStartDate: projectStartDate.toISOString(),
      tasks: tasks,
      metadata: {
        totalTasks: tasks.filter(t => !t.isParent).length,
        completedTasks: tasks.filter(t => !t.isParent && t.completed).length,
        completionPercentage: completionPercentage
      }
    };

    const jsonString = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `gantt_timeline_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setToastMessage('Timeline exported successfully!');
    setShowSuccessToast(true);
    setTimeout(() => {
      setShowSuccessToast(false);
      setToastMessage('');
    }, 3000);
  };

  // Import timeline from JSON
  const handleImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importData = JSON.parse(e.target.result);
        
        // Validate structure
        if (!importData.tasks || !Array.isArray(importData.tasks)) {
          throw new Error('Invalid file structure: missing tasks array');
        }

        // Validate each task has required fields
        const isValid = importData.tasks.every(task => 
          task.id && task.name && task.startWeek && task.endWeek
        );

        if (!isValid) {
          throw new Error('Invalid task data: missing required fields');
        }

        setImportPreview(importData);
        setShowImportModal(true);
      } catch (error) {
        alert(`Import failed: ${error.message}`);
      }
    };
    reader.readAsText(file);
    event.target.value = ''; // Reset input
  };

  // Confirm import
  const confirmImport = () => {
    if (importPreview && importPreview.tasks) {
      setTasks(importPreview.tasks);
      localStorage.setItem('ganttChartTasks', JSON.stringify(importPreview.tasks));
      
      setToastMessage('Timeline imported successfully!');
      setShowSuccessToast(true);
      setShowImportModal(false);
      setImportPreview(null);
      
      setTimeout(() => {
        setShowSuccessToast(false);
        setToastMessage('');
      }, 3000);
    }
  };

  // Print view
  const openPrintView = () => {
    const printWindow = window.open('', '_blank');
    
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Project Timeline - ${new Date().toLocaleDateString()}</title>
        <style>
          @page { size: landscape; margin: 20mm; }
          body { 
            font-family: 'Century Gothic', sans-serif; 
            margin: 0; 
            padding: 20px;
            color: #0A1628;
          }
          h1 { text-align: center; margin-bottom: 20px; }
          .stats { 
            display: grid; 
            grid-template-columns: repeat(4, 1fr); 
            gap: 20px; 
            margin-bottom: 30px;
          }
          .stat-card {
            border: 1px solid #E2E8F0;
            padding: 15px;
            border-radius: 8px;
            text-align: center;
          }
          .stat-title { 
            font-size: 14px; 
            color: #4A5568; 
            margin-bottom: 8px;
          }
          .stat-value { 
            font-size: 24px; 
            font-weight: bold; 
            color: #0A1628;
          }
          table { 
            width: 100%; 
            border-collapse: collapse; 
            margin-top: 20px;
          }
          th, td { 
            border: 1px solid #E2E8F0; 
            padding: 8px; 
            text-align: left;
          }
          th { 
            background: #F9FAFB; 
            font-weight: bold;
          }
          .completed { 
            text-decoration: line-through; 
            opacity: 0.6;
          }
          .parent-task { 
            font-weight: bold; 
            background: #F9FAFB;
          }
          .task-bar {
            height: 20px;
            border-radius: 4px;
            text-align: center;
            color: white;
            font-size: 11px;
            line-height: 20px;
          }
          @media print {
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <h1>Project Progress Timeline</h1>
        
        <div class="stats">
          <div class="stat-card">
            <div class="stat-title">Overall Progress</div>
            <div class="stat-value">${completionPercentage}%</div>
          </div>
          <div class="stat-card">
            <div class="stat-title">Current Week</div>
            <div class="stat-value">Week ${currentWeek}</div>
          </div>
          <div class="stat-card">
            <div class="stat-title">Tasks Completed</div>
            <div class="stat-value">${tasks.filter(t => !t.isParent && t.completed).length}/${tasks.filter(t => !t.isParent).length}</div>
          </div>
          <div class="stat-card">
            <div class="stat-title">Timeline Status</div>
            <div class="stat-value">${timelineStatus}</div>
          </div>
        </div>
        
        <table>
          <thead>
            <tr>
              <th>Task Name</th>
              <th>Type</th>
              <th>Start Week</th>
              <th>End Week</th>
              <th>Duration</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${organizedTasks.map(task => `
              <tr class="${task.isParent ? 'parent-task' : ''} ${task.completed ? 'completed' : ''}">
                <td>${task.isParent ? '' : '&nbsp;&nbsp;&nbsp;&nbsp;'}${task.name}</td>
                <td>${task.isParent ? 'Parent' : 'Task'}</td>
                <td>Week ${task.startWeek}</td>
                <td>Week ${task.endWeek}</td>
                <td>${task.endWeek - task.startWeek + 1} weeks</td>
                <td>${task.completed ? '✅ Complete' : '⏳ Pending'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div style="margin-top: 30px; text-align: center; color: #4A5568; font-size: 12px;">
          Generated on ${new Date().toLocaleString()} | Project Start: ${projectStartDate.toLocaleDateString()} | Project End: ${projectEndDate.toLocaleDateString()}
        </div>
      </body>
      </html>
    `;
    
    printWindow.document.write(printContent);
    printWindow.document.close();
    
    // Wait for content to load, then trigger print
    printWindow.onload = () => {
      printWindow.print();
    };
  };

  // Generate week labels and dates
  const weeks = Array.from({ length: 16 }, (_, i) => i + 1);
  
  // Calculate week start dates
  const getWeekStartDate = (weekNum) => {
    const date = new Date(projectStartDate);
    date.setDate(date.getDate() + ((weekNum - 1) * 7));
    return date;
  };

  // Format date for display
  const formatWeekDate = (date) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[date.getMonth()]} ${date.getDate()}`;
  };

  // Calculate exact position of today within current week
  const daysIntoCurrentWeek = Math.floor((today - getWeekStartDate(currentWeek)) / (24 * 60 * 60 * 1000));
  const todayPositionInWeek = Math.min(Math.max(daysIntoCurrentWeek / 7, 0), 1); // 0-1 position within week

  // Organize tasks for display (parents with their children)
  const organizedTasks = [];
  tasks.forEach(task => {
    if (task.isParent) {
      organizedTasks.push(task);
      tasks.filter(t => task.children?.includes(t.id)).forEach(child => {
        organizedTasks.push(child);
      });
    }
  });

  // Calculate completion percentage
  const completionPercentage = Math.round(
    (tasks.filter(t => !t.isParent && t.completed).length / 
     tasks.filter(t => !t.isParent).length) * 100
  ) || 0;

  // Project timeline calculations
  const projectStartDate = new Date('2024-01-01'); // Adjust this to your actual start date
  const today = new Date();
  const weeksSinceStart = Math.floor((today - projectStartDate) / (7 * 24 * 60 * 60 * 1000));
  const currentWeek = Math.min(Math.max(weeksSinceStart + 1, 1), 16); // Clamp between 1-16
  const projectEndDate = new Date(projectStartDate);
  projectEndDate.setDate(projectEndDate.getDate() + (16 * 7)); // 16 weeks from start
  const daysUntilEnd = Math.ceil((projectEndDate - today) / (24 * 60 * 60 * 1000));

  // Get tasks active in current week
  const activeTasksThisWeek = tasks.filter(t => 
    !t.isParent && t.startWeek <= currentWeek && t.endWeek >= currentWeek
  );

  // Calculate overdue and upcoming tasks
  const overdueTasks = tasks.filter(t => 
    !t.isParent && !t.completed && t.endWeek < currentWeek
  );
  
  const upcomingTasks = tasks.filter(t => 
    !t.isParent && !t.completed && t.startWeek === currentWeek
  );

  const notificationCount = overdueTasks.length + upcomingTasks.length;

  // Update notification count in context
  useEffect(() => {
    setNotificationCount(notificationCount);
  }, [notificationCount, setNotificationCount]);

  // Save notification dismissal state
  const dismissNotification = (type) => {
    const newState = { ...dismissedNotifications };
    newState[type] = true;
    setDismissedNotifications(newState);
    localStorage.setItem('dismissedNotifications', JSON.stringify(newState));
  };

  // Calculate task distribution by type
  const taskDistribution = {
    mop: {
      total: tasks.filter(t => !t.isParent && (t.parentId?.includes('mop') || t.id.includes('mop'))).length,
      completed: tasks.filter(t => !t.isParent && (t.parentId?.includes('mop') || t.id.includes('mop')) && t.completed).length
    },
    sop: {
      total: tasks.filter(t => !t.isParent && (t.parentId?.includes('sop') || t.id.includes('sop'))).length,
      completed: tasks.filter(t => !t.isParent && (t.parentId?.includes('sop') || t.id.includes('sop')) && t.completed).length
    },
    eop: {
      total: tasks.filter(t => !t.isParent && (t.parentId?.includes('eop') || t.id.includes('eop'))).length,
      completed: tasks.filter(t => !t.isParent && (t.parentId?.includes('eop') || t.id.includes('eop')) && t.completed).length
    }
  };

  // Calculate timeline status
  const expectedCompletionByNow = Math.round((currentWeek / 16) * tasks.filter(t => !t.isParent).length);
  const actualCompleted = tasks.filter(t => !t.isParent && t.completed).length;
  let timelineStatus = 'On Track';
  let timelineColor = '#4CAF50';
  if (actualCompleted < expectedCompletionByNow - 2) {
    timelineStatus = 'Behind';
    timelineColor = '#DC2626';
  } else if (actualCompleted < expectedCompletionByNow) {
    timelineStatus = 'At Risk';
    timelineColor = '#FF9800';
  }

  // Get progress color
  const getProgressColor = (percentage) => {
    if (percentage >= 70) return '#4CAF50';
    if (percentage >= 40) return '#FF9800';
    return '#DC2626';
  };

  return (
    <>
      {/* Background gradient */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(to bottom, #FFFFFF, #F9FAFB)',
        zIndex: -2
      }} />
      
      {/* Circuit pattern overlay - EXACT from frontend */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0.02,
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 10h10v10h10v-10h10v10h10v10h10v10h-10v10h10v10h10v10h-10v10h-10v-10h-10v10h-10v-10h-10v-10h-10v-10h10v-10h-10v-10h-10v-10h10v-10zm20 20h10v10h-10v-10zm20 0h10v10h-10v-10zm0 20h10v10h-10v-10zm-20 0h10v10h-10v-10z' fill='%23001f3f' fill-opacity='1'/%3E%3C/svg%3E")`,
        backgroundSize: '100px 100px',
        zIndex: -1,
        pointerEvents: 'none'
      }} />

      {/* Main Content */}
      <div style={{
        padding: '32px',
        fontFamily: '"Century Gothic", "Questrial", -apple-system, sans-serif',
        position: 'relative',
        zIndex: 1,
        minHeight: '100vh'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto'
        }}>
          {/* Notification Banners */}
          {(overdueTasks.length > 0 || upcomingTasks.length > 0) && (
            <div style={{
              marginBottom: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              {overdueTasks.length > 0 && !dismissedNotifications.overdue && (
                <div style={{
                  backgroundColor: '#FEE2E2',
                  border: '1px solid #FCA5A5',
                  borderRadius: '8px',
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  animation: 'slideInDown 0.3s ease'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}>
                    <span style={{ fontSize: '20px' }}>⚠️</span>
                    <div>
                      <strong style={{ color: '#DC2626', fontSize: '14px' }}>
                        {overdueTasks.length} Overdue Task{overdueTasks.length > 1 ? 's' : ''}
                      </strong>
                      <div style={{
                        fontSize: '13px',
                        color: '#7F1D1D',
                        marginTop: '4px'
                      }}>
                        {overdueTasks.slice(0, 3).map(task => task.name).join(', ')}
                        {overdueTasks.length > 3 && ` and ${overdueTasks.length - 3} more`}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => dismissNotification('overdue')}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#DC2626',
                      fontSize: '20px',
                      cursor: 'pointer',
                      padding: '4px',
                      lineHeight: '1'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.opacity = '0.7';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.opacity = '1';
                    }}
                  >
                    ✕
                  </button>
                </div>
              )}
              
              {upcomingTasks.length > 0 && !dismissedNotifications.upcoming && (
                <div style={{
                  backgroundColor: '#FEF3C7',
                  border: '1px solid #FCD34D',
                  borderRadius: '8px',
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  animation: 'slideInDown 0.3s ease'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}>
                    <span style={{ fontSize: '20px' }}>📅</span>
                    <div>
                      <strong style={{ color: '#D97706', fontSize: '14px' }}>
                        {upcomingTasks.length} Task{upcomingTasks.length > 1 ? 's' : ''} Starting This Week
                      </strong>
                      <div style={{
                        fontSize: '13px',
                        color: '#78350F',
                        marginTop: '4px'
                      }}>
                        {upcomingTasks.slice(0, 3).map(task => task.name).join(', ')}
                        {upcomingTasks.length > 3 && ` and ${upcomingTasks.length - 3} more`}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => dismissNotification('upcoming')}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#D97706',
                      fontSize: '20px',
                      cursor: 'pointer',
                      padding: '4px',
                      lineHeight: '1'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.opacity = '0.7';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.opacity = '1';
                    }}
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          )}
          
          <div style={{
            textAlign: 'center',
            marginBottom: '32px'
          }}>
            <h1 style={{
              color: '#0A1628',
              fontSize: '2.25rem',
              marginBottom: '16px',
              textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
            }}>
              Project Progress Timeline
            </h1>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '24px',
              padding: '12px 24px',
              backgroundColor: '#FFFFFF',
              borderRadius: '8px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <div style={{
                  width: '120px',
                  height: '8px',
                  backgroundColor: '#E2E8F0',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${completionPercentage}%`,
                    height: '100%',
                    backgroundColor: '#4CAF50',
                    transition: 'width 0.3s ease'
                  }} />
                </div>
                <span style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#0A1628'
                }}>
                  {completionPercentage}% Complete
                </span>
              </div>
              <div style={{
                display: 'flex',
                gap: '8px',
                fontSize: '14px',
                color: '#4A5568'
              }}>
                <span>✅ {tasks.filter(t => !t.isParent && t.completed).length} Done</span>
                <span>📋 {tasks.filter(t => !t.isParent && !t.completed).length} Pending</span>
              </div>
            </div>
          </div>

          {/* Control Bar */}
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '8px',
            padding: '16px 24px',
            boxShadow: '0 5px 20px rgba(0,0,0,0.1)',
            marginBottom: '24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px'
            }}>
              <button
                onClick={() => setShowAddModal(true)}
                style={{
                  padding: '8px 20px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: '#0A1628',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontFamily: '"Century Gothic", sans-serif',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#0F1E36';
                  e.target.style.transform = 'translateY(-1px)';
                  e.target.style.boxShadow = '0 4px 12px rgba(10, 22, 40, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#0A1628';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                ➕ Add New Task
              </button>
              
              <button
                onClick={saveAllChanges}
                style={{
                  padding: '8px 20px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: '#4CAF50',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontFamily: '"Century Gothic", sans-serif',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#45a049';
                  e.target.style.transform = 'translateY(-1px)';
                  e.target.style.boxShadow = '0 4px 12px rgba(76, 175, 80, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#4CAF50';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                💾 Save All Changes
              </button>
              
              <button
                onClick={resetToDefault}
                style={{
                  padding: '8px 20px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: '#FF9800',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontFamily: '"Century Gothic", sans-serif',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#F57C00';
                  e.target.style.transform = 'translateY(-1px)';
                  e.target.style.boxShadow = '0 4px 12px rgba(255, 152, 0, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#FF9800';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                🔄 Reset to Default
              </button>

              {/* Data Management Icon Buttons */}
              <div style={{
                display: 'flex',
                gap: '8px',
                borderLeft: '2px solid #E2E8F0',
                paddingLeft: '16px',
                marginLeft: '8px'
              }}>
                {/* Export Button */}
                <div style={{ position: 'relative' }}>
                  <button
                    onClick={exportTimeline}
                    onMouseEnter={() => setHoveredButton('export')}
                    onMouseLeave={() => setHoveredButton(null)}
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '6px',
                      border: '1px solid #E2E8F0',
                      backgroundColor: '#FFFFFF',
                      fontSize: '18px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = '#F0F9FF';
                      e.currentTarget.style.borderColor = '#0070F3';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = '#FFFFFF';
                      e.currentTarget.style.borderColor = '#E2E8F0';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    💾
                  </button>
                  {hoveredButton === 'export' && (
                    <div style={{
                      position: 'absolute',
                      bottom: '100%',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      marginBottom: '8px',
                      padding: '6px 12px',
                      backgroundColor: '#0A1628',
                      color: '#FFFFFF',
                      fontSize: '12px',
                      borderRadius: '4px',
                      whiteSpace: 'nowrap',
                      zIndex: 1000
                    }}>
                      Export Timeline
                      <div style={{
                        position: 'absolute',
                        bottom: '-4px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '0',
                        height: '0',
                        borderLeft: '4px solid transparent',
                        borderRight: '4px solid transparent',
                        borderTop: '4px solid #0A1628'
                      }} />
                    </div>
                  )}
                </div>

                {/* Import Button */}
                <div style={{ position: 'relative' }}>
                  <label
                    onMouseEnter={() => setHoveredButton('import')}
                    onMouseLeave={() => setHoveredButton(null)}
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '6px',
                      border: '1px solid #E2E8F0',
                      backgroundColor: '#FFFFFF',
                      fontSize: '18px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = '#F0F9FF';
                      e.currentTarget.style.borderColor = '#0070F3';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = '#FFFFFF';
                      e.currentTarget.style.borderColor = '#E2E8F0';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    📁
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImport}
                      style={{ display: 'none' }}
                    />
                  </label>
                  {hoveredButton === 'import' && (
                    <div style={{
                      position: 'absolute',
                      bottom: '100%',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      marginBottom: '8px',
                      padding: '6px 12px',
                      backgroundColor: '#0A1628',
                      color: '#FFFFFF',
                      fontSize: '12px',
                      borderRadius: '4px',
                      whiteSpace: 'nowrap',
                      zIndex: 1000
                    }}>
                      Import Timeline
                      <div style={{
                        position: 'absolute',
                        bottom: '-4px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '0',
                        height: '0',
                        borderLeft: '4px solid transparent',
                        borderRight: '4px solid transparent',
                        borderTop: '4px solid #0A1628'
                      }} />
                    </div>
                  )}
                </div>

                {/* Print Button */}
                <div style={{ position: 'relative' }}>
                  <button
                    onClick={openPrintView}
                    onMouseEnter={() => setHoveredButton('print')}
                    onMouseLeave={() => setHoveredButton(null)}
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '6px',
                      border: '1px solid #E2E8F0',
                      backgroundColor: '#FFFFFF',
                      fontSize: '18px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = '#F0F9FF';
                      e.currentTarget.style.borderColor = '#0070F3';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = '#FFFFFF';
                      e.currentTarget.style.borderColor = '#E2E8F0';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    🖨️
                  </button>
                  {hoveredButton === 'print' && (
                    <div style={{
                      position: 'absolute',
                      bottom: '100%',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      marginBottom: '8px',
                      padding: '6px 12px',
                      backgroundColor: '#0A1628',
                      color: '#FFFFFF',
                      fontSize: '12px',
                      borderRadius: '4px',
                      whiteSpace: 'nowrap',
                      zIndex: 1000
                    }}>
                      Print View
                      <div style={{
                        position: 'absolute',
                        bottom: '-4px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '0',
                        height: '0',
                        borderLeft: '4px solid transparent',
                        borderRight: '4px solid transparent',
                        borderTop: '4px solid #0A1628'
                      }} />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              {/* Auto-save indicator */}
              {saveStatus && (
                <div style={{
                  padding: '6px 12px',
                  borderRadius: '4px',
                  backgroundColor: saveStatus === 'saved' ? '#E8F5E9' : '#FFF3E0',
                  color: saveStatus === 'saved' ? '#2E7D32' : '#E65100',
                  fontSize: '13px',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  animation: 'fadeIn 0.3s ease'
                }}>
                  {saveStatus === 'saved' ? '✅' : '⏳'} 
                  {saveStatus === 'saved' ? 'Changes saved' : 'Saving...'}
                </div>
              )}
              
              <p style={{
                color: '#4A5568',
                margin: 0,
                fontSize: '13px'
              }}>
                Click child tasks to edit • Auto-saves on changes
              </p>
            </div>
          </div>

          {/* Gantt Chart Container */}
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '8px',
            padding: '32px 24px 24px',
            boxShadow: '0 5px 20px rgba(0,0,0,0.1)',
            overflowX: 'auto',
            position: 'relative'
          }}>
            {/* Today Line */}
            {currentWeek >= 1 && currentWeek <= 16 && (
              <>
                <div style={{
                  position: 'absolute',
                  left: `${224 + (currentWeek - 1) * 60 + todayPositionInWeek * 60}px`,
                  top: '40px',
                  bottom: '0',
                  width: '2px',
                  backgroundColor: '#DC2626',
                  zIndex: 10,
                  pointerEvents: 'none',
                  boxShadow: '0 0 8px rgba(220, 38, 38, 0.3)'
                }} />
                <div style={{
                  position: 'absolute',
                  left: `${224 + (currentWeek - 1) * 60 + todayPositionInWeek * 60 - 22}px`,
                  top: '12px',
                  backgroundColor: '#DC2626',
                  color: '#FFFFFF',
                  padding: '3px 10px',
                  borderRadius: '4px',
                  fontSize: '11px',
                  fontWeight: 'bold',
                  zIndex: 11,
                  boxShadow: '0 2px 6px rgba(220, 38, 38, 0.3)'
                }}>
                  Today
                </div>
              </>
            )}
            
            {/* Week Headers */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '200px repeat(16, 60px)',
              borderBottom: '2px solid #E2E8F0',
              paddingBottom: '8px',
              marginBottom: '16px',
              position: 'relative'
            }}>
              <div style={{
                fontWeight: 'bold',
                color: '#0A1628',
                fontSize: '14px'
              }}>
                Task Name
              </div>
              {weeks.map(week => {
                const weekDate = getWeekStartDate(week);
                const isPast = week < currentWeek;
                const isCurrent = week === currentWeek;
                const isFuture = week > currentWeek;
                
                return (
                  <div key={week} style={{
                    textAlign: 'center',
                    position: 'relative'
                  }}>
                    <div style={{
                      fontWeight: 'bold',
                      color: isCurrent ? '#0070F3' : (isPast ? '#9CA3AF' : '#0F1E36'),
                      fontSize: '12px',
                      backgroundColor: isCurrent ? 'rgba(0, 112, 243, 0.1)' : 'transparent',
                      padding: '2px 0',
                      borderRadius: '4px',
                      marginBottom: '2px'
                    }}>
                      W{week}
                    </div>
                    <div style={{
                      fontSize: '10px',
                      color: '#9CA3AF',
                      whiteSpace: 'nowrap'
                    }}>
                      {formatWeekDate(weekDate)}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Task Rows */}
            {organizedTasks.map((task, index) => (
              <div key={task.id} style={{
                display: 'grid',
                gridTemplateColumns: '200px repeat(16, 60px)',
                position: 'relative',
                marginBottom: task.isParent ? '8px' : '4px',
                paddingTop: task.isParent ? '8px' : '0'
              }}>
                {/* Task Name with Checkbox */}
                <div style={{
                  paddingLeft: task.isParent ? '0' : '24px',
                  fontWeight: task.isParent ? 'bold' : 'normal',
                  color: task.isParent ? '#0A1628' : '#4A5568',
                  fontSize: task.isParent ? '14px' : '13px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  textDecoration: task.completed ? 'line-through' : 'none',
                  opacity: task.completed ? 0.6 : 1
                }}>
                  {!task.isParent && (
                    <input
                      type="checkbox"
                      checked={task.completed || false}
                      onChange={(e) => toggleTaskCompletion(task.id, e)}
                      style={{
                        cursor: 'pointer',
                        width: '16px',
                        height: '16px'
                      }}
                    />
                  )}
                  {task.name}
                </div>

                {/* Task Bar */}
                <div style={{
                  gridColumn: `${task.startWeek + 1} / ${task.endWeek + 2}`,
                  position: 'relative'
                }}>
                  <div
                    onClick={() => handleTaskClick(task)}
                    style={{
                      backgroundColor: task.color,
                      height: task.isParent ? '32px' : '24px',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#FFFFFF',
                      fontSize: '11px',
                      fontWeight: task.isParent ? 'bold' : 'normal',
                      cursor: task.isParent ? 'default' : 'pointer',
                      transition: 'all 0.3s ease',
                      opacity: task.completed ? 0.6 : (task.isParent ? 0.9 : 1),
                      position: 'relative',
                      // Visual indicators
                      border: !task.isParent && !task.completed && task.endWeek < currentWeek 
                        ? '2px solid #DC2626' // Red border for overdue
                        : (task.isParent ? '2px solid rgba(0,0,0,0.1)' : 'none'),
                      boxShadow: !task.isParent && !task.completed && task.startWeek === currentWeek
                        ? '0 0 12px rgba(255, 193, 7, 0.6)' // Yellow glow for upcoming
                        : (task.isParent 
                          ? '0 2px 8px rgba(0,0,0,0.2)' 
                          : '0 1px 4px rgba(0,0,0,0.1)'),
                      ...(task.isParent ? {} : {
                        ':hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                        }
                      })
                    }}
                    onMouseEnter={(e) => {
                      if (!task.isParent) {
                        e.target.style.transform = 'translateY(-2px)';
                        const isUpcoming = !task.completed && task.startWeek === currentWeek;
                        e.target.style.boxShadow = isUpcoming 
                          ? '0 4px 16px rgba(255, 193, 7, 0.6)'
                          : '0 4px 12px rgba(0,0,0,0.2)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!task.isParent) {
                        e.target.style.transform = 'translateY(0)';
                        const isUpcoming = !task.completed && task.startWeek === currentWeek;
                        e.target.style.boxShadow = isUpcoming
                          ? '0 0 12px rgba(255, 193, 7, 0.6)'
                          : '0 1px 4px rgba(0,0,0,0.1)';
                      }
                    }}
                  >
                    {task.endWeek - task.startWeek > 1 ? `${task.endWeek - task.startWeek + 1} weeks` : ''}
                    {/* Green checkmark for completed tasks */}
                    {task.completed && !task.isParent && (
                      <div style={{
                        position: 'absolute',
                        right: '4px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        backgroundColor: '#4CAF50',
                        borderRadius: '50%',
                        width: '16px',
                        height: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '10px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                      }}>
                        ✓
                      </div>
                    )}
                  </div>
                </div>

                {/* Week Grid Lines with Past/Current/Future Highlighting */}
                {weeks.map(week => {
                  const isPast = week < currentWeek;
                  const isCurrent = week === currentWeek;
                  
                  return (
                    <div key={week} style={{
                      gridColumn: week + 1,
                      gridRow: 1,
                      borderLeft: '1px solid #F0F0F0',
                      height: '100%',
                      position: 'absolute',
                      top: 0,
                      backgroundColor: isCurrent ? 'rgba(0, 112, 243, 0.08)' : 
                                      (isPast ? 'rgba(156, 163, 175, 0.05)' : 'transparent'),
                      width: '60px',
                      zIndex: -1
                    }} />
                  );
                })}
              </div>
            ))}
          </div>

          {/* Statistics Dashboard */}
          <div style={{
            marginTop: '32px'
          }}>
            <h2 style={{
              color: '#0A1628',
              fontSize: '1.75rem',
              marginBottom: '24px',
              textAlign: 'center'
            }}>
              Project Statistics
            </h2>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '24px'
            }}>
              {/* Overall Progress Card */}
              <div style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '8px',
                padding: '24px',
                boxShadow: '0 5px 20px rgba(0,0,0,0.1)',
                textAlign: 'center'
              }}>
                <h3 style={{
                  color: '#0A1628',
                  fontSize: '16px',
                  marginBottom: '20px',
                  fontWeight: '600'
                }}>
                  Overall Progress
                </h3>
                
                {/* Circular Progress Indicator */}
                <div style={{
                  position: 'relative',
                  width: '120px',
                  height: '120px',
                  margin: '0 auto 16px'
                }}>
                  <svg width="120" height="120" style={{ transform: 'rotate(-90deg)' }}>
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      stroke="#E2E8F0"
                      strokeWidth="10"
                      fill="none"
                    />
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      stroke={getProgressColor(completionPercentage)}
                      strokeWidth="10"
                      fill="none"
                      strokeDasharray={`${(completionPercentage / 100) * 314} 314`}
                      style={{
                        transition: 'stroke-dasharray 0.5s ease'
                      }}
                    />
                  </svg>
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    fontSize: '28px',
                    fontWeight: 'bold',
                    color: getProgressColor(completionPercentage)
                  }}>
                    {completionPercentage}%
                  </div>
                </div>
                
                <p style={{
                  color: '#4A5568',
                  fontSize: '14px',
                  margin: 0
                }}>
                  {tasks.filter(t => !t.isParent && t.completed).length} of {tasks.filter(t => !t.isParent).length} tasks completed
                </p>
              </div>

              {/* Current Week Card */}
              <div style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '8px',
                padding: '24px',
                boxShadow: '0 5px 20px rgba(0,0,0,0.1)'
              }}>
                <h3 style={{
                  color: '#0A1628',
                  fontSize: '16px',
                  marginBottom: '20px',
                  fontWeight: '600'
                }}>
                  Current Week
                </h3>
                
                <div style={{
                  backgroundColor: '#E3F2FD',
                  borderRadius: '8px',
                  padding: '16px',
                  marginBottom: '16px',
                  textAlign: 'center'
                }}>
                  <div style={{
                    fontSize: '32px',
                    fontWeight: 'bold',
                    color: '#0070F3',
                    marginBottom: '4px'
                  }}>
                    Week {currentWeek}
                  </div>
                  <div style={{
                    fontSize: '14px',
                    color: '#4A5568'
                  }}>
                    of 16 weeks
                  </div>
                </div>
                
                <div>
                  <p style={{
                    fontSize: '13px',
                    color: '#4A5568',
                    marginBottom: '8px',
                    fontWeight: '600'
                  }}>
                    Active Tasks This Week:
                  </p>
                  <div style={{
                    maxHeight: '100px',
                    overflowY: 'auto'
                  }}>
                    {activeTasksThisWeek.length > 0 ? (
                      activeTasksThisWeek.map(task => (
                        <div key={task.id} style={{
                          fontSize: '12px',
                          color: '#0A1628',
                          padding: '4px 0',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}>
                          <div style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            backgroundColor: task.color
                          }} />
                          <span style={{
                            textDecoration: task.completed ? 'line-through' : 'none',
                            opacity: task.completed ? 0.6 : 1
                          }}>
                            {task.name}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p style={{
                        fontSize: '12px',
                        color: '#9CA3AF',
                        fontStyle: 'italic'
                      }}>
                        No active tasks this week
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Task Distribution Card */}
              <div style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '8px',
                padding: '24px',
                boxShadow: '0 5px 20px rgba(0,0,0,0.1)'
              }}>
                <h3 style={{
                  color: '#0A1628',
                  fontSize: '16px',
                  marginBottom: '20px',
                  fontWeight: '600'
                }}>
                  Task Distribution
                </h3>
                
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}>
                  {[
                    { type: 'MOP', data: taskDistribution.mop, color: '#2196F3' },
                    { type: 'SOP', data: taskDistribution.sop, color: '#FFC107' },
                    { type: 'EOP', data: taskDistribution.eop, color: '#4CAF50' }
                  ].map(({ type, data, color }) => (
                    <div key={type}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: '4px'
                      }}>
                        <span style={{
                          fontSize: '13px',
                          color: '#4A5568',
                          fontWeight: '600'
                        }}>
                          {type} Tasks
                        </span>
                        <span style={{
                          fontSize: '12px',
                          color: '#0A1628'
                        }}>
                          {data.completed}/{data.total}
                        </span>
                      </div>
                      <div style={{
                        height: '24px',
                        backgroundColor: '#E2E8F0',
                        borderRadius: '4px',
                        overflow: 'hidden',
                        position: 'relative'
                      }}>
                        <div style={{
                          height: '100%',
                          width: `${(data.completed / data.total) * 100 || 0}%`,
                          backgroundColor: color,
                          transition: 'width 0.5s ease',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          {data.total > 0 && (
                            <span style={{
                              fontSize: '11px',
                              color: '#FFFFFF',
                              fontWeight: '600'
                            }}>
                              {Math.round((data.completed / data.total) * 100)}%
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div style={{
                  marginTop: '16px',
                  padding: '12px',
                  backgroundColor: '#F9FAFB',
                  borderRadius: '6px'
                }}>
                  <p style={{
                    fontSize: '12px',
                    color: '#4A5568',
                    margin: 0,
                    textAlign: 'center'
                  }}>
                    Total: {taskDistribution.mop.completed + taskDistribution.sop.completed + taskDistribution.eop.completed} / {taskDistribution.mop.total + taskDistribution.sop.total + taskDistribution.eop.total} completed
                  </p>
                </div>
              </div>

              {/* Timeline Status Card */}
              <div style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '8px',
                padding: '24px',
                boxShadow: '0 5px 20px rgba(0,0,0,0.1)'
              }}>
                <h3 style={{
                  color: '#0A1628',
                  fontSize: '16px',
                  marginBottom: '20px',
                  fontWeight: '600'
                }}>
                  Timeline Status
                </h3>
                
                <div style={{
                  backgroundColor: timelineColor === '#4CAF50' ? '#E8F5E9' : 
                                  timelineColor === '#FF9800' ? '#FFF3E0' : '#FFEBEE',
                  borderRadius: '8px',
                  padding: '12px',
                  marginBottom: '16px',
                  textAlign: 'center'
                }}>
                  <div style={{
                    fontSize: '18px',
                    fontWeight: 'bold',
                    color: timelineColor,
                    marginBottom: '4px'
                  }}>
                    {timelineStatus}
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: '#4A5568'
                  }}>
                    {actualCompleted} completed / {expectedCompletionByNow} expected
                  </div>
                </div>
                
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  fontSize: '13px'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between'
                  }}>
                    <span style={{ color: '#4A5568' }}>Days Until End:</span>
                    <span style={{ 
                      color: '#0A1628', 
                      fontWeight: '600' 
                    }}>
                      {daysUntilEnd > 0 ? `${daysUntilEnd} days` : 'Overdue'}
                    </span>
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between'
                  }}>
                    <span style={{ color: '#4A5568' }}>Start Date:</span>
                    <span style={{ color: '#0A1628' }}>
                      {projectStartDate.toLocaleDateString()}
                    </span>
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between'
                  }}>
                    <span style={{ color: '#4A5568' }}>End Date:</span>
                    <span style={{ color: '#0A1628' }}>
                      {projectEndDate.toLocaleDateString()}
                    </span>
                  </div>
                </div>
                
                <div style={{
                  marginTop: '16px',
                  height: '4px',
                  backgroundColor: '#E2E8F0',
                  borderRadius: '2px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    height: '100%',
                    width: `${(currentWeek / 16) * 100}%`,
                    backgroundColor: timelineColor,
                    transition: 'width 0.5s ease'
                  }} />
                </div>
              </div>
            </div>
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
                  fontFamily: '"Century Gothic", sans-serif'
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
                    fontFamily: '"Century Gothic", sans-serif'
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
                  fontFamily: '"Century Gothic", sans-serif',
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
                  fontFamily: '"Century Gothic", sans-serif',
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
      )}

      {/* Add New Task Modal */}
      {showAddModal && (
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
      )}

      {/* Import Preview Modal */}
      {showImportModal && importPreview && (
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
                  fontFamily: '"Century Gothic", sans-serif',
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
      )}

      {/* Success Toast */}
      {showSuccessToast && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          backgroundColor: '#4CAF50',
          color: '#FFFFFF',
          padding: '16px 24px',
          borderRadius: '8px',
          boxShadow: '0 4px 20px rgba(76, 175, 80, 0.4)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          fontSize: '14px',
          fontWeight: '600',
          zIndex: 2000,
          animation: 'slideInUp 0.3s ease, fadeIn 0.3s ease'
        }}>
          <span style={{ fontSize: '20px' }}>✨</span>
          {toastMessage || 'Changes saved successfully!'}
        </div>
      )}

      {/* Animation Styles */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes slideInUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        @keyframes slideInDown {
          from {
            transform: translateY(-20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
}

export default withPageAuthRequired(Progress);