
"use strict";
//Lodash has several built-in utility functions that make coding in JavaScript easier and cleaner.
var _ = require("lodash");

var config = {
    //environments
    //local
    //development
    //staging
    //uat
    //production  
    local: {
        mongo: {
            dbURL: process.env.MONGO_URL,
            options: {
            },
        },
        root: require("path").normalize(__dirname + "/.."), //getting the root path of the project folder
        host: process.env.HOST || "http://localhost",
        port: process.env.PORT || 3000,
        baseUrl: `${process.env.HOST || "http://localhost"}:${process.env.PORT || 3000}`,
        passwordSecret: process.env.PASSWORD_SECRET,
        jwtTokenSecret : process.env.JWT_SECRET,
        email: {
            'user': 'sudarshanatest@yahoo.com',
            'pass': 'grnmekyrnirhkkmj'
        },
        otpExpiry: 5,
        tokenExpiry: 60,
        passwordResetTokenExpiry : 10,
        facebook:{
            appId:'1101829316916625',
            appSecret:'bb3882c1a82ee0f7578f672e23cf9f6f'
        },
        google: {
            clientId:"125000316031-6rio7ml605uh0408el56v1jdbbtr3sul.apps.googleusercontent.com",
            clientSecret:"OU82jPcZw2dEaTxDgFhwUqC-"
        },
        twitter: {
            consumerKey:"GU0eOmP2oa9oox4WnKLKNN4Ge",
            consumerSecret:"2K6l0h8kluwEA2xe637McMi6AyzVzyO2VQYvpIoB3aicfHh56s"
        }
        


    },

    development: {
        mongo: {
            dbURL: "mongodb://10.10.41.7:27017/jobPortal",
            options: {
            },
        },
        root: require("path").normalize(__dirname + "/.."),
        host: process.env.HOST || "http://localhost",
        port: process.env.PORT || 3000,
        baseUrl: `${process.env.HOST || "http://localhost"}:${process.env.PORT || 3000}`,
        passwordSecret: process.env.PASSWORD_SECRET,
        passwordResetTokenExpiry : 10,
        jwtTokenSecret : process.env.JWT_SECRET,
        email: {
            'user': 'sudarshanatest@yahoo.com',
            'pass': 'xkocdqtbiqxrhkoq'
        },
        otpExpiry: 5,
        tokenExpiry: 60,
        facebook:{
            appId:'1101829316916625',
            appSecret:'bb3882c1a82ee0f7578f672e23cf9f6f'
        },
        google: {
            clientId:"125000316031-6rio7ml605uh0408el56v1jdbbtr3sul.apps.googleusercontent.com",
            clientSecret:"OU82jPcZw2dEaTxDgFhwUqC-"
        }

    },

    staging: {
        mongo: {
            dbURL: "mongodb://localhost:27017/jobPortal",
            options: {
            },
        },
        root: require("path").normalize(__dirname + "/.."),
        host: process.env.HOST || "http://localhost",
        port: process.env.PORT || 3000,
        baseUrl: `${process.env.HOST || "http://localhost"}:${process.env.PORT || 3000}`,
        passwordSecret: process.env.PASSWORD_SECRET,
        passwordResetTokenExpiry : 10,
        jwtTokenSecret : process.env.JWT_SECRET,
        email: {
            'user': 'sudarshanatest@yahoo.com',
            'pass': 'xkocdqtbiqxrhkoq'
        },
        otpExpiry: 5,
        tokenExpiry: 60,
        facebook:{
            appId:'1101829316916625',
            appSecret:'bb3882c1a82ee0f7578f672e23cf9f6f'
        },
        google: {
            clientId:"125000316031-6rio7ml605uh0408el56v1jdbbtr3sul.apps.googleusercontent.com",
            clientSecret:"OU82jPcZw2dEaTxDgFhwUqC-"
        }


    },
    uat: {
        mongo: {
            dbURL: "mongodb://localhost:27017/jobPortal",
            options: {
            },
        },
        root: require("path").normalize(__dirname + "/.."),
        host: process.env.HOST || "http://localhost",
        port: process.env.PORT || 3000,
        baseUrl: `${process.env.HOST || "http://localhost"}:${process.env.PORT || 3000}`,
        passwordSecret: process.env.PASSWORD_SECRET,
        passwordResetTokenExpiry : 10,
        jwtTokenSecret : process.env.JWT_SECRET,
        email: {
            'user': 'sudarshanatest@yahoo.com',
            'pass': 'xkocdqtbiqxrhkoq'
        },
        otpExpiry: 5,
        tokenExpiry: 60,
        facebook:{
            appId:'1101829316916625',
            appSecret:'bb3882c1a82ee0f7578f672e23cf9f6f'
        },
        google: {
            clientId:"125000316031-6rio7ml605uh0408el56v1jdbbtr3sul.apps.googleusercontent.com",
            clientSecret:"OU82jPcZw2dEaTxDgFhwUqC-"
        }


    },
    production: {
        mongo: {
            dbURL: process.env.MONGO_URL,
            options: {
                db: {
                    native_parser: true  //native_parser {Boolean, default:false}, use c++ bson parser.
                },
                user: process.env.MONGODBAuthUser, //get username from .env
                pass: process.env.MONGODBAuthPass, //get password from .env
                auth: {   //authenticate db
                    authdb: "admin"
                }
            },
        },
        root: require("path").normalize(__dirname + "/.."),
        host: process.env.HOST || "http://localhost",
        port: process.env.PORT || 3000,
        baseUrl: `${process.env.HOST || "http://localhost"}:${process.env.PORT || 3000}`,
        passwordSecret: process.env.PASSWORD_SECRET,
        passwordResetTokenExpiry : 10,
        jwtTokenSecret : process.env.JWT_SECRET,
        email: {
            'user': 'sudarshanatest@yahoo.com',
            'pass': 'xkocdqtbiqxrhkoq'
        },
        otpExpiry: 5,
        tokenExpiry: 60,
        facebook:{
            appId:'1101829316916625',
            appSecret:'bb3882c1a82ee0f7578f672e23cf9f6f'
        },
        google: {
            clientId:"125000316031-6rio7ml605uh0408el56v1jdbbtr3sul.apps.googleusercontent.com",
            clientSecret:"OU82jPcZw2dEaTxDgFhwUqC-"
        }

    }
};

module.exports = (function () {
    var env = process.env.NODE_ENV || "development";
    
    // console.log(1+2)
    // console.log(config[env]);
    // var defaults ={
    //     limit:10,
    //     skip:0
    // };
    // console.log(_.merge(config[env],defaults))
    return _.merge(config[env]);
})();
