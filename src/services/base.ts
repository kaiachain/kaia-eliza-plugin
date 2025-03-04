import { Config } from "../types/account";

export abstract class BaseService {
    protected config: Config;
    
    constructor(config) {
        this.config = config;
    }
}