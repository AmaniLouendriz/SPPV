import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import fcts from "../../ApiFcts/Api";
import InputMask from "react-input-mask";


export const Role = ()=>{

    // the state has the email, family_name, given_name, name, picture
    const {state} = useLocation();

    // console.log("the state in the Role.js",state);


    const [userInfo,setUserInfo] = useState({
        email:'',
        role:'',
        userNumber:''
    })

    const [submittedUserNumber,setSubmittedUserNumber] = useState("");

    const [error,setError] = useState("");

    const navigate = useNavigate();

    useEffect(()=>{
        async function verifyUser() {
            const userInfo = await fcts.verify(state.email);
            setUserInfo(userInfo);
            //console.log("the state.email",state.email);
            //console.log("doesEx",doesUserExist);
        }
        verifyUser();
    },[state])

    const verifyUserNumberIsCorrect = () => {
        console.log("verifying the student number: ",submittedUserNumber);

        if (submittedUserNumber.length <9) {
            setError("The number should have exactly 9 digits");
        } else if (submittedUserNumber.trim() !== userInfo.userNumber) {
            setError("This user number is incorrect");
        } else {
            // all is good, navigate to the user dashboard, put a state as email, role, userNumber too why not
            // if instructor, he will see far more options
            setError("");
            navigate('/dashboard',{state:userInfo})
        }
    }

    const handleChange = (event) => {
        setSubmittedUserNumber(event.target.value);
    }

    // at a certain point here, take the email from the state, look in the users table if its present, if not, tell the user to say whether he is a student or prof, 
    // in either case, ask him to give student or employee number, then add this number to the users table with the role. then continue  to the specific page. 


    return (
        (userInfo) ? 
            // user is found in the database
            <>
            <h2 className="text-light p-3">Hello {state.name},</h2> 
            <div className="p-2 text-light">You are registered with us as a : {userInfo.role.toLowerCase()}</div>
            <p className="p-2 text-light">Please confirm your {userInfo.role.toLowerCase()} number below: </p>
            <div className="input-group mb-3 p-3 w-50">
                <InputMask className="form-control border" mask='999999999' placeholder={`Your ${userInfo.role.toLowerCase()} number`} value={submittedUserNumber} onChange={handleChange} id="idUser" maskChar={''} name="id"/>
                <button className="btn btn-secondary btn-outline-secondary text-light" type="button" id="button-addon2" onClick={verifyUserNumberIsCorrect}>Confirm</button>
            </div>
            {error ? <div className="text-danger">{error}</div> : <div></div>}
            </>
            :<>You are not registered with us.</>
    )
}