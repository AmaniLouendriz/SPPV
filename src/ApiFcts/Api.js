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

const addProject = async(input)=>{

    const emailsContributors = input.contributors.split(',');

    let res = false;

    try {
        // Add to the project table first
        const response = await supabase.from("Project").insert([{
            name:input.projectName,
            owner:input.owner    }]);

        if (response.status === 201) {
            //console.log("I should be here smh");
            const projectIdObj = await supabase.from("Project").select("id").eq("name",input.projectName);
            console.log("the projectIdObject: ",projectIdObj)
            if (projectIdObj.status === 200) {
                //console.log("am I here");
                // Then add details to project details
                const projectId = projectIdObj.data[0].id;
                const insertDetails = await supabase.from("ProjectDetails").insert([{
                    id:projectId,
                    scope:input.projectScope,
                }])

                if (insertDetails.status === 201) {
                    // and add the contributors and owner emails to isAssigned

                    let addToIsAssignedObject = await supabase.from("isAssignedTo").insert([{
                        emailUser:input.owner,
                        idProject:projectId
                    }])

                    for (const email of emailsContributors) {
                        addToIsAssignedObject = await supabase.from("isAssignedTo").insert([{
                            emailUser:email,
                            idProject:projectId
                        }])



                    }

                    res = true;
                }
            }
            //console.log("The beloved project id is: ",projectId.data[0].id);
        }

        console.log("the response is: ",response);
    } catch(error) {
        console.error('Error inserting data:', error);
    }

    return res;
}


fcts.signWithOAuthGoogle = async()=>{

    console.log("in signing with google");

    const {user,session,error} = await supabase.auth.signInWithOAuth({
        provider:'google',
        options: {
            redirectTo: 'http://localhost:3000/selectRole'
        }
    })
}


fcts.createProject = async(data)=>{
    const createResponse = await addProject(data);
    return createResponse;
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