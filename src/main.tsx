import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './app/App.tsx'
import { AuthProvider } from './app/components/admin/AuthContext'
import './styles/index.css'

console.log('🚀 main.tsx → aplicación iniciada');

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>,
)
