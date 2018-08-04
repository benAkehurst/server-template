/**
 * This module routes any URL path that starts with: '.../api/'
 */

'use strict';

var debug = require('debug');
var error = debug('apiRoutes:error');
var log = debug('apiRoutes:log');

var express = require('express');
var router = express.Router();

//
// ─── ROUTES DECLARATION ──────────────────────────────────────────────────────────────
//

var v1Routes = require('./v1/v1Routes'); 

//
// ─────────────────────────────────────────────────────── ROUTES DECLARATION ─────
//

    
router.use('/v1/', v1Routes);


module.exports = router;