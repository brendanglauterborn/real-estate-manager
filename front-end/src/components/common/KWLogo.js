import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuilding } from '@fortawesome/free-solid-svg-icons';

// Import logo directly
import kwLogo from '../../assets/kw-logo.png';

/**
 * KWLogo component - Handles displaying the Keller Williams logo with fallbacks
 * @param {Object} props - Component props
 * @param {string} props.className - Additional CSS class for the logo
 * @param {Object} props.style - Additional inline styles for the logo
 * @param {string} props.size - Size of the logo ('large', 'medium', 'small')
 * @returns {JSX.Element} - Rendered component
 */
const KWLogo = ({ className = '', style = {}, size = 'medium' }) => {
  const [primaryLogoError, setPrimaryLogoError] = useState(false);
  const [secondaryLogoError, setSecondaryLogoError] = useState(false);

  // Determine styles based on size
  const sizeStyles = {
    small: { height: '40px' },
    medium: { height: '60px' },
    large: { height: '70px' }
  };
  
  // Merge size styles with passed styles
  const mergedStyles = {
    ...sizeStyles[size] || sizeStyles.medium,
    ...style,
    backgroundColor: 'white',
    opacity: 1,
    filter: 'none'
  };

  // Handle primary logo loading error
  const handlePrimaryLogoError = () => {
    setPrimaryLogoError(true);
  };

  // Handle secondary logo loading error
  const handleSecondaryLogoError = () => {
    setSecondaryLogoError(true);
  };

  // If both logo sources fail, display a fallback icon
  if (primaryLogoError && secondaryLogoError) {
    return (
      <div 
        className={`logo-fallback ${className}`} 
        style={mergedStyles}
      >
        <FontAwesomeIcon icon={faBuilding} />
      </div>
    );
  }

  // Try the imported logo first
  if (!primaryLogoError) {
    return (
      <img
        src={kwLogo}
        alt="Keller Williams Logo"
        className={`navbar-logo ${className}`}
        style={mergedStyles}
        onError={handlePrimaryLogoError}
      />
    );
  }

  // Fall back to the public directory logo
  return (
    <img
      src="/Logo.png"
      alt="Keller Williams Logo"
      className={`navbar-logo ${className}`}
      style={mergedStyles}
      onError={handleSecondaryLogoError}
    />
  );
};

export default KWLogo; 