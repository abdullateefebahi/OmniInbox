import React, { useState } from 'react';
import { Mail, ShieldCheck, Check, Sparkles } from 'lucide-react';
import { Twitter, Linkedin, Instagram, Facebook } from './icons';

export default function Settings() {
  const [integrations, setIntegrations] = useState([
    { id: 'gmail', name: 'Gmail', handle: 'abdul@gmail.com', connected: true, iconClass: 'gmail', icon: <Mail size={22} /> },
    { id: 'outlook', name: 'Outlook 365', handle: 'abdul@outlook.com', connected: false, iconClass: 'outlook', icon: <Mail size={22} /> },
    { id: 'twitter', name: 'X / Twitter', handle: '@abdul_dev', connected: true, iconClass: 'twitter', icon: <Twitter size={22} /> },
    { id: 'instagram', name: 'Instagram Business', handle: '@abdul.creations', connected: false, iconClass: 'instagram', icon: <Instagram size={22} /> },
    { id: 'linkedin', name: 'LinkedIn Professional', handle: 'in/abdul-engineer', connected: true, iconClass: 'linkedin', icon: <Linkedin size={22} /> },
    { id: 'facebook', name: 'Facebook Page', handle: 'fb.me/abdul.tech', connected: false, iconClass: 'facebook', icon: <Facebook size={22} /> }
  ]);

  const [connectingId, setConnectingId] = useState(null);
  const [globalInstructions, setGlobalInstructions] = useState(
    "Always draft messages with a polite, service-oriented tone. Highlight our standard pricing of $19/month if asked about costs. If the user mentions a bug, offer to escalate immediately to engineering."
  );

  const toggleConnection = (id) => {
    const integration = integrations.find(i => i.id === id);
    if (!integration.connected) {
      // Simulate OAuth connection delay
      setConnectingId(id);
      setTimeout(() => {
        setIntegrations(integrations.map(item => 
          item.id === id ? { ...item, connected: true } : item
        ));
        setConnectingId(null);
      }, 1500);
    } else {
      // Disconnect immediately
      setIntegrations(integrations.map(item => 
        item.id === id ? { ...item, connected: false } : item
      ));
    }
  };

  return (
    <div className="view-container" style={{ overflowY: 'auto' }}>
      <div className="settings-grid">
        {/* Connected Channels Grid */}
        <div className="glass-panel panel-card">
          <div className="section-header">
            <div>
              <h2>Linked Channels & Accounts</h2>
              <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Connect your email providers and social media business profiles to sync conversations in real time.
              </p>
            </div>
            <ShieldCheck size={20} style={{ color: 'var(--accent-purple)' }} />
          </div>

          <div className="integrations-list">
            {integrations.map(item => (
              <div key={item.id} className="integration-card">
                <div className="integration-info">
                  <div className={`integration-icon ${item.iconClass}`}>
                    {item.icon}
                  </div>
                  <div className="integration-details">
                    <span className="integration-name">{item.name}</span>
                    <span className={`integration-status ${item.connected ? 'connected' : 'disconnected'}`}>
                      {item.connected ? 'Connected' : 'Disconnected'}
                    </span>
                  </div>
                </div>

                <button 
                  className={`connect-btn ${item.connected ? 'connected' : ''}`}
                  onClick={() => toggleConnection(item.id)}
                  disabled={connectingId === item.id}
                  style={{ minWidth: '94px', textAlign: 'center' }}
                >
                  {connectingId === item.id ? (
                    'Connecting...'
                  ) : item.connected ? (
                    'Disconnect'
                  ) : (
                    'Connect'
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* AI Assistant Styling Rules */}
        <div className="glass-panel panel-card">
          <div className="section-header">
            <div>
              <h2>AI Agent Custom Guidelines</h2>
              <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Instruct the AI Copilot on how to draft responses, answer common queries, and match your brand voice.
              </p>
            </div>
            <Sparkles size={20} style={{ color: 'var(--accent-pink)' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="builder-field">
              <label>Global AI Copilot Instructions</label>
              <textarea 
                className="builder-textarea"
                style={{ minHeight: '110px', lineHeight: '1.5' }}
                value={globalInstructions}
                onChange={(e) => setGlobalInstructions(e.target.value)}
                placeholder="Instruct the AI on pricing, details, policies..."
              />
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                These guidelines will enrich the AI's context when generating reply drafts or automated replies in the inbox view.
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button 
                className="primary-btn" 
                style={{ padding: '10px 24px', display: 'flex', alignItems: 'center', gap: '8px' }}
                onClick={() => alert('AI Custom Guidelines updated successfully!')}
              >
                <Check size={16} />
                <span>Save Guidelines</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
