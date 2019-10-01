import React from 'react';
import { useStore } from 'statux';

interface CounterProps {
  className?: string;
}

const Counter: React.FC<CounterProps> = () => {
  const [user, setUser] = useStore('user');
  return (
    <div>
      Hello {user ? user.name : (
        <button onClick={() => setUser({ name: 'Maria' })}>Login</button>
      )}
    </div>
  );
}

export default Counter;
