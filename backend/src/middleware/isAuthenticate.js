import jwt from "jsonwebtoken";


const isAuthenticate = (req, res, next) => {
  try {
   
    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // 2️⃣ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3️⃣ Attach user info to request
    req.userId = decoded.userId;

    next();
  } catch (error) {
    // 4️⃣ Handle token errors safely
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

export default isAuthenticate;
