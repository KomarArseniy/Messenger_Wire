import type { User } from '@/types/user';

const demoUser: User | null = null;

function App() {
  return (
    <div className="app">
      <h1>Wire Messenger</h1>
      <p>{demoUser ? demoUser.username : 'нет пользователя'}</p>
    </div>
  );
}

export default App;
