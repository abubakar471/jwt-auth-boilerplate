import jwt from "jsonwebtoken";

const verifyToken = async (req, res, next) => {
    const cookies = req.headers.cookie;
    console.log("verifiying this cookies : ", cookies);

    try {
        const token = cookies.split("=")[1];

        if (!token) {
            return res.status(404).json({
                message: "No Token Found"
            })
        }

        jwt.verify(String(token), process.env.JWT_SECRET, (err, user) => {
            if (err) {
             res.status(400).json({ message: "Invalid Token" });
            }

            req._id = user._id
        });

        next();
    } catch (err) {
        console.log(err);
        res.status(400).json({ message: "Invalid Token" });
    }

}

export default verifyToken