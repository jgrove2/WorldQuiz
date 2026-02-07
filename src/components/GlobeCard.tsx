import type { ReactNode } from 'react';

interface GlobeCardProps {
  children: ReactNode;
}

export const GlobeCard: React.FC<GlobeCardProps> = ({ children }) => {
  return (
    <div
      style={{
        background: '#ffffff',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        maxWidth: '900px',
        width: '90vw',
        margin: '0 auto',
      }}
    >
      <div
        style={{
          background: '#000000',
          borderRadius: '8px',
          height: '600px',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {children}
      </div>
    </div>
  );
};
