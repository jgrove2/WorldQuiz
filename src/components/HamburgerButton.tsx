import React from 'react';

interface HamburgerButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

export const HamburgerButton: React.FC<HamburgerButtonProps> = ({ isOpen, onClick }) => {
  return (
    <button
      onClick={onClick}
      aria-label={isOpen ? 'Close menu' : 'Open menu'}
      aria-expanded={isOpen}
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '44px',
        height: '44px',
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        padding: '8px',
        position: 'relative',
      }}
    >
      {/* Top line */}
      <span
        style={{
          display: 'block',
          width: '24px',
          height: '2px',
          backgroundColor: '#333333',
          transition: 'transform 0.2s ease, opacity 0.2s ease',
          transform: isOpen ? 'rotate(45deg) translateY(7px)' : 'none',
          transformOrigin: 'center',
        }}
      />
      {/* Middle line */}
      <span
        style={{
          display: 'block',
          width: '24px',
          height: '2px',
          backgroundColor: '#333333',
          margin: '5px 0',
          transition: 'opacity 0.2s ease',
          opacity: isOpen ? 0 : 1,
        }}
      />
      {/* Bottom line */}
      <span
        style={{
          display: 'block',
          width: '24px',
          height: '2px',
          backgroundColor: '#333333',
          transition: 'transform 0.2s ease',
          transform: isOpen ? 'rotate(-45deg) translateY(-7px)' : 'none',
          transformOrigin: 'center',
        }}
      />
    </button>
  );
};
