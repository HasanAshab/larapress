import { Response } from 'express';

interface ResponseClass extends Response {}
class ResponseClass {}

export { ResponseClass as Response };