'use strict';

var debug = require('debug');
var error = debug('jsUtils:error');
var log = debug('jsUtils:log');


/**
 * Delete any property from an object that have
 * null or undefined values.
 * 
 * @param {Object} obj 
 */
function deleteNullsFromObject(obj)
{
    for(var propName in obj)
    {
        if(!obj[propName])
        {
            delete obj[propName];
        }
    }
}

/**
 * Return the number of items in a object
 * 
 * @param {Object} obj 
 * @return {Number} num of items in obj
 */
function countItemsInObject(obj)
{
    var size = 0, key;
    for (key in obj) 
    {
        if (obj.hasOwnProperty(key))
        {
            size++;
        } 
    }
    return size;
}

module.exports = {
    deleteNullsFromObject : deleteNullsFromObject,
    countItemsInObject : countItemsInObject
};