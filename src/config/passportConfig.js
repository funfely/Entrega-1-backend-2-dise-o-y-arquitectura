import passport from "passport";
import LocalStrategy from "passport-local";
import JWTStrategy from "passport-jwt";
import jwt from "jsonwebtoken";
import userModel from "../dao/models/userModel.js";
import { createHash, isValidPassword } from "../utils/passwordUtil.js";

const JWTStrategyOptions = {
    jwtFromRequest: JWTStrategy.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: "jwt-secret-key"
};

const initializePassport = () => {
    passport.use("register", new LocalStrategy({
        passReqToCallback: true,
        usernameField: "email"
    }, async (req, email, password, done) => {
        try {
            const user = await userModel.findOne({ email });
            if (user) {
                return done(null, false);
            }

            const newUser = {
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                email,
                age: req.body.age,
                password: createHash(password),
                role: req.body.role || "user"
            };

            const result = await userModel.create(newUser);
            return done(null, result);
        } catch (error) {
            return done(error);
        }
    }));

    passport.use("login", new LocalStrategy({
        usernameField: "email"
    }, async (email, password, done) => {
        try {
            const user = await userModel.findOne({ email });
            if (!user) {
                return done(null, false);
            }

            if (!isValidPassword(password, user.password)) {
                return done(null, false);
            }

            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }));

    passport.use("jwt", new JWTStrategy.Strategy(JWTStrategyOptions, async (payload, done) => {
        try {
            const user = await userModel.findById(payload.id);
            if (!user) {
                return done(null, false);
            }
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }));

    passport.use("current", new JWTStrategy.Strategy(JWTStrategyOptions, async (payload, done) => {
        try {
            const user = await userModel.findById(payload.id);
            if (!user) {
                return done(null, false);
            }
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }));

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await userModel.findById(id);
            done(null, user);
        } catch (error) {
            done(error);
        }
    });
};

export const generateToken = (user) => {
    return jwt.sign({ id: user._id, email: user.email }, "jwt-secret-key", { expiresIn: "24h" });
};

export default initializePassport;
