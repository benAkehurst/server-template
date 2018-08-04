'use strict';

var debug = require('debug');
var error = debug('fsUtils:error');
var log = debug('fsUtils:log');

var fs = require('fs');

/**
 * Delete a file from the file system by absolute path.
 * 
 * @param {*} absPath Absolute path of the file
 * @param {*} next (err)
 */
function deleteFileByPath(absPath, next)
{
    fs.unlink(absPath, function(err)
    {
        if (err)
        {
            error('file path ' + absPath + ' couldnt be deleted');
            error('error message: ' + err.message);
            next(err);
            return;
        }

        log('file ' + absPath + ' was deleted successfully');
        next();
    });
}


module.exports =
{
    deleteFileByPath : deleteFileByPath
}