/**
 * @fileOverview
 *
 * Current User
 * @author: Bryce
 */

define(function(require, exports, module) {
    module.exports = window.context && window.context.user ||
        {
            accountId : -100,
            employeeId : -100
        };
});
