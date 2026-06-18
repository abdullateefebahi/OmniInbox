// Supabase Edge Function: Webhook Receiver
// Decodes incoming webhooks from Meta, Gmail Pub/Sub, and Twitter DMs,
// normalizes them, analyzes sentiment, and writes them to PostgreSQL.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Handle Webhook Verification (GET request used by Meta/Instagram to verify the server)
    if (req.method === 'GET') {
      const url = new URL(req.url);
      const mode = url.searchParams.get('hub.mode');
      const token = url.searchParams.get('hub.verify_token');
      const challenge = url.searchParams.get('hub.challenge');

      // Customize your verification token here or use env
      const verifyToken = Deno.env.get('WEBHOOK_VERIFY_TOKEN') || 'omni_inbox_verify_token';

      if (mode === 'subscribe' && token === verifyToken) {
        return new Response(challenge, { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'text/plain' } 
        });
      }

      return new Response('Verification token mismatch', { 
        status: 403, 
        headers: { ...corsHeaders, 'Content-Type': 'text/plain' } 
      });
    }

    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Parse incoming payload
    const body = await req.json();
    const { 
      platform, 
      sender, 
      handle, 
      subject = '', 
      text, 
      external_thread_id, 
      external_message_id,
      avatar = '',
      email = '',
      phone = '',
      location = '',
      bio = ''
    } = body;

    // Validate required fields
    if (!platform || !sender || !text || !external_thread_id) {
      return new Response(JSON.stringify({ error: 'Missing required parameters' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Create Supabase client using service role key to bypass RLS policies
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    
    if (!supabaseUrl || !supabaseServiceKey) {
      return new Response(JSON.stringify({ error: 'Supabase server environment variables not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // 1. Analyze Sentiment (Mock Model)
    let sentiment = 'neutral';
    const lowerText = text.toLowerCase();
    if (
      lowerText.includes('error') || 
      lowerText.includes('broken') || 
      lowerText.includes('fail') || 
      lowerText.includes('crash') || 
      lowerText.includes('delay') || 
      lowerText.includes('poor')
    ) {
      sentiment = 'negative';
    } else if (
      lowerText.includes('love') || 
      lowerText.includes('thanks') || 
      lowerText.includes('great') || 
      lowerText.includes('awesome') || 
      lowerText.includes('upgrade') ||
      lowerText.includes('pricing')
    ) {
      sentiment = 'positive';
    }

    // 2. Fetch or create the thread
    // Find thread by platform + external_thread_id
    const { data: existingThreads, error: fetchError } = await supabase
      .from('threads')
      .select('*')
      .eq('platform', platform)
      .eq('external_thread_id', external_thread_id);

    if (fetchError) throw fetchError;

    let threadId;
    const threadData = {
      platform,
      external_thread_id,
      sender,
      handle,
      subject: subject || (platform === 'gmail' ? 'No Subject' : `${platform.toUpperCase()} DM`),
      snippet: text.substring(0, 100),
      unread: true,
      sentiment,
      avatar: avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(sender)}`,
      email: email || (platform === 'gmail' ? handle : ''),
      phone: phone || '',
      location: location || '',
      bio: bio || '',
      updated_at: new Date().toISOString()
    };

    if (existingThreads && existingThreads.length > 0) {
      // Thread exists, update it
      const thread = existingThreads[0];
      threadId = thread.id;
      
      const { error: updateError } = await supabase
        .from('threads')
        .update(threadData)
        .eq('id', threadId);

      if (updateError) throw updateError;
    } else {
      // Create new thread
      const { data: newThread, error: insertError } = await supabase
        .from('threads')
        .insert({
          ...threadData,
          tags: [platform.toUpperCase(), 'Inbox']
        })
        .select();

      if (insertError) throw insertError;
      threadId = newThread[0].id;
    }

    // 3. Insert message
    const { error: messageError } = await supabase
      .from('messages')
      .insert({
        thread_id: threadId,
        sender,
        text,
        is_sent: false,
        external_message_id: external_message_id || `msg-${Date.now()}`
      });

    if (messageError) throw messageError;

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Message processed and database updated', 
        threadId 
      }), 
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
