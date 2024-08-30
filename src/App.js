import React from 'react';
import MainPage from './pages/MainPage';
import RefreshPage from './pages/RefreshPage';
import MetadataTestPage from './pages/MetadataTestPage';
import TestPage from './pages/MetadataTestPage';
import TestComponents from './pages/TestComponents';
import { WalletProvider } from './contexts/WalletContext';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
    return (
        <WalletProvider>
            <Router>
                <div className="App">
                    <Routes>
                        <Route path="/:seqid" element={<MainPage />} />
                        <Route path="/refresh" element={<RefreshPage />} />
                        <Route path="/test-metadata/:seqid" element={<MetadataTestPage />} />
                        <Route path="/testpage/:seqid" element={<TestPage />} />
                        <Route path="/test/:seqid" element={<TestComponents />} />
                    </Routes>
                </div>
            </Router>
        </WalletProvider>
    );
}

export default App;
