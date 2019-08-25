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
     * @param {null|string|RegExp} [name = null] Place name or name matcher
     * @param {number} [limit=0] result limit
     * @returns {Array<Object>} List of places
     * @throws {Error} Missing or invalid provided name
     * @public
     */
    async searchByName(name = null, limit = 0) {
        if (!(name === null || ['string', 'undefined'].includes(typeof name) || name instanceof RegExp)) {
            throw new Error('Missing or invalid provided name, it must be a string, a RegExp, null or undefined');
        }
        if (typeof limit !== 'number') {
            throw new Error('Invalid provided limit, must be a number');
        }
        if (limit < 0) {
            throw new Error('Invalid provided limit, must be equal or greater than 0');
        }
        if (!name) {
            const fullList = await this.toArray();
            if (limit) {
                return fullList.slice(0, limit);
            }
            return fullList;
        }
        return [];
    }

    /**
     * Find place matching exactly given name; retuns place object if provided name match only 1 result
     * @async
     * @param {string|RegExp} name Place name or name matcher
     * @returns {Object}
     * @throws {Error} Missing or invalid provided name
     * @public
     */
    async findByName(name) {
        if (!name) {
            throw new Error('Missing or invalid provided name, it must be a string or a RegExp');
        }
        const result = await this.searchByName(name instanceof RegExp ? name : new RegExp(`^${name}$`, 'ui'), 1);
        return result[0];
    }

    /**
     * Returns current BelfioreConnector config
     * @returns {Object} config object
     * @memberof BelfioreConnector
     */
    config() {
        const conf = {};
        const inheritAttrs = Object.getOwnPropertyNames(this)
            .filter(key => (/^_[a-z]+/).test(key) && typeof this[key] !== 'function')
            .map(key => ({[key.match(/^_(.+)$/i)[1]]: this[key]}));
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
            return resource.getByCode(paramName);
        }

        if (
            (resource._codeMatcher || resource._province) &&
            ['cities', 'countries'].includes(paramName) ||
        
            paramName === 'byProvince' &&
            (
                resource._codeMatcher instanceof RegExp && resource._codeMatcher.test('Z000') ||
                (/^[A-Z]{2}$/ui).test(resource._province)
            )
        ) {
            return;
        }

        return resource[paramName];
    }
}

module.exports = BelfioreConnector;