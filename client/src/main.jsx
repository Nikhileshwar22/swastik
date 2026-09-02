import React from 'react'
import ReactDOM from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    <Toaster
      position="bottom-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: '#1c1917',
          color: '#f5f5f4',
          borderRadius: '0',
          fontSize: '13px',
          letterSpacing: '0.02em',
          padding: '12px 16px',
          maxWidth: '360px',
        },
        success: {
          iconTheme: { primary: '#a8a29e', secondary: '#1c1917' },
        },
        error: {
          iconTheme: { primary: '#ef4444', secondary: '#fef2f2' },
          style: {
            background: '#1c1917',
            color: '#fca5a5',
          },
        },
      }}
    />
  </React.StrictMode>
)
