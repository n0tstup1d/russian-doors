import React, { useRef } from 'react';
import { doorStyles } from './Door.styles';

const Door = ({ isOpen }) => {
  const doorRef = useRef(null);
  const sceneRef = useRef(null);

  React.useEffect(() => {
    if (isOpen) {
      doorRef.current.classList.add('open');
      sceneRef.current.classList.add('move-forward');
    }
  }, [isOpen]);

  return (
    <div className={doorStyles.scene} ref={sceneRef}>
      <div className={doorStyles.frame}>
        <div className={doorStyles.door} ref={doorRef}>
          <div className={doorStyles.handle}></div>
        </div>
      </div>
    </div>
  );
};

export default Door;