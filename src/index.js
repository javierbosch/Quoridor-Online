import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import firebaseApp from './components/Firebase'
import {AuthProvider} from "./context/AuthContext";

ReactDOM.render(
    <>
        <AuthProvider>
            <App database={firebaseApp.database()} auth={firebaseApp.auth()}/>
        </AuthProvider>
    </>,
    document.getElementById("root")
);