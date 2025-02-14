class ConfigSingleton {
    constructor() {
        if (ConfigSingleton.instance) {
            return ConfigSingleton.instance;
        }
        
        this.config = {};
        ConfigSingleton.instance = this;
    }

    set(key, value) {
        this.config[key] = value;
    }

    get(key) {
        return this.config[key];
    }

    getAllConfig() {
        return this.config;
    }
}

module.exports = new ConfigSingleton();