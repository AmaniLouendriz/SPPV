import axios from "axios";
import supabase from "../config/supabaseClient";


const fcts = {};

const getUserInfo = async(user)=>{
    let info = null;
    // console.log("the info is: ",user);
    try {
        const response = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`,{
            headers: {
                Authorization: `Bearer ${user.access_token}`,
                Accept: 'application/json'
            }
        });

        if (response.status === 200) {
            console.log("fetching completed successfully");
            info = response.data;
        } else {
            console.log("Sorry, something went wrong while fetching");
        }
    }catch(error) {
        console.log("Error occured",error)
    }
    return info;
}

const verifyUser = async (userEmail) => {
    //let exist = false;
    try {
        const response = await supabase.from("Users").select("*").eq("email",userEmail);
        if(response.status === 200) {
            //console.log("the response.data",response);
            if (response.data.length === 1) {
                //exist = true;
                return response.data[0];
            }
        } else {
            console.log("An error occured");
            return null;
        }
    } catch(error) {
        console.log("Error occured",error);
        return null;
    }
    //return exist;
}

const getProjects = async(emailUser)=>{
    try {
        const response = await supabase.rpc('get_all_projects',{
            email: emailUser
        });
        if (response.status === 200) {
            // console.log("the response.data is",response);
            return response.data;
        } else{
            console.log("An error occured");
            return null;
        }

    } catch(error) {
        console.log("Error occured",error);
        return null;
    }

}





fcts.retrieveUserInfo = async(data)=>{
    const info = await getUserInfo(data);
    return info;
}

fcts.verify = async(email)=>{
    let data = await verifyUser(email);
    return data;
}

fcts.getAllProjects = async(email)=>{
    let projects = await getProjects(email);
    return projects;
}

export default fcts;