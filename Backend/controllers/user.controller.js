import User from "../models/user.models.js";
import generateToken from "../generateToken.js";

//register user
export const registerUser = async (req, res) => {
    const {name, email, password} = req.body;

    const userExists = await User.findOne({email});
    if(userExists){
        return res.status(400).json({
            message: "User already exists",
        });
    }
    // In registerUser or other async functions:
    if (!name || !email || !password) {
        return res.status(400).json({ message: "Please fill all fields" });
    }
  

    const user = await User.create({
        name,
        email,
        password,
    });

    if(user){
        res.status(201).json({
            _id : user._id,
            name : user.name,
            email : user.email,
            role: user.role,
            token : generateToken(user._id),
        });
    }else{
        res.status(400).json({
            message: "Invalid user data",
        });
    }

};

export const loginUser = async(req, res) =>{
    const {email, password} = req.body;
    const user = await User.findOne({email});

    if(user && (await user.matchPassword(password))){
        res.json({
            token: generateToken(user._id),
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    }else{
        res.status(401).json({
            message: "Invalid email or password",
        });
    }
};

export const adminLogin = async(req, res) =>{
    const {email, password} = req.body;
    const user = await User.findOne({email});

    if(user && (await user.matchPassword(password)) && user.role === "admin"){
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    }else{
        res.status(401).json({
            message: "Invalid admin credentials",
        });
    }
};

export const logoutUser = async(req, res) =>{
    res.clearCookie("token");
    res.status(200).json({
        message: "Logged out successfully",
    });
};

export const getUserProfile = async(req, res) =>{
    const user = await User.findById(req.user._id);
    res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        points: user.points
      });
      
};


export const getUserPoints = async(req, res) =>{
    const user = await User.findById(req.user._id);
    res.json(user.points);
};

// Get all users (admin only)
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.json(users);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch users",
            error: error.message
        });
    }
};


    
