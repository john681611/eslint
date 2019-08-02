/**
 * @fileoverview Tests for VisualStudio format.
 * @author Ronald Pijnacker
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const assert = require("chai").assert,
    formatter = require("../../../../lib/cli-engine/formatters/visualstudio");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("formatter:visualstudio", () => {
    describe("when passed no messages", () => {
        const code = [{
            filePath: "foo.js",
            messages: []
        }];

        it("should return nothing", () => {
            const result = formatter(code);

            assert.strictEqual(result, "no problems");
        });
    });

    describe("when passed a single message", () => {
        const code = [{
            filePath: "foo.js",
            messages: [{
                message: "Unexpected foo.",
                severity: 2,
                line: 5,
                column: 10,
                ruleId: "foo"
            }]
        }];

        it("should return a string in the format filename - 1\\n error: for errors z filename:x,y", () => {
            const result = formatter(code);

            assert.strictEqual(result, "\n\nfoo.js - 1\nerror: Unexpected foo. foo foo.js:5,10\n\n1 problem");
        });

        it("should return a string in the format filename - 1\\n  warning: for warnings z filename:x,y", () => {
            code[0].messages[0].severity = 1;
            const result = formatter(code);

            assert.strictEqual(result, "\n\nfoo.js - 1\nwarning: Unexpected foo. foo foo.js:5,10\n\n1 problem");
        });
    });

    describe("when passed a fatal error message", () => {
        const code = [{
            filePath: "foo.js",
            messages: [{
                fatal: true,
                message: "Unexpected foo.",
                line: 5,
                column: 10,
                ruleId: "foo"
            }]
        }];

        it("should return a string in the format error: z filename:x,y", () => {
            const result = formatter(code);

            assert.strictEqual(result, "\n\nfoo.js - 1\nerror: Unexpected foo. foo foo.js:5,10\n\n1 problem");
        });
    });

    describe("when passed multiple messages", () => {
        const code = [{
            filePath: "foo.js",
            messages: [{
                message: "Unexpected foo.",
                severity: 2,
                line: 5,
                column: 10,
                ruleId: "foo"
            }, {
                message: "Unexpected bar.",
                severity: 1,
                line: 6,
                column: 11,
                ruleId: "bar"
            }]
        }];

        it("should return a string with multiple entries", () => {
            const result = formatter(code);

            assert.strictEqual(result, "\n\nfoo.js - 2\nerror: Unexpected foo. foo foo.js:5,10\nwarning: Unexpected bar. bar foo.js:6,11\n\n2 problems");
        });
    });

    describe("when passed multiple files with 1 message each", () => {
        const code = [{
            filePath: "foo.js",
            messages: [{
                message: "Unexpected foo.",
                severity: 2,
                line: 5,
                column: 10,
                ruleId: "foo"
            }]
        }, {
            filePath: "bar.js",
            messages: [{
                message: "Unexpected bar.",
                severity: 1,
                line: 6,
                column: 11,
                ruleId: "bar"
            }]
        }];

        it("should return a string with multiple entries", () => {
            const result = formatter(code);

            assert.strictEqual(result, "\n\nfoo.js - 1\nerror: Unexpected foo. foo foo.js:5,10\n\n\nbar.js - 1\nwarning: Unexpected bar. bar bar.js:6,11\n\n2 problems");
        });
    });

    describe("when passed one file not found message", () => {
        const code = [{
            filePath: "foo.js",
            messages: [{
                fatal: true,
                message: "Couldn't find foo.js."
            }]
        }];

        it("should return a string without line and column", () => {
            const result = formatter(code);

            assert.strictEqual(result, "\n\nfoo.js - 1\nerror: Couldn't find foo.js.  foo.js:0,0\n\n1 problem");
        });
    });
});
