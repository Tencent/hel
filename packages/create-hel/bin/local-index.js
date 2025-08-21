#!/usr/bin/env node
const { setIsDebug } = require('./util');
const { analyzeArgs } = require('./analyze-args');

setIsDebug(true);
analyzeArgs();
