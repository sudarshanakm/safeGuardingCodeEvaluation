var passport = require("passport");
var BearerStrategy = require("passport-http-bearer").Strategy;
// const FacebookTokenStrategy = require('passport-facebook-token');
// const GoogleTokenStrategy = require("passport-google-token").Strategy;
// var TwitterTokenStrategy = require('passport-twitter-token');

var mongoose = require("mongoose");
var config = require("../configs/config");
var Employees = mongoose.model("Employees");
var utils = require("../utils/util");
passport.use(new BearerStrategy(
    async function (token, done) {
        try {
          //  console.log("-----------token", token);
            var queryObj = {
                token: token,
                tokenExpiry: { $gte: new Date() }
            };
            let data = await Employees.getDataByQuery(queryObj);
            data = data[0];
            if (String(data) === "") {
                return done(null, false);
            }
            return done(null, data)
        } catch (error) {
            console.log(error);
            return done(error);
        }
    })
);

// passport.use(new FacebookTokenStrategy({
//     clientID: config.facebook.appId,
//     clientSecret: config.facebook.appSecret,
//     // "profileFields": ['emails', 'name', 'gender', 'displayName']
//     // fbGraphVersion: 'v3.0'
// }, function (accessToken, refreshToken, profile, done) {
//     console.log("------accessToken", accessToken, "-----profile", profile)

//     try {
//         var userObj = {};
//         var query = {};
//         if (profile) {
//             if (profile.emails && profile.emails.length > 0) {
//                 query.email = profile.emails[0].value;
//             }
//             userObj.name = profile.displayName;
//             userObj.gender = profile.gender;
//             userObj.profilePic = profile.photos ? profile.photos[0].value : '';
//             userObj.facebookId = profile.id;

//             console.log("====> displaying fetched facebook profile", profile);


//             Users.getUserByQuery(query, function (err, user) {
//                 if (err) {
//                     return done(err);
//                 }
//                 if (!user) {
//                     Users.addUser(userObj, function (err, user) {
//                         if (err) {
//                             return done(err);
//                         } else {
//                             console.log("-----addedUser", user)
//                             return done(null, user);
//                         }
//                     });

//                 } else {
//                     var updateObj = {
//                         facebookId: userObj.facebookId
//                     }
//                     Users.updateUser({ _id: user._id }, updateObj, function (err, user) {
//                         if (err) {
//                             return done(err);
//                         } else {
//                             console.log("----updatedUser", updatedUser)
//                             return done(null, user);
//                         }

//                     })

//                 }

//             })
//             // console.log("-----profile",profile)
//         } else {
//             return done(err);
//         }
//     } catch (error) {
//         return done(err);
//     }

//     // console.log("-----accessToken", accessToken)
//     // User.findOrCreate({facebookId: profile.id}, function (error, user) {
//     //   return done(error, user);
//     // });
// }
// ));

// passport.use(new GoogleTokenStrategy({
//     clientID: config.google.clientId,
//     clientSecret: config.google.clientSecret
// },
//     function (accessToken, refreshToken, profile, done) {
//         if (profile) {
//             console.log("========>fetched google profile is here", profile);
//             Users.find({}, function (err, user) {
//                 return done(user);
//             });
//         }
//         // User.findOrCreate({ googleId: profile.id }, function (err, user) {
//         //   return done(err, user);
//         // });
//     }
// ));


// passport.use(new TwitterTokenStrategy({
//     consumerKey: config.twitter.consumerKey,
//     consumerSecret: config.twitter.consumerSecret
// }, function (token, tokenSecret, profile, done) {
//     // User.findOrCreate({ twitterId: profile.id }, function (error, user) {
//     //   return done(error, user);
//     // });
//     if (profile) {
//         console.log("========>fetched twitter profile is here", profile);
//         Users.find({}, function (err, user) {
//             return done(user);
//         });
//     }
// }
// ));

exports.isAuthenticated = passport.authenticate('bearer', { session: false });
// exports.faceBookAuthenticate = passport.authenticate('facebook-token', { session: false });
// exports.googleAuthenticate = passport.authenticate('google-token', { session: false });
// exports.twitterAuthenticate = passport.authenticate('twitter-token', { session: false });