import './global.css';
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './app/App';
import { AuthProvider } from './AuthContext';
import { RefreshProvider } from './pages/userHome/context/RefreshContext';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
    <RefreshProvider>
        <AuthProvider>
            <App />
        </AuthProvider>
    </RefreshProvider>
);
