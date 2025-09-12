'use client';

import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import { useState, useEffect } from 'react';

function Progress() {
  const [mounted, setMounted] = useState(false);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    setMounted(true);
    
    // Initialize default tasks
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
    
    setTasks(defaultTasks);
  }, []);

  if (!mounted) {
    return <div>Loading...</div>;
  }

  const weeks = Array.from({ length: 16 }, (_, i) => i + 1);
  const chartWidth = 1200;
  const rowHeight = 30;
  const headerHeight = 40;
  const weekWidth = chartWidth / 16;

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
                    <div style={{
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
                      boxShadow: task.type === 'parent' ? '0 2px 4px rgba(0,0,0,0.2)' : '0 1px 2px rgba(0,0,0,0.1)'
                    }}>
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
    </div>
  );
}

export default withPageAuthRequired(Progress);