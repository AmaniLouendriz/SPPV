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

const addProject = async(input,file)=>{

    const emailsContributors = input.contributors.split(',');

    let res = false;

    try {
        // Well first of all, start by saving the file
        const responseFile = await supabase.storage.from("uploads").upload(input.data,file);
        console.log("The responseFile is: ",responseFile);

        if (responseFile.error == null) {
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
        }
    } catch(error) {
        console.error('Error inserting data:', error);
    }
    return res;
}

fcts.sendMessageToAi = async(question,projectName)=>{
    const fileResponse = await fcts.getFile(projectName);

    const modelUrl = 'https://api-inference.huggingface.co/models/microsoft/Phi-3-mini-4k-instruct';

    console.log("the file is: ",fileResponse);

    // structuring the input

    const chatPrompt = `<|system|> You are the person identified in the following context. Speak as this person would. Answer the questions concisely. <|end|> <|context|> ${fileResponse} <|end|> <|user|> ${question} <|end|> <|assistant|> `

    const result = await axios.post(modelUrl,
        {inputs:chatPrompt,
            parameters:{
                max_tokens:300,// TODO about this
            }
        },
        {
            headers:{
                Authorization:`Bearer ${process.env.REACT_APP_HUGGING_TOKEN}`
            },
        }
    );

    //console.log("still in the api.js, result is: ",result);
    //console.log("the generated text is: ",result.data[0].generated_text)

    const noisyText = result.data[0].generated_text;
    // now process the generated text
    const regex = /<\|assistant\|>.*/

    let cleanResponse = (noisyText.match(regex));

    let maxCleanResponse = cleanResponse[0].replace(/<\|assistant\|>/,'').trim();


    //console.log("a match would be: ",maxCleanResponse);

    return maxCleanResponse;

}

fcts.getFile = async(projectName)=>{
    const response = await supabase.storage.from("uploads").list(`documents/${projectName}`);// assuming I have just one, this call is redundant TODO remove
    console.log("the response file is: ",response);
    if (response.error == null) {
        const fileName = response.data[0].name;
        const resSignedUrl = await supabase.storage.from("uploads").createSignedUrl(`documents/${projectName}/${fileName}`,60);
        console.log("resPublicUrl: ",resSignedUrl);
        if (resSignedUrl.error == null) {
            const responseFetchFile = await fetch(resSignedUrl.data.signedUrl);
            //console.log("responseFetchFile: ",responseFetchFile);
            if (responseFetchFile.ok) {
                const fileContent = await responseFetchFile.text();
                console.log("fileContent: ",fileContent);
                return fileContent;
            }
        }
        // if (resPublicUrl.data.publicUrl != "") {
        //     const responseFetchFile = await fetch(resPublicUrl.data.publicUrl);
        //     console.log("responseFetchFile: ",responseFetchFile);
        // }

    }
    return null;
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


fcts.createProject = async(data,file)=>{
    const createResponse = await addProject(data,file);
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