import { useLocation, useNavigate } from "react-router-dom";
import fcts from "../../ApiFcts/Api";
import { useEffect,useState } from "react";



export const DashBoard = ()=>{
    const {state} = useLocation();

    // console.log("the state is",state);
    const [projectsUser,setProjects] = useState([])

    const navigate = useNavigate()

    const createProject = ()=>{
        navigate('/projectform',{state:state});
    }


    useEffect(()=>{
        //console.log("inside the useEffect, state is: ",state);
        async function getProjects(email) {
            const projects = await fcts.getAllProjects(state.email);  
            setProjects(projects);
        }
        getProjects(state.email);
        // console.log("the projects are: ",projects);
    },[])// no dependency array, no infinite loop

   
    //console.log("projects are: ",projectsUser)
    return (
        <>
            <h2 className="text-light p-3">Hello {state.email},</h2>
            {state.role === 'INSTRUCTOR' ? 
                <div>    
                    <button className="btn btn-secondary p-2 m-3 float-end" onClick={()=>createProject()}>Create a new project</button>
            </div>:<></>}
            <h3 className="text-light p-3 text-center">Your projects</h3>
            <div className="d-flex flex-row p-3 gap-4 flex-wrap justify-content-center">
                {projectsUser.length ? 
                    projectsUser.map((item,index)=>{
                        return(
                            <>
                            <div key={`card${index}`} className="text-center">
                                <div className="card border-3 border-dark" style={{width: "300px"}}>
                                    {/* <img className="card-img-top" src="tocome" alt={item.name}/> */}
                                    <div className="card-body">
                                        <h4 style={{marginTop:"10px"}} className="card-title">{`${item.name}`}</h4>
                                        <div id="owner">Owner: {item.owner}</div>
                                        <button className="btn btn-secondary p-2 m-3" onClick={()=>console.log("click me for details about this project")}>View</button>
                                    </div>
                                </div>
                            </div>
                            </>
                        )
                    })
            :<>You don't have any project open yet</>}
            </div>
        </>

    )
}