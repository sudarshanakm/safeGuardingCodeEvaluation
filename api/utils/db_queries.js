"use strict";

module.exports = function (schema) {

    schema.statics.getDataByQuery = function (queryObj, options) {
        var self = this;
        //findById method is used to get the data by _id
        var data = self.find(queryObj);
        if(options){
            if(options.populate){
                data = data.populate(options.populate);
            }
            if(options.select){
                data = data.select(options.select);
            }
            if(options.queryText){
                data = data.find(options.queryText);
            }
        }
        return data.exec();        
    };

    schema.statics.updateData = function(queryObj, dataObj){
        var self = this;
        return self.updateOne(queryObj, dataObj);
    };

    schema.statics.addData = function (dataObj) {
        // self is being used to maintain a reference to the original this even as the context is changing.
        var self = this;
        var data = new self(dataObj);
        //.save method is used to insert the data to the user collection
        return data.save();
    };

    schema.statics.deleteData = function(dataObj){
        var self = this;
        return self.remove(dataObj,{justOne: true});
    }

    // schema.statics.getJobsByQuery = function (queryObj, callback) {
    //     var self = this;
    //     var findQuery = queryObj.query;
    //     console.log("========>findQuery", findQuery);
    //     //findById method is used to get the data by _id
    //     if(queryObj.populate){
    //         self.find(findQuery,queryObj.excludedFields).populate(queryObj.populate).lean().exec(function (err, data) {
    //             callback(err, data);
    //         });
    //     }
    //     else{
    //         self.find({findQuery},queryObj.excludedFields).lean().exec(function(err,data){
    //             callback(err,data);
    //         })
    //     }
    // };

    return schema;
}