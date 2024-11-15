import { Outlet } from "react-router-dom";
import { AppFooter } from "../AppFooter/AppFooter";
import { AppHeader } from "../AppHeader/AppHeader";
import "./AppShell.css"


export const AppShell=()=>{
    return(
        <div className="HeroWrapper">
            <AppHeader/>
            <Outlet/>
            <AppFooter/>
        </div>
    );
} 