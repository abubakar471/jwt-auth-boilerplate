import User from "../models/User.model.js";

export const getUser = async (req, res, next) => {
    const userId = req._id;

    let user;

    try {
        user = await User.findById(userId).select("-password");
    } catch (err) {
        console.log(err);
    }

    if (!user) {
        return res.status(404).json({ message: "User Not Found!" });
    }

    return res.status(200).json({success : true, data : {
        user
    }})
}