'use client';
import { useState, useEffect } from 'react';
import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';

function ProgressPage() {
  // Hardcoded data from localStorage as permanent default
  const [tasks, setTasks] = useState([{"id":1,"name":"Mechanical Generation","parentId":1,"startDate":"2025-09-12","endDate":"2025-09-17","color":"#2563EB"},{"id":2,"name":"Electrical Generation","parentId":1,"startDate":"2025-09-17","endDate":"2025-09-21","color":"#2563EB"},{"id":3,"name":"Mechanical Generation","parentId":2,"startDate":"2025-10-01","endDate":"2025-10-05","color":"#10B981"},{"id":4,"name":"Electrical Generation","parentId":2,"startDate":"2025-10-07","endDate":"2025-10-11","color":"#10B981"},{"id":5,"name":"Mechanical Generation","parentId":3,"startDate":"2025-10-23","endDate":"2025-10-27","color":"#EF4444"},{"id":6,"name":"Electrical Generation","parentId":3,"startDate":"2025-10-28","endDate":"2025-11-01","color":"#EF4444"},{"id":1757701444542,"name":"White Space Generation","parentId":1,"startDate":"2025-09-21","endDate":"2025-09-27","color":"#3B82F6"},{"id":1757701600098,"name":"Document Review","parentId":1,"startDate":"2025-09-27","endDate":"2025-09-30","color":"#3B82F6"},{"id":1757701810695,"name":"White Space Generation","parentId":2,"startDate":"2025-10-12","endDate":"2025-10-17","color":"#10B981"},{"id":1757701844124,"name":"Document Review","parentId":2,"startDate":"2025-10-18","endDate":"2025-10-22","color":"#10B981"},{"id":1757702001687,"name":"White Space Generation","parentId":3,"startDate":"2025-11-02","endDate":"2025-11-07","color":"#EF4444"},{"id":1757702041103,"name":"Document Review","parentId":3,"startDate":"2025-11-08","endDate":"2025-11-12","color":"#EF4444"},{"id":1757702168699,"name":"Draft Review by CET 3","parentId":1757702125635,"startDate":"2025-11-13","endDate":"2025-11-17","color":"#F59E0B"},{"id":1757702195961,"name":"On Site Review","parentId":1757702125635,"startDate":"2025-11-19","endDate":"2025-11-24","color":"#F59E0B"},{"id":1757702244718,"name":"V2 Documents Generation","parentId":1757702125635,"startDate":"2025-11-26","endDate":"2025-11-30","color":"#F59E0B"},{"id":1757939647783,"name":"SOP Review","parentId":"","startDate":"2025-10-08","endDate":"2025-10-15","color":"#10B981"}]);
  const [parentTasks, setParentTasks] = useState([{"id":1,"name":"MOP Development","startDate":"2025-09-12","endDate":"2025-09-30"},{"id":2,"name":"SOP Procedures","startDate":"2025-10-01","endDate":"2025-10-22"},{"id":3,"name":"EOP Planning","startDate":"2025-10-23","endDate":"2025-11-12"},{"id":1757702125635,"name":"Engineering Review","startDate":"2025-11-13","endDate":"2025-11-30"}]);
  const [projectDates, setProjectDates] = useState({"startDate":"2025-09-12","endDate":"2025-12-11"});
  const [showAddTask, setShowAddTask] = useState(false);
  const [showAddParent, setShowAddParent] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [editingParent, setEditingParent] = useState(null);

  // COMMENTED OUT - Using hardcoded data as source of truth
  // Load data from localStorage is disabled to use hardcoded defaults
  /*
  useEffect(() => {
    const savedTasks = localStorage.getItem('ganttTasks');
    const savedParents = localStorage.getItem('ganttParents');
    const savedDates = localStorage.getItem('ganttDates');

    if (savedTasks) setTasks(JSON.parse(savedTasks));
    if (savedParents) setParentTasks(JSON.parse(savedParents));
    if (savedDates) setProjectDates(JSON.parse(savedDates));
  }, []);
  */

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
        paddingTop: '100px',
        fontFamily: '"Century Gothic", "Questrial", -apple-system, sans-serif',
        position: 'relative',
        zIndex: 1,
        minHeight: '100vh'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <h1 style={{
            color: '#0A1628',
            fontSize: '2.25rem',
            marginBottom: '32px',
            fontWeight: 'bold',
            textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            PROJECT PROGRESS
          </h1>

          {/* Gantt Chart */}
          <div style={{
            marginTop: '32px',
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            width: '100%',
            boxSizing: 'border-box',
            overflow: 'hidden'
          }}>
            {/* Navy Header Bar */}
            <div style={{
              backgroundColor: '#0A1628',
              padding: '16px 24px',
              color: '#FFFFFF',
              fontSize: '20px',
              fontWeight: 'bold',
              fontFamily: '"Century Gothic", "Questrial", -apple-system, sans-serif'
            }}>
              PROJECT TIMELINE
            </div>

            {/* Chart Content */}
            <div style={{ padding: '24px' }}>
            <div style={{ overflow: 'visible' }}>
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
                    fontWeight: 'bold',
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
                <div style={{ position: 'relative', marginBottom: '4px', minHeight: '40px', height: 'auto' }}>
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
                        minHeight: '32px',
                        height: 'auto',
                        backgroundColor: '#0A1628',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '4px 8px',
                        color: 'white',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        whiteSpace: 'normal',
                        wordWrap: 'break-word',
                        zIndex: 1,
                        ...calculateBarPosition(parent.startDate, parent.endDate)
                      }}
                    >
                      {parent.name}
                  </div>
                </div>

                {/* Child Tasks */}
                {tasks.filter(t => t.parentId === parent.id).map(task => (
                  <div key={task.id} style={{ position: 'relative', marginBottom: '4px', minHeight: '36px', height: 'auto', paddingLeft: '24px' }}>
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
                          minHeight: '24px',
                          height: 'auto',
                          backgroundColor: task.color || '#3B82F6',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          padding: '4px 8px',
                          color: 'white',
                          fontSize: '11px',
                          whiteSpace: 'normal',
                          wordWrap: 'break-word',
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
          </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '16px', marginTop: '32px' }}>
            <button
              onClick={() => setShowAddTask(true)}
              style={{
                padding: '12px 24px',
                backgroundColor: '#0A1628',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '600',
                fontFamily: '"Century Gothic", "Questrial", -apple-system, sans-serif',
                cursor: 'pointer',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#1A2738';
                e.target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#0A1628';
                e.target.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
              }}
            >
              Add Task
            </button>
            <button
              onClick={() => setShowAddParent(true)}
              style={{
                padding: '12px 24px',
                backgroundColor: '#0A1628',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '600',
                fontFamily: '"Century Gothic", "Questrial", -apple-system, sans-serif',
                cursor: 'pointer',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#1A2738';
                e.target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#0A1628';
                e.target.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
              }}
            >
              Add Parent Task
            </button>
            <button
              onClick={() => setShowTimeline(true)}
              style={{
                padding: '12px 24px',
                backgroundColor: '#0A1628',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '600',
                fontFamily: '"Century Gothic", "Questrial", -apple-system, sans-serif',
                cursor: 'pointer',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#1A2738';
                e.target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#0A1628';
                e.target.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
              }}
            >
              Timeline Settings
            </button>
          </div>

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
    </>
  );
}

