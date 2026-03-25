import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import SandboxActiveView from '../components/sandbox/SandboxActiveView';

export default function SandboxSession() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !sessionId) return;

    const fetchSession = async () => {
      const { data, error } = await supabase
        .from('sandbox_sessions')
        .select('*')
        .eq('id', sessionId)
        .eq('user_id', user.id)
        .single();
      
      const payload = data as any;
      if (error || !payload) {
        navigate('/dashboard');
        return;
      }

      if (payload.status !== 'active') {
        navigate('/dashboard');
        return;
      }
      
      setSession(data);
      setLoading(false);
    };

    fetchSession();
  }, [user, sessionId, navigate]);

  if (loading || !session) return null;

  return <SandboxActiveView session={session} />;
}
