import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {createBrowserRouter, createRoutesFromElements, Route, RouterProvider} from "react-router-dom"
import { AppShell } from './components/AppShell/AppShell';
import { Home } from './Views/Home/Home';
import { Role } from './Views/Role/Role';



function App() {


  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<AppShell/>}>
        <Route index element={<Home/>} />
        <Route path='selectRole' element={<Role/>}/>
      </Route>
    )
  )

//   return (
//     <div>
//         <h2>React Google Login</h2>
//         <br />
//         <br />
//         {profile ? (
//             <div>
//                 <img src={profile.picture} alt="user image" />
//                 <h3>User Logged in</h3>
//                 <p>Name: {profile.name}</p>
//                 <p>Email Address: {profile.email}</p>
//                 <br />
//                 <br />
//                 <button onClick={logOut}>Log out</button>
//             </div>
//         ) : (
//             <button onClick={login}>Sign in with Google 🚀 </button>
//         )}
//     </div>
// );
    return <RouterProvider router={router} />;

}

export default App;
