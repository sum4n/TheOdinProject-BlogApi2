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
        console.log(user);
        if (!user) {
          return done(null, false, { message: "Incorrect email." });
        }
        // compare hashed password
        const match = await bcrypt.compare(password, user.password);
        console.log(match);
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

module.exports = passport;
