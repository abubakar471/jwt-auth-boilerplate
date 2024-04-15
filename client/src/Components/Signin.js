import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { authActions } from "../store";
import { useDispatch } from "react-redux";

const Signin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setIsLoading(true);
            const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/signin`, {
                email, password
            })

            const data = res.data;

            if (data.success) {
                dispatch(authActions.signin());
                navigate("/welcome")
            }
        } catch (err) {
            console.log(err);
            setIsLoading(false)
        }
    }
    
    return (
        <div className="container">
            <form className="form" onSubmit={handleSubmit}>
                <input type="email" placeholder="email" value={email} onChange={e => setEmail(e.target.value)} />

                <input type="text" placeholder="password" value={password} onChange={e => setPassword(e.target.value)} />

                <button type="submit" disabled={isLoading}>
                    {isLoading ? ("Signing in...") : ("Sign In")}
                </button>
            </form>
        </div>
    )
}

export default Signin