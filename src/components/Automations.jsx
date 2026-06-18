import React, { useState } from 'react';
import { Sparkles, Trash2, Plus, Zap, Filter, CheckCircle2 } from 'lucide-react';

export default function Automations() {
  const [rules, setRules] = useState([
    {
      id: 1,
      name: "Out of Office responder",
      platform: "all",
      triggerType: "time",
      triggerValue: "Outside business hours (9AM-5PM)",
      actionType: "reply",
      actionValue: "Hi! Thanks for contacting us. Our team is currently offline, but we'll review your message and get back to you first thing tomorrow morning. Have a great day!",
      active: true
    },
    {
      id: 2,
      name: "Pricing lead accelerator",
      platform: "gmail",
      triggerType: "keyword",
      triggerValue: "pricing, plans, subscription, cost",
      actionType: "ai_draft",
      actionValue: "Draft with AI using Persuasive tone",
      active: true
    },
    {
      id: 3,
      name: "Instagram welcome greeting",
      platform: "instagram",
      triggerType: "first_message",
      triggerValue: "First message from new sender",
      actionType: "reply",
      actionValue: "Hey there! Thanks for visiting my page and sending a DM. Let me know if you have any questions about my services! 🚀",
      active: false
    },
    {
      id: 4,
      name: "Urgent issue escalations",
      platform: "all",
      triggerType: "keyword",
      triggerValue: "bug, error, crash, broken, failed",
      actionType: "tag_alert",
      actionValue: "Apply 'Urgent Support' tag & send desktop alert",
      active: true
    }
  ]);

  // Form State for new rule builder
  const [ruleName, setRuleName] = useState('');
  const [rulePlatform, setRulePlatform] = useState('all');
  const [ruleTriggerType, setRuleTriggerType] = useState('keyword');
  const [ruleTriggerValue, setRuleTriggerValue] = useState('');
  const [ruleActionType, setRuleActionType] = useState('reply');
  const [ruleActionValue, setRuleActionValue] = useState('');
  const [toast, setToast] = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleAddRule = (e) => {
    e.preventDefault();
    if (!ruleName.trim()) return;

    let triggerVal = ruleTriggerValue;
    if (ruleTriggerType === 'first_message') {
      triggerVal = "First message from new sender";
    } else if (ruleTriggerType === 'time') {
      triggerVal = "Outside business hours (9AM-5PM)";
    }

    let actionVal = ruleActionValue;
    if (ruleActionType === 'ai_draft') {
      actionVal = "Draft with AI using Selected Tone";
    } else if (ruleActionType === 'tag_alert') {
      actionVal = "Apply 'Auto-Flag' tag & notify";
    }

    const newRule = {
      id: Date.now(),
      name: ruleName,
      platform: rulePlatform,
      triggerType: ruleTriggerType,
      triggerValue: triggerVal || 'Any trigger event',
      actionType: ruleActionType,
      actionValue: actionVal || 'Perform automation',
      active: true
    };

    setRules([newRule, ...rules]);
    showToast(`Rule "${ruleName}" created successfully!`);
    
    // Reset form
    setRuleName('');
    setRuleTriggerValue('');
    setRuleActionValue('');
  };

  const handleDeleteRule = (id) => {
    const ruleToDelete = rules.find(r => r.id === id);
    setRules(rules.filter(r => r.id !== id));
    if (ruleToDelete) showToast(`Rule "${ruleToDelete.name}" deleted`);
  };

  const toggleRuleActive = (id) => {
    setRules(rules.map(r => r.id === id ? { ...r, active: !r.active } : r));
  };

  return (
    <div className="view-container">
      {toast && (
        <div style={{
          position: 'absolute',
          top: '20px',
          right: '32px',
          background: 'rgba(138, 43, 226, 0.95)',
          color: '#fff',
          padding: '10px 20px',
          borderRadius: '8px',
          zIndex: 100,
          boxShadow: '0 4px 15px rgba(138, 43, 226, 0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          fontSize: '13px',
          fontWeight: '500',
          animation: 'fadeIn 0.2s ease'
        }}>
          <CheckCircle2 size={16} />
          {toast}
        </div>
      )}

      <div className="automations-container">
        {/* Left Side: Rules List */}
        <div className="glass-panel panel-card">
          <div className="section-header">
            <div>
              <h2>Active Automations</h2>
              <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Manage trigger actions and AI auto-response schedules across connected channels.
              </p>
            </div>
            <Zap size={20} style={{ color: 'var(--accent-purple)' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto', maxHeight: 'calc(100vh - 260px)' }}>
            {rules.map(rule => (
              <div 
                key={rule.id} 
                className="rule-item" 
                style={{ opacity: rule.active ? 1 : 0.6 }}
              >
                <div className="rule-meta">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      backgroundColor: rule.active ? 'var(--accent-blue)' : 'var(--text-muted)',
                      boxShadow: rule.active ? '0 0 8px var(--accent-blue)' : 'none'
                    }}></div>
                    <span className="rule-title">{rule.name}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div className="switch">
                      <input 
                        type="checkbox" 
                        id={`rule-toggle-${rule.id}`}
                        checked={rule.active}
                        onChange={() => toggleRuleActive(rule.id)}
                      />
                      <span className="slider"></span>
                    </div>
                    <button 
                      className="delete-rule-btn"
                      onClick={() => handleDeleteRule(rule.id)}
                      title="Delete rule"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                <div className="rule-logic">
                  <span>If platform is</span>
                  <span className="logic-block">{rule.platform.toUpperCase()}</span>
                  <span>and trigger is</span>
                  <span className="logic-block trigger">{rule.triggerValue}</span>
                  <span>then</span>
                  <span className="logic-block action">
                    {rule.actionType === 'reply' ? 'Auto-reply message' : rule.actionValue}
                  </span>
                </div>

                {rule.actionType === 'reply' && (
                  <div style={{
                    fontSize: '12px',
                    color: 'var(--text-secondary)',
                    background: 'rgba(0,0,0,0.2)',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    borderLeft: '2px solid var(--accent-blue)',
                    lineHeight: '1.4'
                  }}>
                    "{rule.actionValue}"
                  </div>
                )}

                <div className="rule-footer">
                  <span>Created: Just now</span>
                  <span>Trigger count: {rule.active ? Math.floor(Math.random() * 25) + 3 : 0} runs</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Create Rule Builder */}
        <div className="glass-panel panel-card" style={{ height: 'fit-content' }}>
          <div className="section-header">
            <div>
              <h2>Create New Rule</h2>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>Configure custom triggers.</p>
            </div>
            <Plus size={18} style={{ color: 'var(--accent-blue)' }} />
          </div>

          <form onSubmit={handleAddRule} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="builder-field">
              <label>Automation Name</label>
              <input 
                type="text" 
                className="builder-input" 
                placeholder="e.g., Pricing Inquiry Helper"
                value={ruleName}
                onChange={(e) => setRuleName(e.target.value)}
                required
              />
            </div>

            <div className="builder-field">
              <label>Apply to Channel</label>
              <select 
                className="builder-select"
                value={rulePlatform}
                onChange={(e) => setRulePlatform(e.target.value)}
              >
                <option value="all">All Linked Channels</option>
                <option value="gmail">Email (Gmail)</option>
                <option value="twitter">X / Twitter DM</option>
                <option value="linkedin">LinkedIn Message</option>
                <option value="instagram">Instagram DM</option>
              </select>
            </div>

            <div className="builder-row">
              <div className="builder-field">
                <label>Trigger Event</label>
                <select 
                  className="builder-select"
                  value={ruleTriggerType}
                  onChange={(e) => setRuleTriggerType(e.target.value)}
                >
                  <option value="keyword">Contains Keywords</option>
                  <option value="first_message">First DM Received</option>
                  <option value="time">Off-Hours Receipt</option>
                </select>
              </div>

              <div className="builder-field">
                <label>Response Action</label>
                <select 
                  className="builder-select"
                  value={ruleActionType}
                  onChange={(e) => setRuleActionType(e.target.value)}
                >
                  <option value="reply">Send Auto-Response</option>
                  <option value="ai_draft">Generate AI Draft</option>
                  <option value="tag_alert">Apply CRM Tag</option>
                </select>
              </div>
            </div>

            {ruleTriggerType === 'keyword' && (
              <div className="builder-field">
                <label>Target Keywords (comma separated)</label>
                <input 
                  type="text" 
                  className="builder-input"
                  placeholder="e.g., pricing, quotes, cost, standard"
                  value={ruleTriggerValue}
                  onChange={(e) => setRuleTriggerValue(e.target.value)}
                  required={ruleTriggerType === 'keyword'}
                />
              </div>
            )}

            {ruleActionType === 'reply' && (
              <div className="builder-field">
                <label>Auto-Reply Content</label>
                <textarea 
                  className="builder-textarea"
                  placeholder="Write response message..."
                  value={ruleActionValue}
                  onChange={(e) => setRuleActionValue(e.target.value)}
                  required={ruleActionType === 'reply'}
                />
              </div>
            )}

            <button type="submit" className="primary-btn" style={{ marginTop: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <Sparkles size={16} />
              <span>Enable Automation</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
