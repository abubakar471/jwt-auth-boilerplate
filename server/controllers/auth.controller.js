import User from "../models/User.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const signUp = async (req, res, next) => {
    const { username, email, password } = req.body;

    let existingUser;

    try {
        existingUser = await User.findOne({ email: email });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }

    if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
    }

    try {
        const hashedPassword = bcrypt.hashSync(password);

        const newUser = await User.create({
            username,
            email,
            password: hashedPassword
        })

        newUser.password = undefined;

        return res.status(200).json({ success: true, message: "User Signed Up Successfully", data: newUser });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}


export const signIn = async (req, res, next) => {
    const { email, password } = req.body;

    let existingUser;

    try {
        existingUser = await User.findOne({ email: email });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }

    if (!existingUser) {
        return res.status(404).json({ message: "User Not Found" });
    }

    const isPasswordCorrect = bcrypt.compareSync(password, existingUser.password);

    if (!isPasswordCorrect) {
        return res.status(400).json({ message: "Invalid Email Or Password" });
    }

    const token = jwt.sign({ _id: existingUser?._id, }, process.env.JWT_SECRET, { expiresIn: "35s" })

    console.log("generated token\n", token);

    if (req.cookies[`${existingUser?._id}`]) {
        req.cookies[`${existingUser?._id}`] = ""
    }

    res.cookie(String(existingUser._id), token, {
        path: "/",
        expires: new Date(Date.now() + 1000 * 60), //30s
        httpOnly: true,
        sameSite: "lax"
    })

    existingUser.password = undefined;

    return res.status(200).json({
        success: true, message: "Successfully Signed In", data: {
            user: existingUser,
            token
        }
    });
}


export const refreshToken = async (req, res, next) => {
    const cookies = req.headers.cookie;
    console.log("refresing this cookies : ", cookies);
    try {
        const prevToken = cookies.split("=")[1];

        if (!prevToken) {
            return res.status(404).json({
                message: "No Token Found"
            })
        }

        jwt.verify(String(prevToken), process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return res.status(403).json({ message: "Authentication Failed" });
            }

            res.clearCookie(`${user?._id}`);
            req.cookies[`${user?._id}`] = "";

            // generate new refresh token
            const token = jwt.sign({ _id: user?._id, }, process.env.JWT_SECRET, { expiresIn: "35s" });

            console.log("re-generated token\n", token);

            res.cookie(String(user._id), token, {
                path: "/",
                expires: new Date(Date.now() + 1000 * 60), //30s
                httpOnly: true,
                sameSite: "lax"
            })

            req._id = user._id
        });

        next();
    } catch (err) {
        console.log(err)
        return res.status(400).json({ message: "Invalid Token" });
    }
}


export const signOut = async (req, res, next) => {
    const cookies = req.headers.cookie;

    try {
        const prevToken = cookies.split("=")[1];

        if (!prevToken) {
            return res.status(404).json({
                message: "No Token Found"
            })
        }

        jwt.verify(String(prevToken), process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return res.status(403).json({ message: "Authentication Failed" });
            }

            res.clearCookie(`${user?._id}`);
            req.cookies[`${user?._id}`] = "";

            return res.status(200).json({success : true, message : "Signed Out Successfully"})
        });

        next();
    } catch (err) {
        console.log(err)
        return res.status(400).json({ message: "Invalid Token" });
    }
}