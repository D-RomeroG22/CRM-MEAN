import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import 'dotenv/config';
import passport from "passport";
import {User} from '../Models/index.js';

const options = {
    jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT
}
passport.use('jwtStrategy',new JwtStrategy(options,async(payload,done)=>{
    try {
        const user = await User.findById(payload._id).select('username password rol isActive');
        user ? user.isActive ? done(null,user) : done(null,false) : done(null,false);
    } catch (error) {
        done(error,false);
    }
}));
