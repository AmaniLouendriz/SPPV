import { useState } from "react";
import fcts from "../../ApiFcts/Api";
import { useLocation, useNavigate } from "react-router-dom";
import supabase from "../../config/supabaseClient";



export const ProjectForm = ()=>{
    const {state} = useLocation();

    const navigate = useNavigate();

    // State to store form data
    const [formData, setFormData] = useState({
        projectName: '',
        projectScope:'',
        contributors:'',
        data:'',
    });

    const [file,setFile] = useState(null);


    const handleInputChange = (event)=>{
        const target = event.target;
        const value = target.value;
        const name = target.name;
        setFormData({ ...formData, [name]: value });
    }

    const handleFileChange = (event)=>{
        setFile(event.target.files[0])
    }


    const addProject = async(e)=>{
        e.preventDefault();
        //const auth = await supabase.auth.getUser();// verify whether there is a connection
        //console.log("is authenticated",auth);
        console.log("The file is: ",file);// our file is here
        console.log("the data is: ",formData);
        const filePath = `documents/${formData.projectName}/${file.name}`;
        const finalForm = {...formData,owner:state.email,data:filePath};
        // validation should preferably be done here TODO
        // sending the project info + the actual file with the personas description
        const createResponse = await fcts.createProject(finalForm,file);
        console.log("after creating the project, the response is: ",createResponse);

        if (createResponse === true) {
            navigate('/dashboard',{state:state});
        }
    }


    return (
        //<>I am the project form</>
        <>
            <h2 className="text-light p-3 text-center">Create a new project</h2>
            <form noValidate onSubmit={addProject}>
                <div className="d-grid gap-2 d-md-flex m-3 text-light flex-column">                    
                        <label htmlFor="projectName" className="form-label m-2">Project Name</label>
                        <input required type="text" className="form-control border w-25 m-2" id="projectName" name="projectName" value={formData.projectName} onChange={handleInputChange}/>
                </div>  

                <div className="d-grid gap-2 d-md-flex m-3 text-light flex-column">                    
                        <label htmlFor="projectName" className="form-label m-2">Project Scope</label>
                        <select className="form-select w-25 m-2" aria-label="TeachingOrResearch" onChange={handleInputChange} name='projectScope'>
                            <option selected></option>
                            <option value={'RESEARCH'}>Research</option>
                            <option value={'TEACHING'}>Teaching</option>
                        </select>
                </div>

                <div className="d-grid gap-2 d-md-flex m-3 text-light flex-column">                    
                    {/* <div> */}
                        <label htmlFor="contributors" className="form-label m-2">Project Contributors</label>
                        <input required type="text" className="form-control border m-2 w-25" id="contributors" name="contributors" value={formData.contributors} onChange={handleInputChange} placeholder="please separate emails with comma ,"/>
                    {/* </div> */}
                </div>  

                <div className="d-grid gap-2 d-md-flex m-3 text-light flex-column">
                    <label htmlFor="personas" className="form-label m-2">Project Personas</label>
                    <input type="file" name="personas" accept=".txt" className="form-control w-25" id="personasData" onChange={handleFileChange} />
                </div>

                <div className="d-grid gap-2 d-md-flex m-3 mb-5">
                    <button type="submit" className='btn btn-secondary'>Create</button>
                </div>  
            </form>
        </>
    )
}