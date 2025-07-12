const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { User } = require('../models');
const bcrypt = require('bcryptjs');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ['profile', 'email']
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists
        let user = await User.findOne({
          where: { email: profile.emails[0].value }
        });

        if (user) {
          // Update Google ID if not set
          if (!user.google_id) {
            await user.update({ google_id: profile.id });
          }
          return done(null, user);
        }

        // Create new user
        const hashedPassword = await bcrypt.hash(Math.random().toString(36), 10);
        
        user = await User.create({
          username: profile.displayName,
          email: profile.emails[0].value,
          password: hashedPassword,
          google_id: profile.id,
          profile_picture: profile.photos[0]?.value || null,
          is_verified: true // Google users are pre-verified
        });

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

module.exports = passport; 