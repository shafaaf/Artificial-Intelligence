const dist = require("../dist");

describe("index",() => {
    it("should say 'hello world'",()=>{
        dist.SmokeTest.HelloWorld();
    });
});
