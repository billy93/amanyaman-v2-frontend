import React, { useEffect, useState } from 'react';

const ScrollIndicator = () => {
  const [scrollPercentage, setScrollPercentage] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const pageHeight = document.body.scrollHeight - window.innerHeight;
      const percentage = (scrollY / pageHeight) * 100;
      setScrollPercentage(percentage);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="scroll-indicator">
      <div
        className="scroll-indicator-bar"
        style={{ width: `${scrollPercentage}%` }}
      />
    </div>
  );
};

export default ScrollIndicator;
