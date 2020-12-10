
// "use strict";

// var fs = require("fs"); //filesystem module
// var multer = require("multer");
// // fs.rename('/uploads', '/tmp/world', (err) => {
// //     if (err) throw err;
// //     fs.stat('/tmp/world', (err, stats) => {
// //       if (err) throw err;
// //       console.log(`stats: ${JSON.stringify(stats)}`);
// //     });
// //   });
// module.exports = function (app, mongoose, utils, config, constants, upload) {

//     var storage = multer.diskStorage({
//         destination: function (req, file, cb) {

//             cb(null, __dirname + '/../uploads');
//         },
//         filename: function (req, file, cb) {
//             console.log(file)
//             var fileName = file.originalname;
//             //image-20201019
//             cb(null, fileName);
//         }
//     });

//     var upload = multer({ storage: storage })
//     // Paths
//     var modelPath = config.root + "/models";
//     var routePath = config.root + "/routes";

//     // Bootstrap models
//     fs.readdirSync(modelPath).forEach(function (file) {
//         console.log("Loading model : " + file);
//         require(modelPath + "/" + file + "/schema.js")(mongoose, utils);
//     });

//     // Bootstrap routes
//     fs.readdirSync(routePath).forEach(function (file) {
//         console.log("Loading routes : " + file);
//         require(routePath + "/" + file)(app, mongoose, utils, config, constants, upload);
//     });

// };





/**
 * Project          : Shopping
 * Module           : Loader
 * Source filename  : loader.js
 * Description      : Loading all models and routes.
 * Author           : Likhitha M 
 * Copyright        : Copyright © 2020, Shopping
 *                    Written under contract by Robosoft Technologies Pvt. Ltd.
 */
"use strict";

var fs = require("fs"); //filesystem module
var multer = require("multer");
var path = require("path");

// fs.rename('/uploads', '/tmp/world', (err) => {
//     if (err) throw err;
//     fs.stat('/tmp/world', (err, stats) => {
//       if (err) throw err;
//       console.log(`stats: ${JSON.stringify(stats)}`);
//     });
//   });
module.exports = function (app, mongoose, utils, config, constants) {

    let storage = multer.diskStorage({
        destination: function (req, file, cb) {
            req.body[file.fieldname] = file.originalname;
            let ext = path.extname(file.originalname);
            if (ext === ".ppt" || ext === ".pptx") {
                cb(null, __dirname + '/../uploads/contentPptFiles')
            } else if(ext === ".xls" || ext === ".xlsx"){
                cb(null, __dirname + '/../uploads/participantsExcelSheets')
            }
        },
        filename : function(req,file,cb){
            let fileName = file.originalname;
            cb(null, fileName)
        },
    });

    let upload = multer({ storage: storage });

    //var uploadPptFile = multer({ storage: storageForPpt, fileFilter: excelFilter });
    // Paths
    var modelPath = config.root + "/models";
    var routePath = config.root + "/routes";

    // Bootstrap models
    fs.readdirSync(modelPath).forEach(function (file) {
        console.log("Loading model : " + file);
        require(modelPath + "/" + file + "/schema.js")(mongoose, utils);
    });

    // Bootstrap routes
    fs.readdirSync(routePath).forEach(function (file) {
        console.log("Loading routes : " + file);
        require(routePath + "/" + file)(app, mongoose, utils, config, constants, upload);
    });



};