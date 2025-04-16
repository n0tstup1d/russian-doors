import React from 'react';
import './Door.css';
import frontmage from '../../assets/lib/Door/entrance/9smSmartBlackMirror/9smSmartBlackMirrorextr.png'
import backmage from '../../assets/lib/Door/entrance/9smSmartBlackMirror/Airbrush-Image-Enhancer.png'

const Door = ({ 
  name, 
  price, 
  frontImage = frontmage, 
  backImage = backmage 
}) => {
  const [rotate, setRotate] = React.useState(0);
  const [isHovered, setIsHovered] = React.useState(false);
  const timeoutRef = React.useRef(null);

  React.useEffect(() => {
    if (!isHovered) {
      const rotateDoor = () => {
        setRotate(prev => prev === 25 ? -25 : 25);
        timeoutRef.current = setTimeout(rotateDoor, 3000);
      };
      rotateDoor();
    }
    return () => clearTimeout(timeoutRef.current);
  }, [isHovered]);

  const handleMouseEnter = () => {
    clearTimeout(timeoutRef.current);
    setIsHovered(true);
    setRotate(180);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotate(0);
  };

  return (
    <div className="door-container" 
    onMouseEnter={handleMouseEnter}
    onMouseLeave={handleMouseLeave}
    >
      <div 
        className="door"
        style={{ 
          transform: `rotateY(${rotate}deg)`,
          transformStyle: 'preserve-3d'
        }}
        
      >
        <div 
          className="door-front"
          style={{ backgroundImage: `url(${frontImage})` }}
          // , backfaceVisibility: 'visible' }}
        />
        <div 
          className="door-back"
          style={{ backgroundImage: `url(${backImage})` }}
          // , backfaceVisibility: 'visible'}}
          
        />
      </div>
      
      <div className={`door-info ${isHovered ? 'visible' : ''}`}>
        <div className="info-content">
          <h3>{name}</h3>
          <p className="price">{price}{'\u20bd'}</p>
        </div>
      </div>
    </div>
  );
};

export default Door;