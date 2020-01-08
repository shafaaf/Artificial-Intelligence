import "mocha";
import * as assert from "assert";
import {SmokeTest} from "../dist";

describe("index",() => {

    it("should say 'hello world'",()=>{
        SmokeTest.HelloWorld();
        assert.ok(true);
    });

});
