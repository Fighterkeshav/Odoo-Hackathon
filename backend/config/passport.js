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
        console.log('Google profile:', profile);

        if (!profile.emails || !profile.emails[0]) {
          console.error('No email found in Google profile');
          return done(new Error('Email not provided by Google'), null);
        }

        // Check if user already exists
        let user;
        try {
          user = await User.findOne({ where: { email: profile.emails[0].value } });
          console.log('User lookup result:', user);
        } catch (dbErr) {
          console.error('DB error on user lookup:', dbErr);
          return done(dbErr, null);
        }

        if (user) {
          if (!user.google_id) {
            try {
              await user.update({ google_id: profile.id });
            } catch (updateErr) {
              console.error('DB error on user update:', updateErr);
              return done(updateErr, null);
            }
          }
          return done(null, user);
        }

        // Create new user
        let newUser;
        try {
          const hashedPassword = await bcrypt.hash(Math.random().toString(36), 10);
          newUser = await User.create({
            name: profile.displayName || `user_${profile.id}`,
            email: profile.emails[0].value,
            password_hash: hashedPassword,
            google_id: profile.id,
            profile_image_url: profile.photos?.[0]?.value || null,
            bio: '',
            points_balance: 0,
            is_verified: true,
            is_admin: false
          });
          console.log('New user created:', newUser);
        } catch (createErr) {
          console.error('DB error on user create:', createErr);
          return done(createErr, null);
        }

        return done(null, newUser);
      } catch (error) {
        console.error('Google OAuth error:', error);
        return done(error, null);
      }
    }
  )
);

module.exports = passport; 