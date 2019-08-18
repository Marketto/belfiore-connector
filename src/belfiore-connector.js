/**
 * Handler for cities and countries Dataset
 * 
 * @namespace BelfioreConnector
 */
class BelfioreConnector {
    /**
     * 
     * @param {Object} [param] Static json
     * @param {Date} [param.activeDate] Target date to filter places active only for the given date
     * @param {RegExp} [param.codeMatcher] Belfiore code matcher
     * @param {string} [param.province] Province code
     * @constructor
     * @private
     */
    constructor({ activeDate, codeMatcher, province } = {}) {
        if (codeMatcher && province) {
            throw new Error('Both codeMatcher and province were provided to Bolfiore, only one is allowed');
        }
        const hiddenValueConf = value => ({
            value,
            enumerable: false,
            configurable: false,
            writable: false
        });

        Object.defineProperties(this, {
            _activeDate: hiddenValueConf(activeDate),
            _codeMatcher: hiddenValueConf(codeMatcher),
            _province: hiddenValueConf(province)
        });

        return new Proxy(this, this.constructor);
    }

    /**
     * @async
     * @returns {Array<Object>} List of places
     * @public
     */
    async toArray() {
        return [];
    }

    /**
     * Search places matching given name
     * @async
     * @param {string} name Place name
     * @returns {Array<Object>} List of places
     * @throws {Error} Missing or invalid provided name
     * @public
     */
    async searchByName(name) {
        if (typeof name !== 'string') {
            throw new Error('Missing or invalid provided name');
        }
        if (!name) {
            return await this.toArray();
        }
        return [];
    }

    /**
     * Find place matching given name, retuns place object if provided name match only 1 result
     * @async
     * @param {string} name Place name
     * @returns {Object}
     * @throws {Error} Missing or invalid provided name
     * @public
     */
    async findByName(name) {
        if (!name || typeof name !== 'string') {
            throw new Error('Missing or invalid provided name');
        }
        return null;
    }

    /**
     * Returns current BelfioreConnector config
     * @returns {Object} config object
     * @memberof BelfioreConnector
     */
    config() {
        const conf = {};
        const inheritAttrs = Object.entries(this)
            .filter(([key, value]) => (/^_[a-z]+/).test(key) && typeof value !== 'function')
            .map(([key, value]) => ({[key.match(/^_(.+)$/i)[1]]: value}));
        inheritAttrs.forEach(attr => Object.assign(conf, attr));
        return conf;
    }

    /**
     * Returns a Proxied version of Belfiore which filters results by given date
     * @param {string|Date|Array<number>} [date = new Date()] Target date to filter places active only for the given date
     * @returns {BelfioreConnector} Belfiore instance filtered by active date
     * @public
     */
    active(date = new Date()) {
        const conf = this.config();
        conf.activeDate = date;

        return new this.constructor(conf);
    }

    /**
     * Returns a Belfiore instance filtered by the given province
     * @param {string} code Province Code (2 A-Z char)
     * @returns {BelfioreConnector} Belfiore instance filtered by province code
     * @public
     */
    byProvince(code) {
        if (!(typeof code === 'string' && (/^[A-Z]{2}$/u).test(code))) {
            return;
        }
        const conf = this.config();
        conf.province = code;
        return new this.constructor(conf);
    }

    /**
     * Returns a Proxied version of Belfiore which filters results by place type
     * @readonly
     * @returns {BelfioreConnector} Belfiore instance filtered by cities
     * @public
     */
    get cities() {
        const conf = this.config();
        conf.codeMatcher = /^[A-Y]/u;
        return new this.constructor(conf);
    }

    /**
     * Returns a Proxied version of Belfiore which filters results by place type
     * @readonly
     * @returns {BelfioreConnector} Belfiore instance filtered by countries
     * @public
     */
    get countries() {
        const conf = this.config();
        conf.codeMatcher = /^Z/u;
        return new this.constructor(conf);
    }

    /**
     * Retrieve place matching given belfioreCode
     * @async
     * @param {string} belfioreCode Belfiore Code
     * @returns {Object}
     * @throws {Error} Missing or invalid provided name
     * @public
     */
    async getByCode(belfioreCode) {
        if (!belfioreCode || typeof belfioreCode !== 'string') {
            throw new Error('Missing or invalid provided code');
        }
        return null;
    }

    /**
     * Get Proxy
     * @param {Object} resource target resource
     * @param {string|number|Symbol} paramName property name to proxy
     * @returns {*} Proxied property
     * @private
     */
    static get (resource, paramName) {
        if (typeof paramName  === 'string' && (/^[A-Z]\d{3}$/u).test(paramName)){
            return this.getByCode(paramName);
        }

        if (
            (resource._codeMatcher || resource._province) &&
            ['cities', 'countries'].includes(paramName) ||
        
            paramName === 'byProvince' &&
            (resource._codeMatcher.test('Z000') || resource._province)
        ) {
            return;
        }

        return resource[paramName];
    }
}

module.exports = BelfioreConnector;