import React, { useState } from 'react';

function App() {
  const [backendUrl, setBackendUrl] = useState(
    import.meta.env.VITE_BACKEND_URL || ''
  );
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Azure Architecture OTP / Alert');
  const [message, setMessage] = useState('Greetings! Intha email Azure Architecture app vazhiya send aana test message.');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [healthStatus, setHealthStatus] = useState('');

  const checkHealth = async () => {
    setHealthStatus('Checking backend health...');
    try {
      const target = backendUrl ? `${backendUrl.replace(/\/$/, '')}/api/health` : '/api/health';
      const res = await fetch(target);
      const data = await res.json();
      setHealthStatus(`Online: ${data.service} (${data.status})`);
    } catch (err) {
      setHealthStatus(`Error connecting to backend: ${err.message}`);
    }
  };

  const handleSendEmail = async (e) => {
    e.preventDefault();
    if (!email) {
      alert('Please enter an email address!');
      return;
    }

    setLoading(true);
    setStatus('Dispatching email via Azure Communication Services...');

    try {
      const target = backendUrl ? `${backendUrl.replace(/\/$/, '')}/api/send-email` : '/api/send-email';
      const res = await fetch(target, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          toEmail: email,
          subject: subject,
          message: message
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setStatus(`Email Sent Successfully! Azure Message ID: ${data.messageId}`);
      } else {
        setStatus(`Failed to send: ${data.error || 'Unknown error'}`);
      }
    } catch (err) {
      setStatus(`Network/CORS Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '750px', margin: '40px auto', padding: '30px', background: '#161b22', borderRadius: '12px', border: '1px solid #30363d', boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }}>
      <div style={{ borderBottom: '1px solid #30363d', paddingBottom: '15px', marginBottom: '25px' }}>
        <h1 style={{ margin: '0 0 8px 0', fontSize: '24px', color: '#58a6ff' }}>Azure Enterprise Production Architecture</h1>
        <p style={{ margin: 0, fontSize: '14px', color: '#8b949e' }}>
          Azure Static Web Apps (Frontend) + Azure App Service (Backend) + Azure Email Service
        </p>
      </div>

      <div style={{ background: '#21262d', padding: '15px', borderRadius: '8px', marginBottom: '25px', border: '1px solid #30363d' }}>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '6px', color: '#e6edf3' }}>
          Backend API Base URL (Leave empty if using SWA Linked Backend /api):
        </label>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            placeholder="https://app-backend-demo-xxxx.azurewebsites.net"
            value={backendUrl}
            onChange={(e) => setBackendUrl(e.target.value)}
            style={{ flex: 1, padding: '8px 12px', background: '#0d1117', border: '1px solid #30363d', borderRadius: '6px', color: '#fff', fontSize: '14px' }}
          />
          <button
            type="button"
            onClick={checkHealth}
            style={{ padding: '8px 16px', background: '#238636', border: 'none', borderRadius: '6px', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}
          >
            Check API
          </button>
        </div>
        {healthStatus && (
          <p style={{ marginTop: '8px', fontSize: '12px', color: healthStatus.includes('Online') ? '#3fb950' : '#f85149' }}>
            {healthStatus}
          </p>
        )}
      </div>

      <form onSubmit={handleSendEmail}>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '6px', color: '#e6edf3' }}>
            Recipient Email Address:
          </label>
          <input
            type="email"
            required
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', boxSizing: 'border-box', padding: '10px 12px', background: '#0d1117', border: '1px solid #30363d', borderRadius: '6px', color: '#fff', fontSize: '14px' }}
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '6px', color: '#e6edf3' }}>
            Email Subject:
          </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            style={{ width: '100%', boxSizing: 'border-box', padding: '10px 12px', background: '#0d1117', border: '1px solid #30363d', borderRadius: '6px', color: '#fff', fontSize: '14px' }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '6px', color: '#e6edf3' }}>
            Message Content:
          </label>
          <textarea
            rows="4"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            style={{ width: '100%', boxSizing: 'border-box', padding: '10px 12px', background: '#0d1117', border: '1px solid #30363d', borderRadius: '6px', color: '#fff', fontSize: '14px' }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{ width: '100%', padding: '12px', background: loading ? '#388bfd88' : '#1f6feb', border: 'none', borderRadius: '6px', color: '#fff', fontSize: '16px', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer' }}
        >
          {loading ? 'Sending via Azure Email Service...' : 'Send Email Notification'}
        </button>
      </form>

      {status && (
        <div style={{ marginTop: '20px', padding: '12px', borderRadius: '6px', background: status.includes('Successfully') ? '#1f3522' : '#3d1d24', border: `1px solid ${status.includes('Successfully') ? '#2ea043' : '#da3633'}`, color: '#fff', fontSize: '13px' }}>
          {status}
        </div>
      )}
    </div>
  );
}

export default App;
