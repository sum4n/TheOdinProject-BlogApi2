const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const prisma = require("./prismaClient");
const bcrypt = require("bcryptjs");

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const user = await prisma.user.findUnique({
          where: { email },
        });
        if (!user) {
          return done(null, false, { message: "Incorrect email." });
        }
        // compare hashed password
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
          return done(null, false, { message: "Incrorrect password." });
        }

        return done(null, user, { message: "Logged in successfully." });
      } catch (err) {
        return done(err);
      }
    }
  )
);

const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

let opts = {};
opts.jwtFromRequest = ExtractJWT.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET_KEY;

passport.use(
  new JWTStrategy(opts, async (jwtPayload, done) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: jwtPayload.id },
      });
      if (!user) {
        return done(null, false);
      }

      return done(null, user);
    } catch (err) {
      return done(err, false);
    }
  })
);

module.exports = passport;
