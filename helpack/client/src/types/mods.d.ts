/**
 * merge all concent models in this file to infer the root model type
 */
import models from '../models';

const allModels = models;

export type Models = typeof allModels;
