import { Button, VStack } from "@chakra-ui/react";
import { useState } from "react";
import supabase from "../supabase";
import { useNavigate } from "react-router-dom";

export default function Login({setToken}) {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
  //  const [error, setError] = useState(null);

    let navigate = useNavigate()
    
    async function handleSubmit(e) {
       
        e.preventDefault()

            const { data, error } = await supabase.auth.signInWithPassword(
                {
                  email: email,
                  password: password,
                }
            )  

            if (error) {
               // setError(error.message)
                alert('errore login: ' + error)
            } else {
                console.log('login successful: ' + data);
                navigate('/')
            }
                                 
    } 

    return (
     <div className='h-screen flex items-center justify-center'>
        <form onSubmit={handleSubmit}>
            <VStack>
                <label htmlFor='email'></label>
                <input className='border-solid border-2 rounded-md border-indigo-600' id="email" type="email" name="email" placeholder=" Inserisci l'email" onChange={(e) => setEmail(e.target.value)} required></input>
                <label htmlFor='password'></label>
                <input className='border-solid border-2 rounded-md border-indigo-600 mb-3' id="password" type="password" name="password" placeholder=" Inserisci la password" onChange={(e) => setPassword(e.target.value)} required></input>
                <Button type="submit">Login</Button>
            </VStack>             
        </form>
     </div>
    );
}
