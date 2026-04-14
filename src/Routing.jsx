import React from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Home from './pages/Home';
import Signin from './pages/Signin';
import SigninFlow from './pages/SigninFlow';
import SignUp from './pages/SignUp';
import Signupflow from './pages/SignUpFlow';
import AgeSelect from './pages/AgeSelect';
const Routing = () => {
    return ( <>
    <BrowserRouter>
    <Routes>
        <Route path='/' element={<Signin/>}/>
        <Route path='/signinflow' element={<SigninFlow/>}/>
        <Route path='/signup' element={<SignUp/>}/>
        <Route path='/signupflow' element={<Signupflow/>}/>
        <Route path='/ageselect' element={<AgeSelect/>}/>
        <Route path='/home' element={<Home/>}/>
        
    

    </Routes>
    
    
    </BrowserRouter>
    
    </> );
}
 
export default Routing;