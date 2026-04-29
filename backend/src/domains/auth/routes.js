import bcrypt from "bcryptjs";

export const registerAuthRoutes = (app, { User, authenticate, signToken, serializeUser }) => {
  app.post("/api/auth/login", async (req, res) => {
    const { name, email, role, password } = req.body ?? {};

    if (!email || !role) {
      return res.status(400).json({ message: "email and role are required" });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const trimmedName = String(name || "").trim();

    if (role === "admin") {
      if (!password) {
        return res.status(400).json({ message: "Admin password is required" });
      }

      const adminUser = await User.findOne({ email: normalizedEmail }).select("+passwordHash");
      if (!adminUser || adminUser.role !== "admin" || !adminUser.passwordHash) {
        return res.status(401).json({ message: "Invalid admin credentials" });
      }

      const isValidPassword = await bcrypt.compare(String(password), adminUser.passwordHash);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid admin credentials" });
      }

      if (trimmedName) {
        adminUser.name = trimmedName;
        await adminUser.save();
      }

      const token = signToken(adminUser);
      return res.json({ user: serializeUser(adminUser), token });
    }

    if (!trimmedName) {
      return res.status(400).json({ message: "name is required" });
    }

    let user = await User.findOne({ email: normalizedEmail });

    if (user?.role === "admin") {
      return res.status(403).json({ message: "This email is reserved for admin access" });
    }

    if (!user) {
      user = await User.create({
        name: trimmedName,
        email: normalizedEmail,
        role,
      });
    } else {
      if (user.role !== role) {
        return res.status(409).json({ message: `This account is registered as ${user.role}. Use that role to sign in.` });
      }

      user.name = trimmedName;
      await user.save();
    }

    const token = signToken(user);
    return res.json({ user: serializeUser(user), token });
  });

  app.get("/api/auth/me", authenticate, (req, res) => {
    return res.json({ user: serializeUser(req.user) });
  });

  app.post("/api/auth/logout", authenticate, (_req, res) => {
    return res.json({ ok: true });
  });
};
