import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Routes from '/src/routes';
import { UserProvider } from "./src/components/context/userProvider";

import './src/index.css'

function App() {
    return (
        <Router>
            <UserProvider>
                <Routes />
            </UserProvider>
        </Router>
    );
}

export default App;
