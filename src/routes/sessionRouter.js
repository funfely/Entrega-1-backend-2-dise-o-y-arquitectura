import express from "express";
import passport from "passport";
import { generateToken } from "../config/passportConfig.js";

const router = express.Router();

router.post("/register", passport.authenticate("register", { session: false }), async (req, res) => {
    res.status(201).json({
        message: "Registro exitoso",
        user: req.user
    });
});

router.post("/login", passport.authenticate("login", { session: false }), async (req, res) => {
    const token = generateToken(req.user);
    res.status(200).json({
        message: "Login exitoso",
        token,
        user: {
            id: req.user._id,
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            email: req.user.email,
            age: req.user.age,
            role: req.user.role
        }
    });
});

router.get("/current", passport.authenticate("current", { session: false }), async (req, res) => {
    res.status(200).json({
        message: "Datos del usuario actual",
        user: {
            id: req.user._id,
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            email: req.user.email,
            age: req.user.age,
            role: req.user.role,
            cart: req.user.cart
        }
    });
});

export default router;
