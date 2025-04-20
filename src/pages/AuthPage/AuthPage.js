import React, { useState } from 'react';
import Door from '../../components/Door/Door';
import LoginForm from '../../components/LoginForm/LoginForm';
import { authPageStyles } from './AuthPage.styles';

const AuthPage = () => {
  const [isDoorOpen, setIsDoorOpen] = useState(false);

  return (
    <div className={authPageStyles.container}>
      <Door isOpen={isDoorOpen} />
      <div className={authPageStyles.formContainer}>
        {!isDoorOpen && (
          <LoginForm onSubmit={() => setIsDoorOpen(true)} />
        )}
      </div>
    </div>
  );
};

export default AuthPage;