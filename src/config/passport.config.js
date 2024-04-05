import passport from "passport";
import local from "passport-local";
import GitHubStrategy from "passport-github2";

import userModel from "../dao/models/user.model.js";
import { createHash, validatePassword } from "../utils.js";

const LocalStrategy = local.Strategy;

const initializePassport = () => {
    passport.use("register", new LocalStrategy(
        { passReqToCallback: true, usernameField: "email" },
        async (req, username, password, done) => {
            const { first_name, last_name, email, age } = req.body;
            try {
                let user = await userModel.findOne({ email: username });
                if (user) {
                    console.log('Usuario ya registrado');
                    return done(null, false);
                }
                const newUser = {
                    first_name,
                    last_name,
                    email,
                    age,
                    password: createHash(password)
                };
                const result = await userModel.create(newUser);
                return done(null, result);

            } catch (error) {
                console.error("Error en registro de usuario:", error);
                return done(error);
            }
        }
    ));

    passport.use("login", new LocalStrategy(
        { passReqToCallback: true, usernameField: "email" },
        async (req, username, password, done) => {
            try {
                console.log("req.body", req.body);
                const user = await userModel.findOne({ email: req.body.email });
                console.log("User: ", user);
                if (!user) {
                    return done(null, false);
                }
                if (!validatePassword(user, req.body.password)) {
                    return done(null, false);
                }
                return done(null, user);
            } catch (error) {
                console.error("Error en inicio de sesión:", error);
                return done(error);
            }
        }
    ));

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        let user = await userModel.findById(id);
        done(null, user);
    });

    passport.use("github", new GitHubStrategy({
        clientID: "Iv1.c2a303f90a0c561a",
        clientSecret: "d073afe6380e8b74447a7bf403f1a0a43c6e7f3e",
        callbackURL: "http://localhost:8080/api/sessions/githubcallback"
    }, async (accesToken, refreshToken, profile, done) => {
        try {
            console.log(profile);
            let user = await userModel.findOne({ email: profile._json.email });
            if (user) {
                console.log('Usuario ya registrado');
                return done(null, false);
            }
            const newUser = {
                first_name: profile._json.name,
                last_name: "",
                email: profile._json.email,
                age: 18,
                password: ""
            };
            const result = await userModel.create(newUser);
            return done(null, result);
        } catch (err) {
            console.error("Error en autenticación de GitHub:", err);
            return done(err);
        }
    }));

};

export default initializePassport;
