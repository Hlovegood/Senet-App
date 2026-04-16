import React from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Home from './pages/Home';
import Signin from './pages/Signin';
import SigninFlow from './pages/SigninFlow';
import SignUp from './pages/SignUp';
import Signupflow from './pages/SignUpFlow';
import AgeSelect from './pages/AgeSelect';
import TargetSelect from './pages/TargetSelect';
import CuisineSelect from './pages/CuisineSelect';
import Allergy from './pages/AllergySelect';
import Finish from './pages/FinishSignUp'
;
const Routing = () => {
    return ( <>
    <BrowserRouter>
    <Routes>
        <Route path='/' element={<Signin/>}/>
        <Route path='/signinflow' element={<SigninFlow/>}/>
        <Route path='/signup' element={<SignUp/>}/>
        <Route path='/signupflow' element={<Signupflow/>}/>
        <Route path='/ageselect' element={<AgeSelect/>}/>
        <Route path='/target' element={<TargetSelect/>}/>
        <Route path='/cuisines' element={<CuisineSelect/>}/>
        <Route path='/allergy' element={<Allergy/>}/>
        <Route path='/finish' element={<Finish/>}/>
        <Route path='/feed' element={<Home/>}/>
        
    

    </Routes>
    
    
    </BrowserRouter>
    
    </> );
}
 
export default Routing;