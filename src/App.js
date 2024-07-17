import React, { useEffect, useState } from 'react';
import HomeElencoThreads from './pages/HomeElencoThreads';
import Soluzioni from './pages/Soluzioni';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import ThreadChat from './pages/ThreadChat';
import ThreadDocente from './pages/ThreatDocente';
import DomandeGuida from './pages/DomandeGuida';
import Login from './pages/Login';
import FileAperto from './pages/FileAperto';
import { Container } from '@chakra-ui/react';
import CreaPost from './pages/CreaPost';
import { UserProvider } from './components/UserContext';
import { AttivitaProvider } from './components/AttivitàContext';



function App() {

   return (
    <> 
    <AttivitaProvider>
      <UserProvider>
        <Container pl='24px' pr='24px' className=' h-screen'>
          <Router>
            <Routes>        
                <Route path='/' element={<HomeElencoThreads />}></Route>
                <Route path='/Login' element={<Login />}></Route>  
                <Route path='/Soluzioni' element={<Soluzioni />}></Route>  
                <Route path='/ThreadChat/:titolo' element={<ThreadChat />}></Route> 
                <Route path='/ThreadDocente/:titolo' element={<ThreadDocente />}></Route> 
                <Route path='/DomandeGuida' element={<DomandeGuida />}></Route>
                <Route path='/FileAperto' element={<FileAperto />}></Route>      
                <Route path='/CreaPost' element={<CreaPost />}></Route>        
            </Routes>
          </Router>
        </Container>
      </UserProvider>
    </AttivitaProvider>
    </> 

   );
}

export default App;
