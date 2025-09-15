'use client';

import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import { useState } from 'react';

function RiskPage() {
  // State management
  const initialRisks = [
    { id: 1, title: 'Need Chief Engineer sign off on MOP revisions', score: 6, owner: 'GFM', category: 'Time', description: 'Chief Engineer approval is required for MOP revisions before implementation. Delay in approval could impact project timeline.' },
    { id: 2, title: 'Reviewal of SOP V1 Drafts needed by 9/22 to stay on schedule', score: 5, owner: 'Client', category: 'Time', description: 'SOP V1 drafts must be reviewed and approved by September 22 to maintain project schedule. Critical path item.' },
    { id: 3, title: 'EOP generation slightly behind schedule', score: 4, owner: 'GFM', category: 'Scope', description: 'Emergency Operating Procedures generation is running 2 weeks behind schedule. Additional resources may be needed.' },
    { id: 4, title: 'Resource allocation for Q4 maintenance pending', score: 3, owner: 'GFM', category: 'Cost', description: 'Q4 maintenance resource allocation not yet approved. Budget implications if not resolved by month end.' },
    { id: 5, title: 'Vendor certification expiring next month', score: 2, owner: 'Client', category: 'Quality', description: 'Critical vendor certification expires next month. Renewal process must be initiated immediately to avoid service disruption.' },
    { id: 6, title: 'Training completion rate below target', score: 1, owner: 'GFM', category: 'Cost', description: 'Current training completion rate is 65% vs 85% target. Additional training sessions may be required.' }
  ];

  const [risks, setRisks] = useState(initialRisks);
  const [selectedRisk, setSelectedRisk] = useState(initialRisks[0]);
  const [hoveredRisk, setHoveredRisk] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(null);

  // Calculate average risk score
  const averageScore = risks.reduce((sum, risk) => sum + risk.score, 0) / risks.length;

  // Calculate impact categories
  const impactCategories = risks.reduce((acc, risk) => {
    acc[risk.category] = (acc[risk.category] || 0) + 1;
    return acc;
  }, {});

  // Calculate risk owners
  const riskOwners = risks.reduce((acc, risk) => {
    acc[risk.owner] = (acc[risk.owner] || 0) + 1;
    return acc;
  }, {});
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
            textAlign: 'center',
            marginBottom: '32px',
            textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
          }}>
            DELAY AND RISK MANAGEMENT
          </h1>

          {/* Risk Dashboard Section */}
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
              RISK DASHBOARD
            </div>

            {/* Card Content */}
            <div style={{
              padding: '32px'
            }}>
              {/* Two-row grid layout */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gridTemplateRows: '280px 280px',
                gap: '24px',
                marginBottom: '32px'
              }}>
                {/* TOP PRIORITY SECTION - spans 2 rows */}
                <div style={{
                  backgroundColor: '#F8F9FA',
                  borderRadius: '8px',
                  padding: '20px',
                  gridRow: 'span 2',
                  boxSizing: 'border-box',
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '20px'
                  }}>
                    <h3 style={{
                      fontSize: '18px',
                      fontWeight: 'bold',
                      color: '#0A1628',
                      margin: 0,
                      fontFamily: '"Century Gothic", "Questrial", -apple-system, sans-serif'
                    }}>
                      TOP PRIORITY
                    </h3>
                    <button
                      style={{
                        backgroundColor: '#0A1628',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: '28px',
                        height: '28px',
                        fontSize: '20px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#1E3A5F';
                        e.currentTarget.style.transform = 'scale(1.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#0A1628';
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    >
                      +
                    </button>
                  </div>

                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    flex: 1
                  }}>
                    {risks.map((risk) => (
                      <div
                        key={risk.id}
                        style={{
                          backgroundColor: selectedRisk?.id === risk.id ? 'rgba(10, 22, 40, 0.05)' : 'white',
                          padding: '12px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          border: selectedRisk?.id === risk.id ? '2px solid #0A1628' : '1px solid #E5E7EB',
                          position: 'relative'
                        }}
                        onClick={() => setSelectedRisk(risk)}
                        onMouseEnter={() => setHoveredRisk(risk.id)}
                        onMouseLeave={() => setHoveredRisk(null)}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div style={{ flex: 1, paddingRight: '10px' }}>
                            <div style={{
                              fontSize: '14px',
                              color: '#374151',
                              marginBottom: '4px',
                              lineHeight: '1.4'
                            }}>
                              {risk.title}
                            </div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{
                              backgroundColor: risk.score >= 5 ? '#FEE2E2' : risk.score >= 3 ? '#FEF3C7' : '#D1FAE5',
                              color: risk.score >= 5 ? '#DC2626' : risk.score >= 3 ? '#F59E0B' : '#10B981',
                              padding: '4px 8px',
                              borderRadius: '4px',
                              fontSize: '12px',
                              fontWeight: 'bold',
                              minWidth: '20px',
                              textAlign: 'center'
                            }}>
                              {risk.score}
                            </div>
                            {hoveredRisk === risk.id && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setDropdownOpen(dropdownOpen === risk.id ? null : risk.id);
                                }}
                                style={{
                                  background: 'white',
                                  border: '1px solid #E5E7EB',
                                  borderRadius: '4px',
                                  padding: '2px 4px',
                                  cursor: 'pointer',
                                  fontSize: '14px',
                                  color: '#6B7280',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  width: '24px',
                                  height: '24px'
                                }}
                              >
                                ⋮
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Dropdown menu */}
                        {dropdownOpen === risk.id && (
                          <div
                            style={{
                              position: 'absolute',
                              top: '40px',
                              right: '8px',
                              backgroundColor: 'white',
                              border: '1px solid #E5E7EB',
                              borderRadius: '6px',
                              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                              zIndex: 1000,
                              minWidth: '100px'
                            }}
                          >
                            <button
                              style={{
                                display: 'block',
                                width: '100%',
                                padding: '8px 12px',
                                border: 'none',
                                background: 'none',
                                textAlign: 'left',
                                cursor: 'pointer',
                                fontSize: '14px',
                                color: '#374151'
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F3F4F6'}
                              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                              Edit
                            </button>
                            <button
                              style={{
                                display: 'block',
                                width: '100%',
                                padding: '8px 12px',
                                border: 'none',
                                background: 'none',
                                textAlign: 'left',
                                cursor: 'pointer',
                                fontSize: '14px',
                                color: '#DC2626'
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FEE2E2'}
                              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* RISK AVERAGE SCORE SPEEDOMETER */}
                <div style={{
                  backgroundColor: '#F8F9FA',
                  borderRadius: '8px',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  height: '280px',
                  boxSizing: 'border-box'
                }}>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: 'bold',
                    color: '#0A1628',
                    margin: 0,
                    marginBottom: '20px',
                    fontFamily: '"Century Gothic", "Questrial", -apple-system, sans-serif'
                  }}>
                    RISK AVERAGE SCORE
                  </h3>

                  {/* Speedometer Container */}
                  <div style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <div style={{ position: 'relative', width: '200px', height: '110px' }}>
                    <svg width="200" height="110" viewBox="0 0 200 110">
                      {/* Background arc - green to yellow to red */}
                      <defs>
                        <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#10B981" />
                          <stop offset="50%" stopColor="#F59E0B" />
                          <stop offset="100%" stopColor="#EF4444" />
                        </linearGradient>
                      </defs>

                      {/* Background arc */}
                      <path
                        d="M 20 100 A 80 80 0 0 1 180 100"
                        fill="none"
                        stroke="url(#gaugeGradient)"
                        strokeWidth="18"
                        strokeLinecap="round"
                      />

                      {/* Needle */}
                      <line
                        x1="100"
                        y1="100"
                        x2={100 + 65 * Math.cos((Math.PI * (1 - averageScore / 10)))}
                        y2={100 - 65 * Math.sin((Math.PI * (1 - averageScore / 10)))}
                        stroke="#0A1628"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />

                      {/* Center circle */}
                      <circle cx="100" cy="100" r="8" fill="#0A1628" />
                    </svg>

                    {/* Score display */}
                    <div style={{
                      position: 'absolute',
                      bottom: '-30px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      fontSize: '24px',
                      fontWeight: 'bold',
                      color: '#0A1628'
                    }}>
                      {averageScore.toFixed(1)}
                    </div>
                  </div>

                  <div style={{
                    marginTop: '35px',
                    fontSize: '14px',
                    color: '#6B7280',
                    textAlign: 'center'
                  }}>
                    Average Risk Score
                  </div>
                  </div>
                </div>

                {/* IMPACT CATEGORY CHART - top right */}
                <div style={{
                  backgroundColor: '#F8F9FA',
                  borderRadius: '8px',
                  padding: '20px',
                  height: '280px',
                  boxSizing: 'border-box',
                  display: 'flex',
                  flexDirection: 'column'
                  }}>
                    <h3 style={{
                      fontSize: '18px',
                      fontWeight: 'bold',
                      color: '#0A1628',
                      margin: 0,
                      marginBottom: '20px',
                      fontFamily: '"Century Gothic", "Questrial", -apple-system, sans-serif'
                    }}>
                      IMPACT CATEGORY
                    </h3>

                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px',
                      flex: 1
                    }}>
                      {['Cost', 'Time', 'Quality', 'Scope'].map(category => {
                        const count = impactCategories[category] || 0;
                        const maxCount = Math.max(...Object.values(impactCategories));
                        const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;

                        return (
                          <div key={category}>
                            <div style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              marginBottom: '4px',
                              fontSize: '14px',
                              color: '#374151'
                            }}>
                              <span>{category}</span>
                              <span style={{ fontWeight: 'bold' }}>{count}</span>
                            </div>
                            <div style={{
                              height: '20px',
                              backgroundColor: '#E5E7EB',
                              borderRadius: '4px',
                              overflow: 'hidden'
                            }}>
                              <div style={{
                                height: '100%',
                                width: `${percentage}%`,
                                backgroundColor: '#0A1628',
                                transition: 'width 0.3s ease'
                              }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                </div>

                {/* RISK STATUS DONUT CHART - center column, second row */}
                <div style={{
                  backgroundColor: '#F8F9FA',
                  borderRadius: '8px',
                  padding: '20px',
                  height: '280px',
                  boxSizing: 'border-box',
                  display: 'flex',
                  flexDirection: 'column'
                  }}>
                    <h3 style={{
                      fontSize: '18px',
                      fontWeight: 'bold',
                      color: '#0A1628',
                      margin: 0,
                      marginBottom: '20px',
                      fontFamily: '"Century Gothic", "Questrial", -apple-system, sans-serif'
                    }}>
                      RISK STATUS
                    </h3>

                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      flex: 1,
                      position: 'relative'
                    }}>
                      {/* Donut Chart - centered between title and legend */}
                      <div style={{
                        position: 'absolute',
                        width: '180px',
                        height: '180px',
                        top: '-20px',
                        left: '50%',
                        transform: 'translateX(-50%)'
                      }}>
                        <svg width="180" height="180" viewBox="0 0 180 180">
                          {(() => {
                            const total = risks.length;
                            const minor = risks.filter(r => r.score < 3).length;
                            const major = risks.filter(r => r.score >= 3 && r.score < 5).length;
                            const severe = risks.filter(r => r.score >= 5).length;

                            const radius = 70;
                            const innerRadius = 45;
                            const centerX = 90;
                            const centerY = 90;

                            let currentAngle = -90; // Start at top
                            const segments = [];

                            // Minor segment (green)
                            if (minor > 0) {
                              const angle = (minor / total) * 360;
                              const endAngle = currentAngle + angle;
                              const largeArc = angle > 180 ? 1 : 0;

                              const x1 = centerX + radius * Math.cos(currentAngle * Math.PI / 180);
                              const y1 = centerY + radius * Math.sin(currentAngle * Math.PI / 180);
                              const x2 = centerX + radius * Math.cos(endAngle * Math.PI / 180);
                              const y2 = centerY + radius * Math.sin(endAngle * Math.PI / 180);
                              const x3 = centerX + innerRadius * Math.cos(endAngle * Math.PI / 180);
                              const y3 = centerY + innerRadius * Math.sin(endAngle * Math.PI / 180);
                              const x4 = centerX + innerRadius * Math.cos(currentAngle * Math.PI / 180);
                              const y4 = centerY + innerRadius * Math.sin(currentAngle * Math.PI / 180);

                              segments.push(
                                <path
                                  key="minor"
                                  d={`M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4} Z`}
                                  fill="#10B981"
                                />
                              );
                              currentAngle = endAngle;
                            }

                            // Major segment (amber)
                            if (major > 0) {
                              const angle = (major / total) * 360;
                              const endAngle = currentAngle + angle;
                              const largeArc = angle > 180 ? 1 : 0;

                              const x1 = centerX + radius * Math.cos(currentAngle * Math.PI / 180);
                              const y1 = centerY + radius * Math.sin(currentAngle * Math.PI / 180);
                              const x2 = centerX + radius * Math.cos(endAngle * Math.PI / 180);
                              const y2 = centerY + radius * Math.sin(endAngle * Math.PI / 180);
                              const x3 = centerX + innerRadius * Math.cos(endAngle * Math.PI / 180);
                              const y3 = centerY + innerRadius * Math.sin(endAngle * Math.PI / 180);
                              const x4 = centerX + innerRadius * Math.cos(currentAngle * Math.PI / 180);
                              const y4 = centerY + innerRadius * Math.sin(currentAngle * Math.PI / 180);

                              segments.push(
                                <path
                                  key="major"
                                  d={`M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4} Z`}
                                  fill="#F59E0B"
                                />
                              );
                              currentAngle = endAngle;
                            }

                            // Severe segment (red)
                            if (severe > 0) {
                              const angle = (severe / total) * 360;
                              const endAngle = currentAngle + angle;
                              const largeArc = angle > 180 ? 1 : 0;

                              const x1 = centerX + radius * Math.cos(currentAngle * Math.PI / 180);
                              const y1 = centerY + radius * Math.sin(currentAngle * Math.PI / 180);
                              const x2 = centerX + radius * Math.cos(endAngle * Math.PI / 180);
                              const y2 = centerY + radius * Math.sin(endAngle * Math.PI / 180);
                              const x3 = centerX + innerRadius * Math.cos(endAngle * Math.PI / 180);
                              const y3 = centerY + innerRadius * Math.sin(endAngle * Math.PI / 180);
                              const x4 = centerX + innerRadius * Math.cos(currentAngle * Math.PI / 180);
                              const y4 = centerY + innerRadius * Math.sin(currentAngle * Math.PI / 180);

                              segments.push(
                                <path
                                  key="severe"
                                  d={`M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4} Z`}
                                  fill="#EF4444"
                                />
                              );
                            }

                            return segments;
                          })()}
                        </svg>

                        {/* Center text */}
                        <div style={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          textAlign: 'center'
                        }}>
                          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#0A1628' }}>
                            {risks.length}
                          </div>
                          <div style={{ fontSize: '14px', color: '#6B7280' }}>
                            risks
                          </div>
                        </div>
                      </div>

                      {/* Legend - positioned to align with 6th risk card bottom */}
                      <div style={{
                        display: 'flex',
                        gap: '16px',
                        position: 'absolute',
                        bottom: '25px',
                        left: '50%',
                        transform: 'translateX(-50%)'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10B981' }} />
                          <span style={{ fontSize: '12px', color: '#374151' }}>Minor</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#F59E0B' }} />
                          <span style={{ fontSize: '12px', color: '#374151' }}>Major</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#EF4444' }} />
                          <span style={{ fontSize: '12px', color: '#374151' }}>Severe</span>
                        </div>
                      </div>
                    </div>
                </div>

                {/* RISK OWNER CHART - right column, second row */}
                <div style={{
                  backgroundColor: '#F8F9FA',
                  borderRadius: '8px',
                  padding: '20px',
                  height: '280px',
                  boxSizing: 'border-box',
                  display: 'flex',
                  flexDirection: 'column'
                  }}>
                    <h3 style={{
                      fontSize: '18px',
                      fontWeight: 'bold',
                      color: '#0A1628',
                      margin: 0,
                      marginBottom: '20px',
                      fontFamily: '"Century Gothic", "Questrial", -apple-system, sans-serif'
                    }}>
                      RISK OWNER
                    </h3>

                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                      flex: 1
                    }}>
                      {Object.entries(riskOwners).map(([owner, count]) => {
                        const maxCount = Math.max(...Object.values(riskOwners));
                        const percentage = (count / maxCount) * 100;

                        return (
                          <div key={owner}>
                            <div style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              marginBottom: '4px',
                              fontSize: '14px',
                              color: '#374151'
                            }}>
                              <span>{owner}</span>
                              <span style={{ fontWeight: 'bold' }}>{count} risks</span>
                            </div>
                            <div style={{
                              height: '24px',
                              backgroundColor: '#E5E7EB',
                              borderRadius: '4px',
                              overflow: 'hidden'
                            }}>
                              <div style={{
                                height: '100%',
                                width: `${percentage}%`,
                                backgroundColor: '#0A1628',
                                transition: 'width 0.3s ease'
                              }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
              </div>

              {/* RISK DESCRIPTION SECTION */}
              <div style={{
                backgroundColor: '#F8F9FA',
                borderRadius: '8px',
                padding: '20px',
                minHeight: '150px'
              }}>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  color: '#0A1628',
                  margin: 0,
                  marginBottom: '20px',
                  fontFamily: '"Century Gothic", "Questrial", -apple-system, sans-serif'
                }}>
                  RISK DESCRIPTION
                </h3>

                {selectedRisk ? (
                  <div>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(4, 1fr)',
                      gap: '16px',
                      marginBottom: '16px'
                    }}>
                      <div>
                        <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '4px' }}>Risk Title</div>
                        <div style={{ fontSize: '14px', color: '#0A1628', fontWeight: '600' }}>{selectedRisk.title}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '4px' }}>Risk Score</div>
                        <div style={{
                          display: 'inline-block',
                          backgroundColor: selectedRisk.score >= 5 ? '#FEE2E2' : selectedRisk.score >= 3 ? '#FEF3C7' : '#D1FAE5',
                          color: selectedRisk.score >= 5 ? '#DC2626' : selectedRisk.score >= 3 ? '#F59E0B' : '#10B981',
                          padding: '4px 12px',
                          borderRadius: '4px',
                          fontSize: '14px',
                          fontWeight: 'bold'
                        }}>
                          {selectedRisk.score}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '4px' }}>Owner</div>
                        <div style={{ fontSize: '14px', color: '#0A1628', fontWeight: '600' }}>{selectedRisk.owner}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '4px' }}>Category</div>
                        <div style={{ fontSize: '14px', color: '#0A1628', fontWeight: '600' }}>{selectedRisk.category}</div>
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '4px' }}>Full Description</div>
                      <div style={{ fontSize: '14px', color: '#374151', lineHeight: '1.6' }}>
                        {selectedRisk.description}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div style={{
                    textAlign: 'center',
                    color: '#6B7280',
                    fontSize: '14px',
                    padding: '40px'
                  }}>
                    Select a risk to view details
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default withPageAuthRequired(RiskPage);