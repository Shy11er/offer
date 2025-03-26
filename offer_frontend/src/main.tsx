import '@gravity-ui/uikit/styles/fonts.css';
import '@gravity-ui/uikit/styles/styles.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import {Toaster} from 'react-hot-toast';
import App from './App';
import './styles/globals.scss';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
    <React.StrictMode>
        <App />
        <Toaster
            toastOptions={{
                style: {
                    fontSize: '16px',
                    padding: '16px 24px',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                },
                success: {
                    style: {
                        background: '#30AA6E',
                        color: 'white',
                    },
                },
                error: {
                    style: {
                        background: '#E74C3C',
                        color: 'white',
                    },
                },
            }}
            position="bottom-right"
        />
    </React.StrictMode>,
);
