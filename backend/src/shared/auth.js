import jwt from "jsonwebtoken";

export const createAuth = ({ User, jwtSecret }) => {
  const serializeUser = (user) => ({
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
  });

  const signToken = (user) =>
    jwt.sign(
      {
        sub: user._id.toString(),
        email: user.email,
        role: user.role,
      },
      jwtSecret,
      { expiresIn: "7d" }
    );

  const authenticate = async (req, res, next) => {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Missing authorization token" });
    }

    try {
      const token = header.slice(7);
      const payload = jwt.verify(token, jwtSecret);
      const user = await User.findById(payload.sub);

      if (!user) {
        return res.status(401).json({ message: "User session not found" });
      }

      req.user = user;
      next();
    } catch {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  };

  const requireAdmin = (req, res, next) => {
    if (req.user?.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    return next();
  };

  const resolveActorFromRequest = async (req) => {
    if (!req.headers.authorization?.startsWith("Bearer ")) {
      return null;
    }

    try {
      const token = req.headers.authorization.slice(7);
      const decoded = jwt.verify(token, jwtSecret);
      return decoded?.sub ? await User.findById(decoded.sub).lean() : null;
    } catch {
      return null;
    }
  };

  return {
    authenticate,
    requireAdmin,
    signToken,
    serializeUser,
    resolveActorFromRequest,
  };
};
