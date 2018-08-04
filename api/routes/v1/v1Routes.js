/**
 * This module routes any URL path that starts with: '.../api/v1/'
 */

'use strict';

var debug = require('debug');
var error = debug('v1Routes:error');
var log = debug('v1Routes:log');

var express = require('express');
var router = express.Router();



//
// ─── ROUTES IMPORT ─────────────────────────────────────────────────────────────────────
//

var userRoutes = require('./userRoutes');


//
// ─────────────────────────────────────────────────────────────────── ROUTES IMPORT─────
//



//
// ─── ROUTES DECLARATION ─────────────────────────────────────────────────────────
//


router.use('/user/', userRoutes);

    
//
// ─────────────────────────────────────────────────────── ROUTES DECLARATION ─────
//

    


module.exports = router;
