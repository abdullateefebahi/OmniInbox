import React, { useState } from 'react';
import { Mail, Send, Plus, Users, BarChart3, Clock, CheckCircle } from 'lucide-react';

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState([
    {
      id: 1,
      name: "Q3 Product Launch Announcement",
      channels: ["gmail", "linkedin"],
      status: "active",
      sentCount: 1420,
      openRate: "58.4%",
      clickRate: "14.2%",
      scheduledTime: "Running (Started 2 days ago)"
    },
    {
      id: 2,
      name: "Twitter DM Outreach (Beta Users)",
      channels: ["twitter"],
      status: "draft",
      sentCount: 0,
      openRate: "0%",
      clickRate: "0%",
      scheduledTime: "Draft"
    },
    {
      id: 3,
      name: "Customer Feedback & NPS Survey",
      channels: ["gmail", "instagram"],
      status: "active",
      sentCount: 680,
      openRate: "71.2%",
      clickRate: "32.8%",
      scheduledTime: "Running (Started 1 week ago)"
    }
  ]);

  const [name, setName] = useState('');
  const [targetSize, setTargetSize] = useState('250');
  const [selectedChannels, setSelectedChannels] = useState([]);
  const [campaignText, setCampaignText] = useState('');
  const [toast, setToast] = useState('');

  const toggleChannel = (channel) => {
    if (selectedChannels.includes(channel)) {
      setSelectedChannels(selectedChannels.filter(c => c !== channel));
    } else {
      setSelectedChannels([...selectedChannels, channel]);
    }
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleCreateCampaign = (e) => {
    e.preventDefault();
    if (!name.trim() || selectedChannels.length === 0) return;

    const newCampaign = {
      id: Date.now(),
      name,
      channels: selectedChannels,
      status: "active",
      sentCount: parseInt(targetSize),
      openRate: "Pending",
      clickRate: "Pending",
      scheduledTime: "Scheduled (Starting shortly)"
    };

    setCampaigns([newCampaign, ...campaigns]);
    showToast(`Campaign "${name}" has been launched!`);
    
    // Reset Form
    setName('');
    setSelectedChannels([]);
    setCampaignText('');
  };

  return (
    <div className="view-container">
      {toast && (
        <div style={{
          position: 'absolute',
          top: '20px',
          right: '32px',
          background: 'rgba(0, 188, 212, 0.95)',
          color: '#fff',
          padding: '10px 20px',
          borderRadius: '8px',
          zIndex: 100,
          boxShadow: '0 4px 15px rgba(0, 188, 212, 0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          fontSize: '13px',
          fontWeight: '500',
          animation: 'fadeIn 0.2s ease'
        }}>
          <CheckCircle size={16} />
          {toast}
        </div>
      )}

      <div className="campaigns-grid">
        {/* Left Side: Campaign List */}
        <div className="glass-panel panel-card">
          <div className="section-header">
            <div>
              <h2>Outreach Campaigns</h2>
              <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Create and monitor multi-platform messaging flows, newsletters, and promotional broadcasts.
              </p>
            </div>
            <Mail size={20} style={{ color: 'var(--accent-blue)' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto', maxHeight: 'calc(100vh - 260px)' }}>
            {campaigns.map(camp => (
              <div key={camp.id} className="campaign-item">
                <div className="campaign-info">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span className="campaign-name">{camp.name}</span>
                    <span className={`campaign-badge ${camp.status}`}>
                      {camp.status.toUpperCase()}
                    </span>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                    {camp.channels.map(ch => (
                      <span key={ch} style={{
                        fontSize: '10px',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid var(--border-color)',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        color: 'var(--text-secondary)',
                        textTransform: 'capitalize'
                      }}>
                        {ch}
                      </span>
                    ))}
                  </div>

                  <div className="campaign-stats" style={{ marginTop: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Users size={12} />
                      <span>{camp.sentCount > 0 ? `${camp.sentCount} recipients` : 'No recipients yet'}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <BarChart3 size={12} />
                      <span>Open: {camp.openRate} • Click: {camp.clickRate}</span>
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end' }}>
                    <Clock size={12} />
                    <span>{camp.scheduledTime}</span>
                  </div>
                  {camp.status === 'draft' ? (
                    <button 
                      className="primary-btn" 
                      style={{ fontSize: '11px', padding: '6px 12px' }}
                      onClick={() => {
                        const updated = campaigns.map(c => c.id === camp.id ? { ...c, status: 'active', sentCount: 150, openRate: 'Pending', clickRate: 'Pending', scheduledTime: 'Running (Started now)' } : c);
                        setCampaigns(updated);
                        showToast(`Campaign "${camp.name}" started!`);
                      }}
                    >
                      Launch Draft
                    </button>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Campaign Creator */}
        <div className="glass-panel panel-card" style={{ height: 'fit-content' }}>
          <div className="section-header">
            <div>
              <h2>New Blast Campaign</h2>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>Broadcast across channels.</p>
            </div>
            <Plus size={18} style={{ color: 'var(--accent-purple)' }} />
          </div>

          <form onSubmit={handleCreateCampaign} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="builder-field">
              <label>Campaign Name</label>
              <input 
                type="text" 
                className="builder-input" 
                placeholder="e.g., Summer Special Promo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="builder-field">
              <label>Select Blast Channels</label>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '4px' }}>
                {['gmail', 'twitter', 'linkedin', 'instagram'].map(ch => (
                  <button
                    key={ch}
                    type="button"
                    className={`filter-chip ${selectedChannels.includes(ch) ? 'active' : ''}`}
                    onClick={() => toggleChannel(ch)}
                    style={{ textTransform: 'capitalize' }}
                  >
                    {ch === 'gmail' ? 'Email' : ch === 'twitter' ? 'X / Twitter' : ch}
                  </button>
                ))}
              </div>
            </div>

            <div className="builder-field">
              <label>Audience Target Size</label>
              <select 
                className="builder-select"
                value={targetSize}
                onChange={(e) => setTargetSize(e.target.value)}
              >
                <option value="250">Small (250 contacts)</option>
                <option value="1200">Medium (1,200 contacts)</option>
                <option value="5000">Large (5,000 contacts)</option>
                <option value="15000">Enterprise Blast (15,000 contacts)</option>
              </select>
            </div>

            <div className="builder-field">
              <label>Message Template</label>
              <textarea 
                className="builder-textarea"
                placeholder="Hi {first_name}, wanted to share an update about..."
                value={campaignText}
                onChange={(e) => setCampaignText(e.target.value)}
                style={{ minHeight: '120px' }}
                required
              />
            </div>

            <button 
              type="submit" 
              className="glow-btn" 
              style={{ 
                marginTop: '8px', 
                padding: '12px', 
                borderRadius: '8px', 
                fontWeight: '600',
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: 8 
              }}
            >
              <Send size={16} />
              <span>Launch Campaign</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
