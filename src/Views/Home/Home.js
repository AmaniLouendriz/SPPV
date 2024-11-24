import "./Home.css";
import { useGoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import fcts from "../../ApiFcts/Api";



export const Home=()=>{
    // const [ user, setUser ] = useState([]);

    // const [ profile, setProfile ] = useState([]);

    const navigate = useNavigate();

    // log out function to log the user out of google and set the profile array to null
    //   const logOut = () => {
    //     googleLogout();
    //     setProfile(null);
    //   };

    const login = async()=>{
        console.log("In the login");
        await fcts.signWithOAuthGoogle();
    }
    
    // useGoogleLogin({
    //     // if it was success, then send the user information to the role selection page, where you see in the users table database if the user exists, display different stuff depending on 
    //     // whether the user exists or not.
    //     onSuccess: async (codeResponse) => {
    //         const res = await fcts.retrieveUserInfo(codeResponse);
    //         // console.log("the res is: ",res)
    //         navigate("/selectRole",{state:res});
    //     },
    //     onError: (error) => console.log('Login Failed:', error)
    // });



    return(
        <div className="wrapper">
            <div className="imageContainer">
                <img src="/images/HomeImage.png" className="rounded image" alt="HomeImage.png"/>
                <button type="button" onClick={()=>login()} className="btn btn-secondary">Sign in with Google</button>
            </div>
        </div>
    )

}