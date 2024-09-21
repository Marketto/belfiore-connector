/**
 * @marketto/belfiore-connector 3.0.0
 * Copyright (c) 2019-2024, Marco Ricupero <marco.ricupero@gmail.com>
 * License: MIT
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

class BelfioreAbstractConnector {
    constructor() {
        this.ITALY_KINGDOM_BIRTHDATE = "1861-01-01";
        this.BELFIORE_CODE_MATCHER = /^[A-Z]\d{3}$/iu;
        this.CITY_CODE_MATCHER = /^[A-Y]\d{3}$/iu;
        this.COUNTRY_CODE_MATCHER = /^Z\d{3}$/iu;
    }
}

exports.BelfioreAbstractConnector = BelfioreAbstractConnector;
exports.default = BelfioreAbstractConnector;
