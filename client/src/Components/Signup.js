import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setIsLoading(true);
            const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/signup`,{
                username, email, password
            })

            const data = res.data;
            
            if(data){
                navigate("/signin")
            }
        } catch (err) {
            console.log(err);
            setIsLoading(false)
        }
    }
    return (
        <div className="container">
            <form className="form" onSubmit={handleSubmit}>
                <input type="text" placeholder="username" value={username} onChange={e => setUsername(e.target.value)} />

                <input type="email" placeholder="email" value={email} onChange={e => setEmail(e.target.value)} />

                <input type="text" placeholder="password" value={password} onChange={e => setPassword(e.target.value)} />

                <button type="submit" disabled={isLoading}>
                    {isLoading ? ("Signing up...") : ("Sign Up")}
                </button>
            </form>
        </div>
    )
}

export default Signup