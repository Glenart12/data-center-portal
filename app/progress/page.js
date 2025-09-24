'use client';
import { useState, useEffect, useRef } from 'react';
import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';

function ProgressPage() {
  // New structured task data with concurrent disciplines and 6-step cascade
  const [tasks, setTasks] = useState([
    // MOP Development - Mechanical (Blue #0070f3)
    {"id":101,"name":"Mechanical - Draft Generation","parentId":1,"startDate":"2025-09-12","endDate":"2025-09-14","color":"#0070f3","progress":100},
    {"id":102,"name":"Mechanical - Peer Review","parentId":1,"startDate":"2025-09-14","endDate":"2025-09-16","color":"#0070f3","progress":100},
    {"id":103,"name":"Mechanical - Tabletop/Dry Run","parentId":1,"startDate":"2025-09-16","endDate":"2025-09-18","color":"#0070f3","progress":75},
    {"id":104,"name":"Mechanical - Wet Run","parentId":1,"startDate":"2025-09-18","endDate":"2025-09-20","color":"#0070f3","progress":50},
    {"id":105,"name":"Mechanical - Chief Engineer Sign-Off","parentId":1,"startDate":"2025-09-20","endDate":"2025-09-21","color":"#0070f3","progress":25},
    {"id":106,"name":"Mechanical - SME Sign-Off","parentId":1,"startDate":"2025-09-21","endDate":"2025-09-22","color":"#0070f3","progress":0},

    // MOP Development - Electrical (Blue #0070f3)
    {"id":111,"name":"Electrical - Draft Generation","parentId":1,"startDate":"2025-09-12","endDate":"2025-09-14","color":"#0070f3","progress":100},
    {"id":112,"name":"Electrical - Peer Review","parentId":1,"startDate":"2025-09-14","endDate":"2025-09-16","color":"#0070f3","progress":100},
    {"id":113,"name":"Electrical - Tabletop/Dry Run","parentId":1,"startDate":"2025-09-16","endDate":"2025-09-18","color":"#0070f3","progress":60},
    {"id":114,"name":"Electrical - Wet Run","parentId":1,"startDate":"2025-09-18","endDate":"2025-09-20","color":"#0070f3","progress":30},
    {"id":115,"name":"Electrical - Chief Engineer Sign-Off","parentId":1,"startDate":"2025-09-20","endDate":"2025-09-21","color":"#0070f3","progress":0},
    {"id":116,"name":"Electrical - SME Sign-Off","parentId":1,"startDate":"2025-09-21","endDate":"2025-09-22","color":"#0070f3","progress":0},

    // MOP Development - White Space (Blue #0070f3)
    {"id":121,"name":"White Space - Draft Generation","parentId":1,"startDate":"2025-09-12","endDate":"2025-09-14","color":"#0070f3","progress":100},
    {"id":122,"name":"White Space - Peer Review","parentId":1,"startDate":"2025-09-14","endDate":"2025-09-16","color":"#0070f3","progress":90},
    {"id":123,"name":"White Space - Tabletop/Dry Run","parentId":1,"startDate":"2025-09-16","endDate":"2025-09-18","color":"#0070f3","progress":45},
    {"id":124,"name":"White Space - Wet Run","parentId":1,"startDate":"2025-09-18","endDate":"2025-09-20","color":"#0070f3","progress":20},
    {"id":125,"name":"White Space - Chief Engineer Sign-Off","parentId":1,"startDate":"2025-09-20","endDate":"2025-09-21","color":"#0070f3","progress":0},
    {"id":126,"name":"White Space - SME Sign-Off","parentId":1,"startDate":"2025-09-21","endDate":"2025-09-22","color":"#0070f3","progress":0},

    // SOP Procedures - Mechanical (Green #10B981)
    {"id":201,"name":"Mechanical - Draft Generation","parentId":2,"startDate":"2025-09-12","endDate":"2025-09-14","color":"#10B981","progress":100},
    {"id":202,"name":"Mechanical - Peer Review","parentId":2,"startDate":"2025-09-14","endDate":"2025-09-16","color":"#10B981","progress":80},
    {"id":203,"name":"Mechanical - Tabletop/Dry Run","parentId":2,"startDate":"2025-09-16","endDate":"2025-09-18","color":"#10B981","progress":50},
    {"id":204,"name":"Mechanical - Wet Run","parentId":2,"startDate":"2025-09-18","endDate":"2025-09-20","color":"#10B981","progress":25},
    {"id":205,"name":"Mechanical - Chief Engineer Sign-Off","parentId":2,"startDate":"2025-09-20","endDate":"2025-09-21","color":"#10B981","progress":0},
    {"id":206,"name":"Mechanical - SME Sign-Off","parentId":2,"startDate":"2025-09-21","endDate":"2025-09-22","color":"#10B981","progress":0},

    // SOP Procedures - Electrical (Green #10B981)
    {"id":211,"name":"Electrical - Draft Generation","parentId":2,"startDate":"2025-09-12","endDate":"2025-09-14","color":"#10B981","progress":100},
    {"id":212,"name":"Electrical - Peer Review","parentId":2,"startDate":"2025-09-14","endDate":"2025-09-16","color":"#10B981","progress":70},
    {"id":213,"name":"Electrical - Tabletop/Dry Run","parentId":2,"startDate":"2025-09-16","endDate":"2025-09-18","color":"#10B981","progress":40},
    {"id":214,"name":"Electrical - Wet Run","parentId":2,"startDate":"2025-09-18","endDate":"2025-09-20","color":"#10B981","progress":10},
    {"id":215,"name":"Electrical - Chief Engineer Sign-Off","parentId":2,"startDate":"2025-09-20","endDate":"2025-09-21","color":"#10B981","progress":0},
    {"id":216,"name":"Electrical - SME Sign-Off","parentId":2,"startDate":"2025-09-21","endDate":"2025-09-22","color":"#10B981","progress":0},

    // SOP Procedures - White Space (Green #10B981)
    {"id":221,"name":"White Space - Draft Generation","parentId":2,"startDate":"2025-09-12","endDate":"2025-09-14","color":"#10B981","progress":95},
    {"id":222,"name":"White Space - Peer Review","parentId":2,"startDate":"2025-09-14","endDate":"2025-09-16","color":"#10B981","progress":65},
    {"id":223,"name":"White Space - Tabletop/Dry Run","parentId":2,"startDate":"2025-09-16","endDate":"2025-09-18","color":"#10B981","progress":30},
    {"id":224,"name":"White Space - Wet Run","parentId":2,"startDate":"2025-09-18","endDate":"2025-09-20","color":"#10B981","progress":5},
    {"id":225,"name":"White Space - Chief Engineer Sign-Off","parentId":2,"startDate":"2025-09-20","endDate":"2025-09-21","color":"#10B981","progress":0},
    {"id":226,"name":"White Space - SME Sign-Off","parentId":2,"startDate":"2025-09-21","endDate":"2025-09-22","color":"#10B981","progress":0},

    // EOP Planning - Mechanical (Red #EF4444)
    {"id":301,"name":"Mechanical - Draft Generation","parentId":3,"startDate":"2025-09-12","endDate":"2025-09-14","color":"#EF4444","progress":85},
    {"id":302,"name":"Mechanical - Peer Review","parentId":3,"startDate":"2025-09-14","endDate":"2025-09-16","color":"#EF4444","progress":60},
    {"id":303,"name":"Mechanical - Tabletop/Dry Run","parentId":3,"startDate":"2025-09-16","endDate":"2025-09-18","color":"#EF4444","progress":30},
    {"id":304,"name":"Mechanical - Wet Run","parentId":3,"startDate":"2025-09-18","endDate":"2025-09-20","color":"#EF4444","progress":10},
    {"id":305,"name":"Mechanical - Chief Engineer Sign-Off","parentId":3,"startDate":"2025-09-20","endDate":"2025-09-21","color":"#EF4444","progress":0},
    {"id":306,"name":"Mechanical - SME Sign-Off","parentId":3,"startDate":"2025-09-21","endDate":"2025-09-22","color":"#EF4444","progress":0},

    // EOP Planning - Electrical (Red #EF4444)
    {"id":311,"name":"Electrical - Draft Generation","parentId":3,"startDate":"2025-09-12","endDate":"2025-09-14","color":"#EF4444","progress":80},
    {"id":312,"name":"Electrical - Peer Review","parentId":3,"startDate":"2025-09-14","endDate":"2025-09-16","color":"#EF4444","progress":55},
    {"id":313,"name":"Electrical - Tabletop/Dry Run","parentId":3,"startDate":"2025-09-16","endDate":"2025-09-18","color":"#EF4444","progress":25},
    {"id":314,"name":"Electrical - Wet Run","parentId":3,"startDate":"2025-09-18","endDate":"2025-09-20","color":"#EF4444","progress":5},
    {"id":315,"name":"Electrical - Chief Engineer Sign-Off","parentId":3,"startDate":"2025-09-20","endDate":"2025-09-21","color":"#EF4444","progress":0},
    {"id":316,"name":"Electrical - SME Sign-Off","parentId":3,"startDate":"2025-09-21","endDate":"2025-09-22","color":"#EF4444","progress":0},

    // EOP Planning - White Space (Red #EF4444)
    {"id":321,"name":"White Space - Draft Generation","parentId":3,"startDate":"2025-09-12","endDate":"2025-09-14","color":"#EF4444","progress":75},
    {"id":322,"name":"White Space - Peer Review","parentId":3,"startDate":"2025-09-14","endDate":"2025-09-16","color":"#EF4444","progress":50},
    {"id":323,"name":"White Space - Tabletop/Dry Run","parentId":3,"startDate":"2025-09-16","endDate":"2025-09-18","color":"#EF4444","progress":20},
    {"id":324,"name":"White Space - Wet Run","parentId":3,"startDate":"2025-09-18","endDate":"2025-09-20","color":"#EF4444","progress":0},
    {"id":325,"name":"White Space - Chief Engineer Sign-Off","parentId":3,"startDate":"2025-09-20","endDate":"2025-09-21","color":"#EF4444","progress":0},
    {"id":326,"name":"White Space - SME Sign-Off","parentId":3,"startDate":"2025-09-21","endDate":"2025-09-22","color":"#EF4444","progress":0},

    // Engineering Review - Keep existing tasks (Orange #F59E0B)
    {"id":1757702168699,"name":"Draft Review by CET 3","parentId":1757702125635,"startDate":"2025-10-01","endDate":"2025-10-05","color":"#F59E0B","progress":100},
    {"id":1757702195961,"name":"On Site Review","parentId":1757702125635,"startDate":"2025-10-06","endDate":"2025-10-10","color":"#F59E0B","progress":65},
    {"id":1757702244718,"name":"V2 Documents Generation","parentId":1757702125635,"startDate":"2025-10-11","endDate":"2025-10-15","color":"#F59E0B","progress":30}
  ]);
  const [parentTasks, setParentTasks] = useState([{"id":1,"name":"MOP Development","startDate":"2025-09-12","endDate":"2025-09-30"},{"id":2,"name":"SOP Procedures","startDate":"2025-09-12","endDate":"2025-09-30"},{"id":3,"name":"EOP Planning","startDate":"2025-09-12","endDate":"2025-09-30"},{"id":1757702125635,"name":"Engineering Review","startDate":"2025-10-01","endDate":"2025-10-15"}]);
  const [projectDates, setProjectDates] = useState({"startDate":"2025-09-12","endDate":"2025-10-31"});
  const [showAddTask, setShowAddTask] = useState(false);
  const [showAddParent, setShowAddParent] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [editingParent, setEditingParent] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1); // Default 100% zoom
  const [timelineOffset, setTimelineOffset] = useState(0); // for panning
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, scrollLeft: 0, scrollTop: 0 });
  const scrollContainerRef = useRef(null);
  const [selectedTaskDetails, setSelectedTaskDetails] = useState(null);

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

  // Calculate bar position and width with zoom support
  const calculateBarPosition = (startDate, endDate) => {
    const projectStart = new Date(projectDates.startDate);
    const projectEnd = new Date(projectDates.endDate);
    const projectDuration = (projectEnd - projectStart) / (1000 * 60 * 60 * 24);

    const taskStart = new Date(startDate);
    const taskEnd = new Date(endDate);

    const startOffset = (taskStart - projectStart) / (1000 * 60 * 60 * 24);
    const duration = (taskEnd - taskStart) / (1000 * 60 * 60 * 24) + 1;

    const left = (startOffset / projectDuration) * 100 * 1.18 * zoomLevel;
    const width = (duration / projectDuration) * 100 * 1.18 * zoomLevel;

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

  // Drag handlers for pan functionality
  const handleDragStart = (e) => {
    if (e.type.includes('touch')) {
      const touch = e.touches[0];
      setDragStart({
        x: touch.clientX,
        y: touch.clientY,
        scrollLeft: scrollContainerRef.current?.scrollLeft || 0,
        scrollTop: scrollContainerRef.current?.scrollTop || 0
      });
    } else {
      setDragStart({
        x: e.clientX,
        y: e.clientY,
        scrollLeft: scrollContainerRef.current?.scrollLeft || 0,
        scrollTop: scrollContainerRef.current?.scrollTop || 0
      });
    }
    setIsDragging(true);
  };

  const handleDragMove = (e) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();

    let clientX, clientY;
    if (e.type.includes('touch')) {
      const touch = e.touches[0];
      clientX = touch.clientX;
      clientY = touch.clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const deltaX = dragStart.x - clientX;
    const deltaY = dragStart.y - clientY;

    scrollContainerRef.current.scrollLeft = dragStart.scrollLeft + deltaX;
    scrollContainerRef.current.scrollTop = dragStart.scrollTop + deltaY;
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  // Helper function to abbreviate task names
  const abbreviateTaskName = (name) => {
    return name
      .replace('Mechanical', 'Mech')
      .replace('Electrical', 'Elec')
      .replace('White Space', 'WS')
      .replace('Draft Generation', 'Draft')
      .replace('Peer Review', 'Review')
      .replace('Tabletop/Dry Run', 'Dry Run')
      .replace('Wet Run', 'Wet')
      .replace('Chief Engineer Sign-Off', 'Chief Sign')
      .replace('SME Sign-Off', 'SME Sign');
  };

  // Get status based on progress
  const getTaskStatus = (progress) => {
    if (progress === 100) return 'Complete';
    if (progress > 0) return 'In Progress';
    return 'Not Started';
  };

  // Handle task selection
  const handleTaskClick = (task) => {
    const parentTask = parentTasks.find(p => p.id === task.parentId);
    const duration = Math.ceil((new Date(task.endDate) - new Date(task.startDate)) / (1000 * 60 * 60 * 24)) + 1;

    setSelectedTaskDetails({
      ...task,
      parentName: parentTask?.name || 'Unknown',
      duration,
      status: getTaskStatus(task.progress)
    });
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
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '24px'
          }}>
            <img
              src="/element-main-logo-gray.svg"
              alt="Element Critical"
              style={{
                height: '40px',
                width: 'auto',
                objectFit: 'contain'
              }}
            />
          </div>
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

          {/* Progress Dashboard Section */}
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
              PROGRESS DASHBOARD
            </div>

            {/* Card Content */}
            <div style={{
              padding: '32px'
            }}>
              {/* Percentage Complete Section */}
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#0A1628', marginBottom: '24px', textAlign: 'center' }}>
                PERCENTAGE COMPLETE
              </h2>

            {/* Progress Bars */}
            <div style={{ marginBottom: '32px', maxWidth: '100%' }}>
              {[
                { type: 'MOP', complete: 83, current: 134, total: 162 },
                { type: 'SOP', complete: 41, current: 62, total: 151 },
                { type: 'EOP', complete: 35, current: 57, total: 164 }
              ].map(item => (
                <div key={item.type} style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '60px', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                      {item.type}
                    </div>
                    <div style={{ flex: 1, position: 'relative', maxWidth: '100%' }}>
                      <div style={{
                        height: '24px',
                        backgroundColor: '#E5E7EB',
                        borderRadius: '4px',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          height: '100%',
                          width: `${item.complete}%`,
                          backgroundColor: '#0A1628',
                          transition: 'width 0.3s ease',
                          display: 'flex',
                          alignItems: 'center',
                          paddingLeft: '8px'
                        }}>
                          <span style={{ color: 'white', fontSize: '12px', fontWeight: 'bold' }}>
                            {item.complete}%
                          </span>
                        </div>
                      </div>
                    </div>
                    <div style={{ fontSize: '14px', color: '#6B7280' }}>
                      {item.current}/{item.total} Documents
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Category Dials Section */}
            <h3 style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#0A1628',
              marginBottom: '24px',
              marginTop: '48px',
              fontFamily: '"Century Gothic", "Questrial", -apple-system, sans-serif',
              textAlign: 'center'
            }}>
              CATEGORY BREAKDOWN
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '24px', width: '100%', overflow: 'hidden' }}>
              {[
                {
                  category: 'MOP',
                  gauges: [
                    { label: 'Mechanical', value: 100 },
                    { label: 'Electrical', value: 100 },
                    { label: 'White Space', value: 84 },
                    { label: 'Misc.', value: 49 }
                  ]
                },
                {
                  category: 'SOP',
                  gauges: [
                    { label: 'Mechanical', value: 76 },
                    { label: 'Electrical', value: 58 },
                    { label: 'White Space', value: 18 },
                    { label: 'Misc.', value: 13 }
                  ]
                },
                {
                  category: 'EOP',
                  gauges: [
                    { label: 'Mechanical', value: 57 },
                    { label: 'Electrical', value: 56 },
                    { label: 'White Space', value: 11 },
                    { label: 'Misc.', value: 14 }
                  ]
                }
              ].map(item => (
                <div key={item.category}>
                  <h4 style={{ fontSize: '16px', fontWeight: 'bold', color: '#0A1628', marginBottom: '16px', textAlign: 'center' }}>
                    {item.category}
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '16px', width: '100%' }}>
                    {item.gauges.map(gauge => (
                      <div key={gauge.label} style={{ textAlign: 'center' }}>
                        <HalfCircleGauge percentage={gauge.value} />
                        <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '-10px' }}>
                          {gauge.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            </div>
          </div>

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

            {/* Chart Content with Side Panel */}
            <div style={{ display: 'flex', padding: '24px', gap: '20px' }}>
            <div style={{ flex: selectedTaskDetails ? '1 1 0' : '1', transition: 'flex 0.3s ease', minWidth: 0 }}>
            {/* Zoom Controls */}
            <div
              data-testid="zoom-controls"
              style={{
              display: 'flex',
              gap: '10px',
              marginBottom: '16px',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <button
                onClick={() => setZoomLevel(Math.max(0.5, zoomLevel - 0.25))}
                style={{
                  padding: '6px 12px',
                  backgroundColor: '#F3F4F6',
                  border: '1px solid #E5E7EB',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  color: '#374151'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#E5E7EB'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#F3F4F6'}
              >
                −
              </button>
              <span style={{
                minWidth: '60px',
                textAlign: 'center',
                fontSize: '14px',
                fontWeight: 'bold',
                color: '#374151'
              }}>
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                onClick={() => setZoomLevel(Math.min(3, zoomLevel + 0.25))}
                style={{
                  padding: '6px 12px',
                  backgroundColor: '#F3F4F6',
                  border: '1px solid #E5E7EB',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  color: '#374151'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#E5E7EB'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#F3F4F6'}
              >
                +
              </button>
              <button
                onClick={() => {
                  setZoomLevel(1);
                  setTimelineOffset(0);
                }}
                style={{
                  padding: '6px 12px',
                  backgroundColor: zoomLevel === 1 ? '#E5E7EB' : '#F3F4F6',
                  border: '1px solid #E5E7EB',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  color: '#374151',
                  marginLeft: '10px'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#E5E7EB'}
                onMouseLeave={(e) => e.target.style.backgroundColor = zoomLevel === 1 ? '#E5E7EB' : '#F3F4F6'}
              >
                Reset
              </button>
            </div>
            {/* Fixed viewport container */}
            <style jsx>{`
              .gantt-scroll-container {
                scrollbar-width: thin;
                scrollbar-color: #0A1628 #E5E7EB;
              }
              .gantt-scroll-container::-webkit-scrollbar {
                width: 8px;
                height: 8px;
              }
              .gantt-scroll-container::-webkit-scrollbar-track {
                background-color: #E5E7EB;
                border-radius: 4px;
              }
              .gantt-scroll-container::-webkit-scrollbar-thumb {
                background-color: #0A1628;
                border-radius: 4px;
              }
              .gantt-scroll-container::-webkit-scrollbar-thumb:hover {
                background-color: #1A2738;
              }
              .gantt-scroll-container::-webkit-scrollbar-corner {
                background-color: #E5E7EB;
              }
            `}</style>
            <div
              className="gantt-scroll-container"
              ref={scrollContainerRef}
              data-testid="gantt-container"
              style={{
              height: '600px',
              width: '100%',
              overflowX: zoomLevel > 1 ? 'auto' : 'hidden',
              overflowY: 'auto',
              position: 'relative',
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
              backgroundColor: '#FFFFFF',
              touchAction: isDragging ? 'none' : 'pan-x pan-y',
              cursor: isDragging ? 'grabbing' : (zoomLevel > 1 ? 'grab' : 'default')
            }}
            onMouseDown={zoomLevel > 1 ? handleDragStart : undefined}
            onTouchStart={handleDragStart}
            onMouseMove={isDragging ? handleDragMove : undefined}
            onTouchMove={handleDragMove}
            onMouseUp={isDragging ? handleDragEnd : undefined}
            onTouchEnd={handleDragEnd}
            onMouseLeave={isDragging ? handleDragEnd : undefined}
            >
            <div style={{
              width: `${100 * 1.18 * zoomLevel}%`,
              minWidth: '100%',
              position: 'relative'
            }}>
            {/* Sticky Timeline Header */}
            <div
              data-testid="timeline-header"
              style={{
              display: 'flex',
              borderBottom: '2px solid #E5E7EB',
              paddingBottom: '16px',
              paddingTop: '16px',
              position: 'sticky',
              top: 0,
              backgroundColor: '#FFFFFF',
              zIndex: 20
            }}>
              {timeline.map((period, index) => (
                <div
                  key={index}
                  style={{
                    flex: 1,
                    textAlign: 'center',
                    fontSize: zoomLevel > 1.5 ? '13px' : '12px',
                    color: '#6B7280',
                    fontWeight: 'bold',
                    borderLeft: index > 0 ? '1px solid #E5E7EB' : 'none',
                    paddingLeft: '4px',
                    minWidth: zoomLevel > 1 ? '80px' : 'auto'
                  }}
                >
                  {period.label}
                </div>
              ))}
            </div>

            {/* Tasks */}
            <div style={{ position: 'relative' }}>
              {/* Today Line */}
              {(() => {
                const today = new Date();
                const projectStart = new Date(projectDates.startDate);
                const projectEnd = new Date(projectDates.endDate);
                const totalDays = (projectEnd - projectStart) / (1000 * 60 * 60 * 24);
                const daysFromStart = (today - projectStart) / (1000 * 60 * 60 * 24);
                const todayPosition = (daysFromStart / totalDays) * 100;

                if (todayPosition >= 0 && todayPosition <= 100) {
                  return (
                    <div style={{
                      position: 'absolute',
                      left: `${todayPosition}%`,
                      top: 0,
                      bottom: 0,
                      width: '2px',
                      backgroundColor: '#EF4444',
                      zIndex: 10,
                      pointerEvents: 'none'
                    }}>
                      <div style={{
                        position: 'absolute',
                        top: '-20px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        backgroundColor: '#EF4444',
                        color: 'white',
                        padding: '2px 6px',
                        borderRadius: '3px',
                        fontSize: '10px',
                        fontWeight: 'bold',
                        whiteSpace: 'nowrap'
                      }}>
                        TODAY
                      </div>
                    </div>
                  );
                }
                return null;
              })()}
              {parentTasks.map((parent, parentIndex) => (
                <div key={parent.id}>
                {/* Parent Task */}
                <div style={{ position: 'relative', marginBottom: '12px', minHeight: '40px', height: 'auto' }}>
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
                  <div key={task.id} style={{ position: 'relative', marginBottom: '8px', minHeight: '36px', height: 'auto', paddingLeft: '24px' }}>
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
                    {/* Task bar with progress */}
                    <div
                      onClick={() => handleTaskClick(task)}
                      style={{
                        position: 'absolute',
                        top: '8px',
                          minHeight: '24px',
                          height: 'auto',
                          backgroundColor: '#E5E7EB',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          overflow: 'hidden',
                          zIndex: 1,
                          ...calculateBarPosition(task.startDate, task.endDate)
                      }}
                    >
                      {/* Progress fill */}
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        bottom: 0,
                        width: `${task.progress || 0}%`,
                        backgroundColor: task.color || '#3B82F6',
                        transition: 'width 0.3s ease'
                      }} />
                      {/* Task text */}
                      <div style={{
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '4px 8px',
                        color: '#374151',
                        fontSize: '10px',
                        fontWeight: 'bold',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        zIndex: 2
                      }}>
                        <span>{abbreviateTaskName(task.name)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
            </div>
            </div>
            </div>
            </div>
            {/* Task Details Side Panel */}
            {selectedTaskDetails && (
              <div style={{
                width: '300px',
                flexShrink: 0,
                borderLeft: '1px solid #E5E7EB',
                padding: '20px',
                backgroundColor: '#FFFFFF',
                boxShadow: '-2px 0 10px rgba(0,0,0,0.05)',
                position: 'relative',
                animation: 'slideInRight 0.3s ease'
              }}>
                <style jsx>{`
                  @keyframes slideInRight {
                    from {
                      transform: translateX(100%);
                      opacity: 0;
                    }
                    to {
                      transform: translateX(0);
                      opacity: 1;
                    }
                  }
                `}</style>
                {/* Close button */}
                <button
                  onClick={() => setSelectedTaskDetails(null)}
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    background: 'none',
                    border: 'none',
                    fontSize: '20px',
                    cursor: 'pointer',
                    color: '#6B7280',
                    padding: '4px'
                  }}
                  onMouseEnter={(e) => e.target.style.color = '#374151'}
                  onMouseLeave={(e) => e.target.style.color = '#6B7280'}
                >
                  ×
                </button>

                <h3 style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  color: '#0A1628',
                  marginBottom: '20px',
                  paddingRight: '30px'
                }}>
                  Task Details
                </h3>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ fontSize: '12px', color: '#6B7280', display: 'block', marginBottom: '4px' }}>
                    Full Name
                  </label>
                  <div style={{ fontSize: '14px', color: '#374151', fontWeight: '600' }}>
                    {selectedTaskDetails.name}
                  </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ fontSize: '12px', color: '#6B7280', display: 'block', marginBottom: '8px' }}>
                    Progress
                  </label>
                  <div style={{ marginBottom: '8px' }}>
                    <div style={{
                      height: '8px',
                      backgroundColor: '#E5E7EB',
                      borderRadius: '4px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        height: '100%',
                        width: `${selectedTaskDetails.progress || 0}%`,
                        backgroundColor: selectedTaskDetails.color || '#3B82F6',
                        transition: 'width 0.3s ease'
                      }} />
                    </div>
                  </div>
                  <div style={{ fontSize: '14px', color: '#374151', fontWeight: 'bold' }}>
                    {selectedTaskDetails.progress || 0}%
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                  <div>
                    <label style={{ fontSize: '12px', color: '#6B7280', display: 'block', marginBottom: '4px' }}>
                      Start Date
                    </label>
                    <div style={{ fontSize: '14px', color: '#374151' }}>
                      {new Date(selectedTaskDetails.startDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', color: '#6B7280', display: 'block', marginBottom: '4px' }}>
                      End Date
                    </label>
                    <div style={{ fontSize: '14px', color: '#374151' }}>
                      {new Date(selectedTaskDetails.endDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                  <div>
                    <label style={{ fontSize: '12px', color: '#6B7280', display: 'block', marginBottom: '4px' }}>
                      Duration
                    </label>
                    <div style={{ fontSize: '14px', color: '#374151' }}>
                      {selectedTaskDetails.duration} days
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', color: '#6B7280', display: 'block', marginBottom: '4px' }}>
                      Phase
                    </label>
                    <div style={{ fontSize: '14px', color: '#374151' }}>
                      {selectedTaskDetails.parentName}
                    </div>
                  </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ fontSize: '12px', color: '#6B7280', display: 'block', marginBottom: '4px' }}>
                    Status
                  </label>
                  <div style={{
                    display: 'inline-block',
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '600',
                    backgroundColor: selectedTaskDetails.status === 'Complete' ? '#D1FAE5' :
                                   selectedTaskDetails.status === 'In Progress' ? '#FEF3C7' : '#F3F4F6',
                    color: selectedTaskDetails.status === 'Complete' ? '#065F46' :
                          selectedTaskDetails.status === 'In Progress' ? '#92400E' : '#6B7280'
                  }}>
                    {selectedTaskDetails.status}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setEditingTask(selectedTaskDetails);
                    setSelectedTaskDetails(null);
                  }}
                  style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: '#0A1628',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#1A2738'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#0A1628'}
                >
                  Edit Task
                </button>
              </div>
            )}
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
  const strokeWidth = 10;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * Math.PI;

  // Calculate the length of the colored portion (from left to percentage point)
  const filledLength = (percentage / 100) * circumference;

  // Determine color based on percentage
  const color = percentage <= 33 ? '#EF4444' :
                percentage <= 66 ? '#F59E0B' : '#10B981';

  return (
    <div style={{ position: 'relative', width: '120px', height: '90px', margin: '0 auto' }}>
      <svg
        width="120"
        height="70"
        viewBox="0 0 120 70"
        style={{ overflow: 'visible' }}
      >
        {/* Background arc - full grey semi-circle */}
        <path
          d="M 10 60 A 50 50 0 1 1 110 60"
          fill="none"
          stroke="#E5E7EB"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        {/* Colored arc - fills from left to right based on percentage */}
        <path
          d="M 10 60 A 50 50 0 1 1 110 60"
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${filledLength} ${circumference}`}
          strokeDashoffset={0}
          style={{
            transition: 'stroke-dasharray 0.5s ease',
            transformOrigin: 'center',
          }}
        />
      </svg>
      {/* Percentage text - positioned below the arc */}
      <div style={{
        position: 'absolute',
        bottom: '25px',
        left: '50%',
        transform: 'translateX(-50%)',
        fontSize: '16px',
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