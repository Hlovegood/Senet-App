import React from 'react';
// Changed BrowserRouter to HashRouter for stable mobile pathing
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Signin from './pages/Signin';
import SigninFlow from './pages/SigninFlow';
import SignUp from './pages/SignUp';
import Signupflow from './pages/SignUpFlow';
import AgeSelect from './pages/AgeSelect';
import TargetSelect from './pages/TargetSelect';
import CuisineSelect from './pages/CuisineSelect';
import Allergy from './pages/AllergySelect';
import Finish from './pages/FinishSignUp';
import Details from './pages/RecipeDetail';
import Profile from './pages/Profile';
import CuisineEdit from './pages/CuisineEdit';
import ProfileEdit from './pages/ProfileEdit';
import Search from './pages/Search';
import FavsAll from './pages/FavoriteAll';
import Settings from './pages/Settings';
import './index.css'

const Routing = () => {
    return (
        <Router>
            {/* This div locks the viewport to the device size globally */}
            <div className="page-lockdown-wrapper">
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
                    <Route path='/recipe-details/:recipeId' element={<Details/>}/>
                    <Route path='/profile' element={<Profile/>}/>
                    <Route path='/cuisines-edit' element={<CuisineEdit/>}/>
                    <Route path='/profile-edit' element={<ProfileEdit/>}/>
                    <Route path='/search' element={<Search/>}/>
                    <Route path='/favorites-all' element={<FavsAll/>}/>
                    <Route path='/settings' element={<Settings/>}/>
                    <Route path='/feed' element={<Home/>}/>
                </Routes>
            </div>
        </Router>
    );
}

export default Routing;