import { useEffect,useState } from "react"
import { useLocation } from "react-router-dom";
import fcts from "../../../ApiFcts/Api";
import "./ProjectDetail.css"

export const ProjectDetail = ()=>{
    // all the fun would take place here

    const {state} = useLocation();

    const [answer,setAnswer] = useState("");

    const [questions,setQuestions] = useState([]);

    const [answers,setAnswers] = useState([]);

    const [question,setQuestion] = useState("");

    // useEffect(()=>{

    //     console.log("the state is: ",state);
    //     // go to the project folder in the uploads bucket, and get the file so that a parser can process it, before giving it to the AI thing
    //     async function getFile(projectName) {
    //         const responseGetFile = fcts.getFile(projectName);

    //     }
    //     getFile(state.project);   
    // },[]);

    const handleInputChange = (event)=>{
        const target = event.target;
        const value = target.value;
        setQuestion(value);
    }

    const handleSubmit = async()=>{
        setQuestions([...questions,question])
        //console.log("the question that was just asked is: ",question);
        const response = await askAI(question,state.project);
        //console.log("finalizing on submit");
        setAnswers([...answers,response])
    }


    const askAI = async(userQuestion,projectName)=>{
        try {
            const response = await fcts.sendMessageToAi(userQuestion,projectName);
            console.log("in the project question prompt, the response is: ",response);
            setAnswer(response);
            return response;
        }catch(error) {
            console.log("this error happened while trying to send a question",error);
        }
    }

    return (
        <div className="page-container">
            <h2 className="text-light p-3">Chat with me</h2>

            <div className="text-light">
                {questions.map((question,index) => (
                    <>
                    <div key={index} className="border p-2 w-25 rounded float-end m-3">
                        {question}
                    </div>

                    {(index < answers.length && answers[index])  ? 
                        <div key={`a${index}`} className="border p-2 w-50 rounded bg-secondary-subtle text-dark test m-5">
                            {(index < answers.length && answers[index]) ? answers[index]  :<></> }
                        </div>
                    :<>thinking...</>
                    }
                    
                    </>
                ))}
            </div>

            


            <div className="form-floating stick w-75">
                <label for="floatingTextarea2">Questions</label>
                <textarea className="form-control p-5 custom" placeholder="Ask your question" id="floatingTextarea2"  onChange={handleInputChange}></textarea>
                <button type="submit" className='btn btn-secondary m-2' onClick={()=>handleSubmit()}>Ask Ms Phi</button>
            </div>








            {/* <button onClick={()=>askAI(
            
            "<|system|> You are a helpful assistant. <|end|> <|user|> What is the capital of spain? <|end|> <|assistant|>")}>ASK AI</button>



            {/* "<|system|> You are a helpful assistant. <|end|>\
            <|user|> What is the capital of spain? <|end|> \
            <|assistant|>")}>ASK AI</button> */}


            {/* <div>
                answer:   {answer}
            </div> */}
         
        
        
        
        
        
        </div>

    )
}