import { Link, useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import axios from "axios";
import { authActions } from "../store";
axios.defaults.withCredentials = true;

const Header = () => {
    const isSignedIn = useSelector(state => state.isSignedIn);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSignout = async () => {
        try {
            const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/signout`, { withCredentials: true });

            const data = res.data;

            if(data.success){
                dispatch(authActions.signout());
                navigate("/signin");
            }
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div className="header">
            <div>
                JWT Boilerplater
            </div>

            <div className="auth-links">

                {
                    isSignedIn ? (
                        <button onClick={handleSignout}>Sign Out</button>
                    ) : (
                        <div className="auth-links">
                            <Link to={"/signup"}>Sign Up</Link>
                            <Link to={"/signin"}>Sign In</Link>
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default Header