import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
axios.defaults.withCredentials = true;

const Welcome = () => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    let firstRender = true;

    const getUser = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/user/get-user`, { withCredentials: true });

            const data = res.data;

            if (data.success) {
                setUser(data?.data?.user);
            }
        } catch (err) {
            console.log(err);

            if (err?.response?.status === 400) {
                navigate("/signin")
            }
        } finally {
            setIsLoading(false);
        }
    }

    const refreshToken = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/user/refresh-token`, { withCredentials: true });
            const data = res.data;

            if (data.success) {
                setUser(data?.data?.user);
            }
        } catch (err) {
            console.log(err);

            if (err?.response?.status === 400) {
                navigate("/signin")
            }
        }
    }

    useEffect(() => {
        if (firstRender) {
            getUser();
        }

        let interval = setInterval(() => {
            refreshToken();
        }, 1000 * 28)

        return () => clearInterval(interval);
    }, [])

    return (
        <>
            {
                (!isLoading && user) && (
                    <div className="container">
                        Welcome to my world king {user?.username}
                    </div>
                )
            }

            {isLoading && (
                <div style={{ fontSize: "24px" }}>Loading data...</div>
            )}
        </>
    )
}

export default Welcome