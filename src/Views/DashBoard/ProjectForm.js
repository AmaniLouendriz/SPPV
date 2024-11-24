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


    const handleInputChange = (event)=>{
        const target = event.target;
        const value = target.value;
        const name = target.name;
        setFormData({ ...formData, [name]: value });
    }


    const addProject = async(e)=>{
        e.preventDefault();
        const auth = await supabase.auth.getUser();
        console.log("is authenticated",auth)
        console.log("the data is: ",formData);
        const finalForm = {...formData,owner:state.email};
        // validation should preferably be done here TODO
        const createResponse = await fcts.createProject(finalForm);
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
                <div className="d-grid gap-2 d-md-flex m-3 text-light">                    
                    <div>
                        <label htmlFor="projectName" className="form-label">Project Name</label>
                        <input required type="text" className="form-control border" id="projectName" name="projectName" value={formData.projectName} onChange={handleInputChange}/>
                    </div>
                </div>  

                <div className="d-grid gap-2 d-md-flex m-3 text-light">                    
                    <div>
                        <label htmlFor="projectName" className="form-label">Project Scope</label>
                        <select className="form-select" aria-label="TeachingOrResearch" onChange={handleInputChange} name='projectScope'>
                            <option selected></option>
                            <option value={'RESEARCH'}>Research</option>
                            <option value={'TEACHING'}>Teaching</option>
                        </select>
                    </div>
                </div>

                <div className="d-grid gap-2 d-md-flex m-3 text-light">                    
                    <div>
                        <label htmlFor="contributors" className="form-label">Project Contributors</label>
                        <input required type="text" className="form-control border" id="contributors" name="contributors" value={formData.contributors} onChange={handleInputChange} placeholder="please separate emails with comma ,"/>
                    </div>
                </div>  


                <div className="d-grid gap-2 d-md-flex m-3 mb-5">
                    <button type="submit" className='btn btn-secondary'>Create</button>
                </div>  
            </form>
        </>
    )
}