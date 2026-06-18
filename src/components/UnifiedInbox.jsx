import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, Mail, Send, Paperclip, 
  Sparkles, Check, Smile, AlertCircle, Tag, Phone, Globe, User, ShieldAlert 
} from 'lucide-react';
import { Twitter, Linkedin, Instagram } from './icons';

export default function UnifiedInbox({ initialThreads, updateThreads }) {
  const [threads, setThreads] = useState(initialThreads);
  const [activeThreadId, setActiveThreadId] = useState(initialThreads[0]?.id || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [platformFilter, setPlatformFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all'); // all, unread, flagged
  const [replyText, setReplyText] = useState('');
  const [selectedTone, setSelectedTone] = useState('friendly');
  const [aiDraft, setAiDraft] = useState('');
  const [isDrafting, setIsDrafting] = useState(false);
  const [successToast, setSuccessToast] = useState('');

  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of messages when active thread or messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeThreadId, threads]);

  const activeThread = threads.find(t => t.id === activeThreadId);

  // Filter threads based on platform, status, and search query
  const filteredThreads = threads.filter(thread => {
    const matchesSearch = 
      thread.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
      thread.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      thread.snippet.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesPlatform = platformFilter === 'all' || thread.platform === platformFilter;
    
    const matchesStatus = 
      statusFilter === 'all' || 
      (statusFilter === 'unread' && thread.unread) || 
      (statusFilter === 'flagged' && thread.flagged);

    return matchesSearch && matchesPlatform && matchesStatus;
  });

  // Handle message send
  const handleSendMessage = (e) => {
    if (e) e.preventDefault();
    if (!replyText.trim() || !activeThreadId) return;

    const newMessage = {
      id: Date.now(),
      sender: 'Me',
      time: 'Just now',
      isSent: true,
      text: replyText
    };

    const updated = threads.map(thread => {
      if (thread.id === activeThreadId) {
        return {
          ...thread,
          messages: [...thread.messages, newMessage],
          snippet: replyText,
          unread: false,
          time: 'Just now'
        };
      }
      return thread;
    });

    setThreads(updated);
    updateThreads(updated);
    setReplyText('');
    setAiDraft('');
  };

  // Simulate AI drafting based on conversation context and tone
  const generateAIDraft = () => {
    if (!activeThread) return;
    setIsDrafting(true);
    setAiDraft('');

    setTimeout(() => {
      const senderName = activeThread.sender.split(' ')[0];
      const context = activeThread.messages[activeThread.messages.length - 1]?.text || '';
      
      let response = '';
      if (selectedTone === 'professional') {
        response = `Dear ${senderName},\n\nThank you for reaching out. We appreciate your interest and would be happy to discuss this further. I will look into the details you provided and follow up with a detailed proposal by tomorrow morning.\n\nBest regards,\nAbdul`;
      } else if (selectedTone === 'friendly') {
        response = `Hi ${senderName}! Thanks for messaging. That sounds awesome, and I'd love to help you out with that! Let's definitely hop on a quick chat soon. How does Thursday afternoon sound for you? 😊\n\nCheers,\nAbdul`;
      } else if (selectedTone === 'empathetic') {
        response = `Hi ${senderName},\n\nI completely understand how frustrating that must be, and I am very sorry for the inconvenience. Let's get this resolved for you right away. Could you share your account email so I can look up the server log files?\n\nSincerely,\nAbdul`;
      } else {
        response = `Hey ${senderName}, quick follow-up on this! We can absolutely configure this automation workflow. I recommend jumping in on our premium tier so we can set up custom integrations. Let me know if you want the link!\n\nBest,\nAbdul`;
      }

      setAiDraft(response);
      setIsDrafting(false);
    }, 1200);
  };

  const applyAIDraft = () => {
    setReplyText(aiDraft);
    setAiDraft('');
    showToast('AI response populated!');
  };

  const showToast = (msg) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(''), 3000);
  };

  const toggleThreadFlag = (id) => {
    const updated = threads.map(t => t.id === id ? { ...t, flagged: !t.flagged } : t);
    setThreads(updated);
    updateThreads(updated);
    showToast(updated.find(t => t.id === id).flagged ? 'Thread flagged' : 'Thread unflagged');
  };

  const toggleThreadAutoReply = (id) => {
    const updated = threads.map(t => t.id === id ? { ...t, autoReply: !t.autoReply } : t);
    setThreads(updated);
    updateThreads(updated);
    showToast(updated.find(t => t.id === id).autoReply ? 'Auto-reply enabled' : 'Auto-reply disabled');
  };

  const getPlatformIcon = (platform, size = 14) => {
    switch(platform) {
      case 'gmail': return <Mail size={size} />;
      case 'twitter': return <Twitter size={size} />;
      case 'linkedin': return <Linkedin size={size} />;
      case 'instagram': return <Instagram size={size} />;
      default: return <Mail size={size} />;
    }
  };

  return (
    <div className="view-container inbox-view">
      {/* Toast Alert */}
      {successToast && (
        <div style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          background: 'rgba(16, 185, 129, 0.95)',
          color: '#fff',
          padding: '10px 20px',
          borderRadius: '8px',
          zIndex: 100,
          boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          fontSize: '13px',
          fontWeight: '500',
          backdropFilter: 'blur(4px)',
          animation: 'fadeIn 0.2s ease'
        }}>
          <Check size={16} />
          {successToast}
        </div>
      )}

      {/* Threads List Pane */}
      <div className="threads-pane">
        <div className="threads-search-bar">
          <div className="search-input-wrapper">
            <Search />
            <input 
              type="text" 
              placeholder="Search sender, message..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="inbox-filters">
          <div className="platform-filters">
            <button 
              className={`filter-chip ${platformFilter === 'all' ? 'active' : ''}`}
              onClick={() => setPlatformFilter('all')}
            >
              All Channels
            </button>
            <button 
              className={`filter-chip gmail ${platformFilter === 'gmail' ? 'active' : ''}`}
              onClick={() => setPlatformFilter('gmail')}
            >
              <Mail size={12} /> Email
            </button>
            <button 
              className={`filter-chip twitter ${platformFilter === 'twitter' ? 'active' : ''}`}
              onClick={() => setPlatformFilter('twitter')}
            >
              <Twitter size={12} /> X / Twitter
            </button>
            <button 
              className={`filter-chip linkedin ${platformFilter === 'linkedin' ? 'active' : ''}`}
              onClick={() => setPlatformFilter('linkedin')}
            >
              <Linkedin size={12} /> LinkedIn
            </button>
            <button 
              className={`filter-chip instagram ${platformFilter === 'instagram' ? 'active' : ''}`}
              onClick={() => setPlatformFilter('instagram')}
            >
              <Instagram size={12} /> Instagram
            </button>
          </div>

          <div className="status-tabs">
            <span 
              className={`status-tab ${statusFilter === 'all' ? 'active' : ''}`}
              onClick={() => setStatusFilter('all')}
            >
              All Messages
            </span>
            <span 
              className={`status-tab ${statusFilter === 'unread' ? 'active' : ''}`}
              onClick={() => setStatusFilter('unread')}
            >
              Unread
            </span>
            <span 
              className={`status-tab ${statusFilter === 'flagged' ? 'active' : ''}`}
              onClick={() => setStatusFilter('flagged')}
            >
              Flagged
            </span>
          </div>
        </div>

        <div className="threads-list">
          {filteredThreads.length === 0 ? (
            <div className="empty-state" style={{ padding: '40px 16px' }}>
              <AlertCircle size={32} />
              <div className="empty-state-title" style={{ fontSize: '15px' }}>No messages found</div>
              <div className="empty-state-text" style={{ fontSize: '12px' }}>Try adjusting your filters or search keywords.</div>
            </div>
          ) : (
            filteredThreads.map(thread => (
              <div 
                key={thread.id} 
                className={`thread-item ${activeThreadId === thread.id ? 'active' : ''} ${thread.unread ? 'unread' : ''}`}
                onClick={() => {
                  setActiveThreadId(thread.id);
                  // Mark as read
                  if (thread.unread) {
                    const updated = threads.map(t => t.id === thread.id ? { ...t, unread: false } : t);
                    setThreads(updated);
                    updateThreads(updated);
                  }
                }}
              >
                <div className="thread-header">
                  <span className="thread-sender">
                    <span className={`platform-badge ${thread.platform}`}>
                      {getPlatformIcon(thread.platform)}
                    </span>
                    {thread.sender}
                  </span>
                  <span className="thread-time">{thread.time}</span>
                </div>
                <div className="thread-subject">{thread.subject}</div>
                <div className="thread-snippet">{thread.snippet}</div>
                <div className="thread-footer">
                  <span className={`sentiment-tag ${thread.sentiment}`}>
                    {thread.sentiment}
                  </span>
                  {thread.autoReply && (
                    <span className="auto-reply-status">
                      <Sparkles size={10} /> Auto-Pilot
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Conversation Pane */}
      <div className="chat-pane">
        {activeThread ? (
          <>
            <div className="chat-header">
              <div className="chat-recipient-info">
                <img 
                  src={activeThread.avatar} 
                  alt={activeThread.sender} 
                  className="user-avatar" 
                  style={{ width: '38px', height: '38px' }}
                />
                <div className="chat-recipient-details">
                  <span className="chat-recipient-name">{activeThread.sender}</span>
                  <span className="chat-recipient-handle">{activeThread.handle}</span>
                </div>
              </div>
              <div className="chat-actions">
                <button 
                  className={`icon-btn ${activeThread.flagged ? 'active' : ''}`}
                  onClick={() => toggleThreadFlag(activeThread.id)}
                  title="Flag conversation"
                  style={{ color: activeThread.flagged ? 'var(--accent-pink)' : 'inherit', borderColor: activeThread.flagged ? 'var(--accent-pink)' : 'inherit' }}
                >
                  <Tag size={16} />
                </button>
              </div>
            </div>

            <div className="messages-scroller">
              {activeThread.messages.map(msg => (
                <div 
                  key={msg.id} 
                  className={`message-bubble-wrapper ${msg.isSent ? 'sent' : 'received'}`}
                >
                  <div className="message-meta">
                    {msg.sender} • {msg.time}
                  </div>
                  <div className="message-bubble">
                    {msg.text.split('\n').map((line, i) => <div key={i}>{line}</div>)}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* AI Banner Suggestions */}
            {aiDraft ? (
              <div className="ai-notification-banner">
                <Sparkles className="ai-banner-icon" size={16} />
                <div className="ai-banner-content">
                  <div className="ai-banner-title">AI Draft Suggestion ({selectedTone})</div>
                  <div className="ai-banner-text" style={{ fontStyle: 'italic', background: 'rgba(255,255,255,0.03)', padding: '8px', borderRadius: '6px', marginTop: '6px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    {aiDraft.split('\n').map((line, i) => <div key={i}>{line}</div>)}
                  </div>
                  <div className="ai-banner-actions">
                    <button className="mini-btn" onClick={applyAIDraft}>Use Suggestion</button>
                    <button className="mini-btn" style={{ background: 'transparent', borderColor: 'transparent', color: 'var(--text-secondary)' }} onClick={() => setAiDraft('')}>Dismiss</button>
                  </div>
                </div>
              </div>
            ) : null}

            {/* Message Input & AI Drafting Dock */}
            <div className="composer-pane">
              <div className="ai-assistant-tools">
                <div className="ai-tool-left">
                  <Sparkles size={14} />
                  <span>AI Copilot: Draft reply using tone</span>
                  <select 
                    className="tone-selector"
                    value={selectedTone}
                    onChange={(e) => setSelectedTone(e.target.value)}
                  >
                    <option value="friendly">😊 Friendly</option>
                    <option value="professional">💼 Professional</option>
                    <option value="empathetic">❤️ Empathetic</option>
                    <option value="persuasive">🔥 Persuasive</option>
                  </select>
                </div>
                <button 
                  className="ai-draft-trigger"
                  onClick={generateAIDraft}
                  disabled={isDrafting}
                >
                  {isDrafting ? 'Drafting...' : 'Generate AI Response'}
                </button>
              </div>

              <form onSubmit={handleSendMessage} className="composer-input-wrapper">
                <button type="button" className="composer-attach-btn" title="Attach files">
                  <Paperclip size={18} />
                </button>
                <textarea 
                  className="composer-text-area"
                  placeholder={`Reply to ${activeThread.sender.split(' ')[0]}...`}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <button type="submit" className="send-btn" title="Send message">
                  <Send size={16} />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="empty-state">
            <Mail size={48} />
            <div className="empty-state-title">No conversation selected</div>
            <div className="empty-state-text">Select an email or social media DM from the sidebar list to view the thread and compose replies.</div>
          </div>
        )}
      </div>

      {/* Right Contact Context Pane */}
      {activeThread && (
        <div className="detail-pane">
          <div className="contact-card">
            <img 
              src={activeThread.avatar} 
              alt={activeThread.sender} 
              className="contact-avatar"
            />
            <div className="contact-name">{activeThread.sender}</div>
            <div className="chat-recipient-handle" style={{ marginBottom: '8px' }}>{activeThread.handle}</div>
            <span className={`sentiment-tag ${activeThread.sentiment}`} style={{ transform: 'scale(0.9)' }}>
              Sentiment: {activeThread.sentiment}
            </span>
            <div className="contact-bio">
              {activeThread.bio || "No bio description provided. Syncing with CRM metadata."}
            </div>
          </div>

          <div className="detail-section">
            <div className="detail-section-title">Contact Information</div>
            <div className="info-grid">
              <div className="info-row">
                <span className="info-label">Email</span>
                <span className="info-value">{activeThread.email || "N/A"}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Phone</span>
                <span className="info-value">{activeThread.phone || "N/A"}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Location</span>
                <span className="info-value">{activeThread.location || "N/A"}</span>
              </div>
            </div>
          </div>

          <div className="detail-section">
            <div className="detail-section-title">Tags & Segments</div>
            <div className="tag-list">
              {activeThread.tags?.map((tag, i) => (
                <span key={i} className="contact-tag">{tag}</span>
              )) || <span className="contact-tag">Customer</span>}
            </div>
          </div>

          <div className="detail-section" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
            <div className="detail-section-title">Automation Rule</div>
            <div className="rule-toggle-row">
              <label htmlFor="auto-pilot-toggle" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Sparkles size={14} style={{ color: 'var(--accent-blue)' }} />
                <span>AI Auto-Pilot</span>
              </label>
              <div className="switch">
                <input 
                  type="checkbox" 
                  id="auto-pilot-toggle" 
                  checked={activeThread.autoReply || false} 
                  onChange={() => toggleThreadAutoReply(activeThread.id)}
                />
                <span className="slider"></span>
              </div>
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '8px', lineHeight: '1.4' }}>
              When enabled, incoming DMs/emails from this contact will trigger automatic drafts or direct auto-replies matching their sentiment classification.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
