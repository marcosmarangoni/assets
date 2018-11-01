const assert = require('assert');
const Demo = require('../models/demo');

describe("Saving records", function(done){
    it("Saves records to the mongodb", function(){
        var demo = new Demo({
            name: "Mario"
        });
        demo.save().then(function(){
            assert(demo.isNew === false);
            done();
        });
    });
});