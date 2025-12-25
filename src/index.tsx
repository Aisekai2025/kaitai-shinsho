import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { HashRouter } from 'react-router-dom'; // GitHub Pages では HashRouter が必須

// ルート要素を取得
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// React 18 の createRoot を使ってアプリを描画
const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    {/* GitHub Pages では BrowserRouter ではなく HashRouter を使う */}
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
);