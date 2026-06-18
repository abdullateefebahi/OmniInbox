import React, { useState, useEffect } from 'react';
import { 
  Inbox, Sparkles, Send, BarChart3, Settings, 
  MessageSquare, User, Bell, HelpCircle 
} from 'lucide-react';
import UnifiedInbox from './components/UnifiedInbox';
import Automations from './components/Automations';
import Campaigns from './components/Campaigns';
import Analytics from './components/Analytics';
import SettingsView from './components/Settings';
import { supabase, supabaseConfigured } from './supabaseClient';

export default function App() {
  const [activeTab, setActiveTab] = useState('inbox');
  
  // Preseeded mock threads data as local fallback
  const mockThreads = [
    {
      id: 1,
      sender: "Sarah Jenkins",
      platform: "gmail",
      subject: "Loved the product walkthrough!",
      snippet: "We are primarily looking to sync our support emails (Gmail) and our Twitter/X customer support account. Can the automations handle multi-agent routing?",
      unread: true,
      flagged: false,
      autoReply: false,
      sentiment: "positive",
      time: "10:42 AM",
      handle: "sarah.j@techcorp.com",
      email: "sarah.j@techcorp.com",
      phone: "+1 (555) 019-2834",
      location: "San Francisco, CA",
      tags: ["Lead", "High-Value", "Email"],
      bio: "Lead Growth Engineer at TechCorp. Interested in scaling social automations to drive conversion rates.",
      messages: [
        { id: 1, sender: "Sarah Jenkins", time: "Yesterday", isSent: false, text: "Hi Abdul, really enjoyed our conversation yesterday. The product looks extremely promising. I have a quick question about integrations..." },
        { id: 2, sender: "Me", time: "Yesterday", isSent: true, text: "Hi Sarah! Thanks for the kind words. I'd be happy to answer any questions you have about integrations. Which platforms are you looking to connect?" },
        { id: 3, sender: "Sarah Jenkins", time: "10:42 AM", isSent: false, text: "We are primarily looking to sync our support emails (Gmail) and our Twitter/X customer support account. Can the automations handle multi-agent routing?" }
      ]
    },
    {
      id: 2,
      sender: "Alex Rivera",
      platform: "twitter",
      subject: "Upgrade to Pro Tier",
      snippet: "Hey! Can you send me the upgrade link for the Pro tier? Your templates are saving me hours of work every day.",
      unread: false,
      flagged: true,
      autoReply: true,
      sentiment: "positive",
      time: "Yesterday",
      handle: "@alex_rivera",
      email: "alex@riveramedia.co",
      phone: "N/A",
      location: "Miami, FL",
      tags: ["Customer", "Twitter"],
      bio: "Founder of Rivera Media, a creative content agency. Power user of OmniInbox social automations.",
      messages: [
        { id: 1, sender: "Alex Rivera", time: "Yesterday", isSent: false, text: "Hey! Can you send me the upgrade link for the Pro tier? Your templates are saving me hours of work every day." }
      ]
    },
    {
      id: 3,
      sender: "Marcus Chen",
      platform: "linkedin",
      subject: "Partnership proposal",
      snippet: "Hello Abdul, I came across your profile and noticed you are building OmniInbox. I lead partnerships at SendFlow...",
      unread: false,
      flagged: false,
      autoReply: false,
      sentiment: "neutral",
      time: "June 16",
      handle: "in/marcus-chen-sendflow",
      email: "marcus@sendflow.io",
      phone: "+1 (555) 489-0129",
      location: "New York, NY",
      tags: ["Partner", "LinkedIn"],
      bio: "VP of Partnerships at SendFlow. Specializes in API and webhook partnerships.",
      messages: [
        { id: 1, sender: "Marcus Chen", time: "June 16", isSent: false, text: "Hello Abdul, I came across your profile and noticed you are building OmniInbox. I lead partnerships at SendFlow. We build email delivery infrastructure and would love to explore a joint service agreement." }
      ]
    },
    {
      id: 4,
      sender: "Elena Petrova",
      platform: "instagram",
      subject: "Login error (500)",
      snippet: "Hello! I'm getting a 500 error when trying to sync my Instagram account. Please help, this is breaking my workflow.",
      unread: true,
      flagged: false,
      autoReply: false,
      sentiment: "negative",
      time: "June 15",
      handle: "@elena.fits",
      email: "elena@elena.fit",
      phone: "N/A",
      location: "London, UK",
      tags: ["Support", "Bug", "Instagram"],
      bio: "Fitness Influencer with 120k followers. Uses OmniInbox to auto-reply to brand deals and fan messages.",
      messages: [
        { id: 1, sender: "Elena Petrova", time: "June 15", isSent: false, text: "Hello! I'm getting a 500 error when trying to sync my Instagram account. Please help, this is breaking my workflow. I need to auto-reply to my fans." }
      ]
    }
  ];

  const [threads, setThreads] = useState(mockThreads);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch threads from Supabase if configured
  const fetchLiveThreads = async () => {
    if (!supabaseConfigured) return;
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('threads')
        .select(`
          *,
          messages (
            id,
            sender,
            text,
            time,
            is_sent,
            created_at
          )
        `)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      if (data) {
        // Sort messages inside each thread by created_at ascending
        const formattedThreads = data.map(thread => ({
          ...thread,
          messages: (thread.messages || []).sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
        }));
        setThreads(formattedThreads);
      }
    } catch (err) {
      console.error("Error fetching live threads:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (supabaseConfigured) {
      fetchLiveThreads();

      // Subscribe to real-time changes
      // When a thread or message changes, refresh the threads list
      const threadsSubscription = supabase
        .channel('supabase-realtime-feed')
        .on(
          'postgres_changes', 
          { event: '*', schema: 'public', table: 'threads' }, 
          () => { fetchLiveThreads(); }
        )
        .on(
          'postgres_changes', 
          { event: '*', schema: 'public', table: 'messages' }, 
          () => { fetchLiveThreads(); }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(threadsSubscription);
      };
    }
  }, []);

  // Write new sent message to Supabase
  const handleSendMessageLive = async (threadId, text) => {
    if (!supabaseConfigured) return;
    try {
      // 1. Insert message
      const { error: msgErr } = await supabase
        .from('messages')
        .insert({
          thread_id: threadId,
          sender: 'Me',
          text: text,
          is_sent: true,
          time: 'Just now'
        });

      if (msgErr) throw msgErr;

      // 2. Update thread metadata
      const { error: threadErr } = await supabase
        .from('threads')
        .update({
          snippet: text,
          unread: false,
          time: 'Just now',
          updated_at: new Date().toISOString()
        })
        .eq('id', threadId);

      if (threadErr) throw threadErr;
      
      // Refresh local view immediately
      await fetchLiveThreads();
    } catch (err) {
      console.error("Error sending message to live DB:", err);
    }
  };

  // Count unread threads for the sidebar badge
  const unreadCount = threads.filter(t => t.unread).length;

  const renderContent = () => {
    switch (activeTab) {
      case 'inbox':
        return (
          <UnifiedInbox 
            initialThreads={threads} 
            updateThreads={setThreads} 
            onSendMessageLive={handleSendMessageLive} 
          />
        );
      case 'automations':
        return <Automations />;
      case 'campaigns':
        return <Campaigns />;
      case 'analytics':
        return <Analytics />;
      case 'settings':
        return <SettingsView />;
      default:
        return (
          <UnifiedInbox 
            initialThreads={threads} 
            updateThreads={setThreads} 
            onSendMessageLive={handleSendMessageLive}
          />
        );
    }
  };

  const getHeaderTitle = () => {
    switch (activeTab) {
      case 'inbox': return 'Unified Inbox';
      case 'automations': return 'AI Automations & Rules';
      case 'campaigns': return 'Outreach Campaigns';
      case 'analytics': return 'Performance & Analytics';
      case 'settings': return 'Integrations & Settings';
      default: return 'Unified Inbox';
    }
  };

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="logo-section">
          <div className="logo-icon">
            <MessageSquare size={18} color="#fff" />
          </div>
          <span className="logo-text">OmniInbox</span>
        </div>

        <nav style={{ flex: 1 }}>
          <ul className="nav-links">
            <li 
              className={`nav-item ${activeTab === 'inbox' ? 'active' : ''}`}
              onClick={() => setActiveTab('inbox')}
            >
              <Inbox />
              <span>Inbox</span>
              {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
            </li>
            <li 
              className={`nav-item ${activeTab === 'automations' ? 'active' : ''}`}
              onClick={() => setActiveTab('automations')}
            >
              <Sparkles />
              <span>Automations</span>
            </li>
            <li 
              className={`nav-item ${activeTab === 'campaigns' ? 'active' : ''}`}
              onClick={() => setActiveTab('campaigns')}
            >
              <Send />
              <span>Campaigns</span>
            </li>
            <li 
              className={`nav-item ${activeTab === 'analytics' ? 'active' : ''}`}
              onClick={() => setActiveTab('analytics')}
            >
              <BarChart3 />
              <span>Analytics</span>
            </li>
            <li 
              className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              <Settings />
              <span>Settings</span>
            </li>
          </ul>
        </nav>

        <div className="sidebar-footer">
          <img 
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop" 
            alt="User Profile" 
            className="user-avatar"
          />
          <div className="user-info">
            <span className="user-name">Abdul Rahman</span>
            <span className="user-role">Workspace Owner</span>
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <main className="main-content">
        <header className="top-header">
          <div className="view-title-container">
            <h1 style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {getHeaderTitle()}
              {supabaseConfigured && (
                <span style={{
                  fontSize: '11px',
                  background: 'rgba(16, 185, 129, 0.12)',
                  color: 'var(--sentiment-positive)',
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                  padding: '3px 8px',
                  borderRadius: '12px',
                  fontWeight: '500'
                }}>
                  Live Sync
                </span>
              )}
            </h1>
          </div>

          <div className="header-actions">
            <button className="icon-btn" title="View alerts">
              <Bell size={16} />
              <span className="indicator"></span>
            </button>
            <button className="icon-btn" title="Help docs">
              <HelpCircle size={16} />
            </button>
          </div>
        </header>

        {renderContent()}
      </main>
    </div>
  );
}
