import React from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Home from './pages/Home';
import Signin from './pages/Signin';
import SigninFlow from './pages/SigninFlow';
import SignUp from './pages/SignUp';

const Routing = () => {
    return ( <>
    <BrowserRouter>
    <Routes>
        <Route path='/' element={<Signin/>}/>
        <Route path='/Signinflow' element={<SigninFlow/>}/>
        <Route path='/signup' element={<SignUp/>}/>
        <Route path='/home' element={<Home/>}/>
        
    

    </Routes>
    
    
    </BrowserRouter>
    
    </> );
}
 
export default Routing;