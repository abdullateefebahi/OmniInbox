import React, { useState } from 'react';
import { ArrowUpRight, ArrowDownRight, MessageSquare, Clock, Sparkles, Heart } from 'lucide-react';

export default function Analytics() {
  const [hoveredBar, setHoveredBar] = useState(null);

  // Mock data for weekly message volume
  const weeklyData = [
    { day: "Mon", email: 45, twitter: 30, linkedin: 15, instagram: 20 },
    { day: "Tue", email: 55, twitter: 40, linkedin: 20, instagram: 35 },
    { day: "Wed", email: 70, twitter: 50, linkedin: 30, instagram: 40 },
    { day: "Thu", email: 65, twitter: 45, linkedin: 25, instagram: 30 },
    { day: "Fri", email: 80, twitter: 60, linkedin: 35, instagram: 50 },
    { day: "Sat", email: 30, twitter: 25, linkedin: 10, instagram: 40 },
    { day: "Sun", email: 20, twitter: 15, linkedin: 8, instagram: 25 }
  ];

  return (
    <div className="view-container" style={{ overflowY: 'auto' }}>
      {/* Metric Cards Row */}
      <div className="analytics-metrics">
        <div className="glass-panel metric-card">
          <div className="metric-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MessageSquare size={14} style={{ color: 'var(--accent-purple)' }} />
            <span>Unified Messages</span>
          </div>
          <div className="metric-value">4,820</div>
          <div className="metric-trend up">
            <ArrowUpRight size={14} />
            <span>+12.4% vs last week</span>
          </div>
        </div>

        <div className="glass-panel metric-card">
          <div className="metric-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={14} style={{ color: 'var(--accent-blue)' }} />
            <span>Avg Response Time</span>
          </div>
          <div className="metric-value">4.2m</div>
          <div className="metric-trend up" style={{ color: 'var(--sentiment-positive)' }}>
            <ArrowDownRight size={14} style={{ color: 'var(--sentiment-positive)' }} />
            <span>-28% faster reply rate</span>
          </div>
        </div>

        <div className="glass-panel metric-card">
          <div className="metric-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={14} style={{ color: 'var(--accent-pink)' }} />
            <span>AI Copilot Assists</span>
          </div>
          <div className="metric-value">84.6%</div>
          <div className="metric-trend up">
            <ArrowUpRight size={14} />
            <span>+5.1% accepted drafts</span>
          </div>
        </div>

        <div className="glass-panel metric-card">
          <div className="metric-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Heart size={14} style={{ color: 'var(--sentiment-positive)' }} />
            <span>Customer Sentiment</span>
          </div>
          <div className="metric-value">78%</div>
          <div className="metric-trend up">
            <ArrowUpRight size={14} />
            <span>+3.2% positive emotions</span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="analytics-charts">
        {/* Chart 1: Platform Volume */}
        <div className="glass-panel chart-card">
          <h3 style={{ fontSize: '15px', fontWeight: '600' }}>Platform Message Volume</h3>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Daily breakdown of incoming messages across active integrations.</p>
          
          <div className="bar-chart-container" style={{ marginTop: '24px' }}>
            {weeklyData.map((data, index) => {
              const total = data.email + data.twitter + data.linkedin + data.instagram;
              // Map total to a height percentage up to 130px
              const height = (total / 250) * 140; 
              
              return (
                <div 
                  key={index} 
                  className="bar-col"
                  onMouseEnter={() => setHoveredBar(index)}
                  onMouseLeave={() => setHoveredBar(null)}
                >
                  <div 
                    className="bar-glow" 
                    style={{ height: `${height}px` }}
                  >
                    {/* Tooltip on Hover */}
                    {hoveredBar === index && (
                      <div style={{
                        position: 'absolute',
                        bottom: '105%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        background: 'var(--bg-tertiary)',
                        border: '1px solid var(--border-color)',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        zIndex: 20,
                        width: '120px',
                        textAlign: 'left',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                        fontSize: '10px',
                        pointerEvents: 'none'
                      }}>
                        <div style={{ fontWeight: '600', marginBottom: '4px', borderBottom: '1px solid var(--border-color)', pb: '4px' }}>{data.day} Details</div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Email:</span> <strong>{data.email}</strong></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Twitter:</span> <strong>{data.twitter}</strong></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>LinkedIn:</span> <strong>{data.linkedin}</strong></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Instagram:</span> <strong>{data.instagram}</strong></div>
                      </div>
                    )}
                  </div>
                  <span className="bar-label">{data.day}</span>
                </div>
              );
            })}
          </div>

          {/* Chart Legend */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', fontSize: '11px', marginTop: '12px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-purple)' }}></span> Email
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-blue)' }}></span> Twitter/X
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-pink)' }}></span> Instagram
            </span>
          </div>
        </div>

        {/* Chart 2: Customer Sentiment Index */}
        <div className="glass-panel chart-card">
          <h3 style={{ fontSize: '15px', fontWeight: '600' }}>Customer Sentiment Index</h3>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>AI-classified customer satisfaction and mood analysis.</p>

          <div className="chart-wrapper">
            <div className="sentiment-pie-mock">
              <div className="pie-circle"></div>
              
              <div className="pie-legend">
                <div className="legend-item">
                  <span className="legend-dot pos"></span>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>Positive (65%)</span>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>High praise, renewals, referrals</span>
                  </div>
                </div>
                <div className="legend-item">
                  <span className="legend-dot neu"></span>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>Neutral (20%)</span>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>General queries, pricing requests</span>
                  </div>
                </div>
                <div className="legend-item">
                  <span className="legend-dot neg"></span>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>Negative (15%)</span>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Bug reports, login issues, delays</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Extra Analytics Details */}
      <div className="glass-panel panel-card" style={{ marginTop: '24px' }}>
        <h3 style={{ fontSize: '15px', fontWeight: '600' }}>AI Automation Success Rates</h3>
        <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginTop: '4px' }}>
          Tracking AI Auto-responder correctness, sentiment trigger accuracy, and drafts that required zero human editing.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginTop: '16px' }}>
          <div style={{ borderLeft: '2px solid var(--accent-purple)', paddingLeft: '16px' }}>
            <div style={{ fontSize: '20px', fontWeight: '700' }}>92.4%</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>AI Sentiment Model Precision</div>
          </div>
          <div style={{ borderLeft: '2px solid var(--accent-blue)', paddingLeft: '16px' }}>
            <div style={{ fontSize: '20px', fontWeight: '700' }}>1,120</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>Fully Automated Auto-Replies</div>
          </div>
          <div style={{ borderLeft: '2px solid var(--accent-pink)', paddingLeft: '16px' }}>
            <div style={{ fontSize: '20px', fontWeight: '700' }}>45s</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>Avg Time Saved per Message</div>
          </div>
        </div>
      </div>
    </div>
  );
}
