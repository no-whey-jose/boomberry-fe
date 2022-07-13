import { useState, useContext } from 'react';
import { AuthContext } from '../../shared/context/auth.context';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import Button from '../../shared/components/Button/Button';
import Card from '../../shared/components/Card/Card';
import './Auth.styles.scss';
import LogInInputs from '../../shared/components/LogIn/LogIn';
import SignUpInputs from '../../shared/components/SignUp/SignUp';
import LoadingSpinner from '../../shared/components/LoadingSpinner/LoadingSpinner';
import ErrorModal from '../../shared/components/ErrorModal/ErrorModal';

const Auth = () => {
  const [showLogin, setShowLogin] = useState(true);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);

  const [formState, inputHandler, setFormData] = useForm(
    {
      email: { value: '', isValid: false },
      password: { value: '', isValid: false },
    },
    false
  );

  const handleSwitchDisplay = () => {
    if (!showLogin) {
      setFormData(
        {
          ...formState.inputs,
          name: undefined,
          confirmPassword: undefined,
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: { value: '', isValid: false },
        },
        false
      );
    }
    setShowLogin((showLoginState) => !showLoginState);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (showLogin) {
        await sendRequest(
          'http://localhost:5050/api/users/login',
          'POST',
          {
            'Content-Type': 'application/json',
          },
          JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          })
        );
      } else {
        await sendRequest(
          'http://localhost:5050/api/users/signup',
          'POST',
          { 'Content-Type': 'application/json' },
          JSON.stringify({
            name: formState.inputs.name.value,
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          })
        );
      }
      auth.login();
    } catch (error) {}
  };

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      <Card className="auth-container">
        {isLoading && <LoadingSpinner asOverlay />}
        <h2> Log In</h2>
        <hr />
        <form onSubmit={handleSubmit}>
          {showLogin ? (
            <LogInInputs inputHandler={inputHandler} />
          ) : (
            <SignUpInputs formState={formState} inputHandler={inputHandler} />
          )}
          <div className="form-action">
            <Button secondary type="submit" disabled={!formState.isValid}>
              {showLogin ? 'Log In' : 'Sign Up'}
            </Button>
          </div>
        </form>
        <Button onClick={handleSwitchDisplay}>
          Show {showLogin ? 'Sign Up' : 'Log In'}
        </Button>
      </Card>
    </>
  );
};

export default Auth;
