import React, { useState, useRef } from 'react';
import './AnimatedText.css';

function AnimatedText() {
  const text = "We're tuning the silence before the scale.\nStay close, growth is about to get sorted.";
  const [isHovering, setIsHovering] = useState(false);
  const textRef = useRef();

  const handleMouseMove = (e) => {
    if (textRef.current) {
      const rect = textRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      
      textRef.current.style.setProperty('--mouse-x', `${x}%`);
      textRef.current.style.setProperty('--mouse-y', `${y}%`);
    }
  };

  return (
    <div 
      ref={textRef}
      className={`animated-text-container ${isHovering ? 'hovering' : ''}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="animated-text">
        {text.split('\n').map((line, index) => (
          <div key={index} className="text-line">{line}</div>
        ))}
      </div>
    </div>
  );
}

export default AnimatedText;