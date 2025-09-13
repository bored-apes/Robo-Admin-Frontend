import React from 'react';

const ComingSoon: React.FC = () => {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: '#fff',
        fontFamily: 'Inter, sans-serif',
        textAlign: 'center',
        padding: '2rem',
      }}
    >
      <svg
        width="80"
        height="80"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ marginBottom: 24 }}
      >
        <circle cx="12" cy="12" r="10" stroke="#fff" strokeWidth="2" fill="none" />
        <path
          d="M8 12h4l2 4"
          stroke="#fff"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="12" cy="8" r="1" fill="#fff" />
      </svg>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: 16 }}>Coming Soon</h1>
      <p style={{ fontSize: '1.25rem', maxWidth: 480, margin: '0 auto' }}>
        We&apos;re working hard to bring you something amazing. Stay tuned for updates!
      </p>
    </div>
  );
};

export default ComingSoon;
