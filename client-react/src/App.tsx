import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthPage } from '@/pages/AuthPage';
import { ChatPage } from '@/pages/ChatPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<AuthPage initialCard="login" />} />
        <Route path="/register" element={<AuthPage initialCard="register" />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
