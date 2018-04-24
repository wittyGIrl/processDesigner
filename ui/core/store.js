/**
 * @fileOverview
 *
 * Store.js local storage
 * @author: Bryce
 */

//------------store.js-------------------
//------------API-------------------
// // Store 'marcus' at 'username'
// store.set('username', 'marcus')
//
// // Get 'username'
// store.get('username')
//
// // Remove 'username'
// store.remove('username')
//
// // Clear all keys
// store.clear()
//
// // Store an object literal - store.js uses JSON.stringify under the hood
// store.set('user', { name: 'marcus', likes: 'javascript' })
//
// // Get the stored object - store.js uses JSON.parse under the hood
// var user = store.get('user')
// alert(user.name + ' likes ' + user.likes)
//
// // Get all stored values
// store.getAll().user.name == 'marcus'
//
// // Loop over all stored values
// store.forEach(function(key, val) {
//     console.log(key, '==', val)
// })
define(function(require, exports, module) {
    var store = window.store;
    var user = require('./user');

    module.exports = {
        getUserData: function(){
            var data = store.get(user.accountId);
            if(!data){
                data = {};
                store.set(user.accountId, data);
            }
            return data;
        },
        set: function(key, value){
            var data = this.getUserData();
            data[key] = value;
            store.set(user.accountId, data);
        },
        get: function(key){
            var data = this.getUserData();
            return data[key];
        },
        remove: function(key){
            var data = this.getUserData();
            delete data[key];
            store.set(user.accountId, data);
        }
    };
});