// Half Circle Gauge Component
function HalfCircleGauge({ percentage }) {
  const radius = 50;
  const strokeWidth = 8;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  // Determine color based on percentage
  const color = percentage <= 33 ? '#EF4444' : 
                percentage <= 66 ? '#F59E0B' : '#10B981';
  
  return (
    <div style={{ position: 'relative', width: '120px', height: '60px', margin: '0 auto' }}>
      <svg
        width="120"
        height="70"
        viewBox="0 0 120 70"
        style={{ transform: 'rotate(180deg)' }}
      >
        {/* Background arc */}
        <path
          d="M 10 60 A 50 50 0 0 1 110 60"
          fill="none"
          stroke="#E5E7EB"
          strokeWidth={strokeWidth}
        />
        {/* Filled arc */}
        <path
          d="M 10 60 A 50 50 0 0 1 110 60"
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          style={{ transition: 'stroke-dashoffset 0.5s ease' }}
        />
      </svg>
      {/* Percentage text */}
      <div style={{
        position: 'absolute',
        top: '35px',
        left: '50%',
        transform: 'translateX(-50%)',
        fontSize: '14px',
        fontWeight: 'bold',
        color: '#0A1628'
      }}>
        {percentage}%
      </div>
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
          <div style={{ display: 'flex', gap: '8px' }}>
            {['#EF4444', '#F59E0B', '#10B981', '#2563EB'].map(color => (
              <div
                key={color}
                onClick={() => setFormData({ ...formData, color })}
                style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: color,
                  borderRadius: '4px',
                  cursor: 'pointer',
                  border: formData.color === color ? '3px solid #0A1628' : '2px solid transparent',
                  opacity: formData.color === color ? 1 : 0.8,
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  if (formData.color !== color) {
                    e.currentTarget.style.opacity = '1';
                  }
                }}
                onMouseLeave={(e) => {
                  if (formData.color !== color) {
                    e.currentTarget.style.opacity = '0.8';
                  }
                }}
              />
            ))}
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