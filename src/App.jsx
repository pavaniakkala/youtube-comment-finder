import React from 'react';
import './App.css'
import Comments from './Comments';
// import { Toaster } from "@/components/ui/sonner"
import Homelayout from './Layout/Homelayout';
import LandingPage from './Screens/LandingPage';
import { Route, Routes } from 'react-router-dom';

const App = () => {

  return (
  <>
    <Routes>
       <Route element={<Homelayout />} >
            <Route path="/" element={<LandingPage />} />
          </Route>
    </Routes>

    {/* <Toaster 
      position="bottom-right" 
      expand={false} 
      toastOptions={{
        theme: "dark",
        className: 'my-toast',
      }}
    /> */}
    </>
    
  );
};

export default App;
