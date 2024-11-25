import { useState } from "react";
import { useEffect } from "react";
import fcts from "../../ApiFcts/Api";
import "./AppHeader.css";
import supabase from "../../config/supabaseClient";
import { useNavigate } from "react-router-dom";

export const AppHeader=()=>{

    const [showSignOut,setShowSignOut] = useState(false);
    const navigate = useNavigate();

   

    useEffect(()=>{
        //supabase.auth.signOut();
        const isSignedIn = async()=>{
            const response = await supabase.auth.getSession();
            console.log("the response in header,: ",response);
            if (response.data.session != null) {
                setShowSignOut(true);
            }
            
        }

        isSignedIn();

    },[])


    const SignOut = async() =>{
        const response = await fcts.logout();
        console.log("when we click on the sign out button: ",response);
        setShowSignOut(false);
        navigate('/');
        


    }
    return(
        <div className="header">
            <div className="title">Système de Partie Prenante Virtuelle</div>
            <div className="title">Virtual Stakeholder System</div>
            <>{showSignOut}</>
            {showSignOut ? <button className="btn btn-secondary m-2 float-end" onClick={()=>SignOut()}>Sign out</button> :<></>
            }
        </div>
    )
}