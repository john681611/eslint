/**
 * @fileoverview Visual Studio compatible formatter
 * @author Ronald Pijnacker
 * @author John Harvey
 */

"use strict";
const chalk = require("chalk");

//------------------------------------------------------------------------------
// Helper Functions
//------------------------------------------------------------------------------

/**
 * Returns the severity of warning or error
 * @param {Object} message message object to examine
 * @returns {string} severity level
 * @private
 */
function getMessageType(message) {
    if (message.fatal || message.severity === 2) {
        return chalk`{red error}`;
    }
    return chalk`{yellow warning}`;

}


//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

module.exports = function(results) {

    let output = "",
        total = 0;

    results.forEach(result => {

        const messages = result.messages;
        const filePath = result.filePath.replace(process.cwd(), ".");

        total += messages.length;

        if (messages.length) {
            output += `\n\n${filePath} - ${messages.length}\n`;
        }

        messages.forEach(message => {
            output += chalk`${getMessageType(message)}: ${message.message} {dim ${message.ruleId || ""}} {cyan ${filePath}:${message.line || 0},${message.column || 0}}\n`;

        });

    });

    if (total === 0) {
        output += "no problems";
    } else {
        output += `\n${total} problem${total !== 1 ? "s" : ""}`;
    }

    return output;
};
