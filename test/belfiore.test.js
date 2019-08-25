const chai = require('chai');
chai.use(require('chai-things'));
const expect = chai.expect;
chai.should();

describe('BelfioreConnector Instance', () => {
    const BelfioreConnector = require('../src/belfiore-connector');
    const belfioreConnector = new BelfioreConnector();


    it('Should throw error providing both codeMatcher and province', () => {
        try {
            new BelfioreConnector({ codeMatcher: new RegExp(), province: 'AA' });
        } catch(err) {
            err.should.be.instanceOf(Error);
        }
    });

    describe('belfioreConnector.toArray()', () => {
        const belfioreListPromise = belfioreConnector.toArray();
        it('Should return an Array of places', async () => {
            const belfioreList = await belfioreListPromise;
            belfioreList.should.be.a('array');
        });
    });

    describe('belfioreConnector.searchByName()', () => {
        it('Should throw error providing a name which is not a string, null or undefined', () => {
            try {
                belfioreConnector.searchByName({});
            } catch(err) {
                err.should.be.instanceOf(Error);
            }
        });
        it('Should throw error providing a limit which is not a number', () => {
            try {
                belfioreConnector.searchByName(null, null);
            } catch(err) {
                err.should.be.instanceOf(Error);
            }
        });
        it('Should throw error providing a limit below 0', () => {
            try {
                belfioreConnector.searchByName(null, -1);
            } catch(err) {
                err.should.be.instanceOf(Error);
            }
        });
        it('Should return array providing empty or null name', async () => {
            const result = await belfioreConnector.searchByName(null);
            result.should.be.a('array');
        });
        it('Should return array providing empty or null name and a valid limit', async () => {
            const result = await belfioreConnector.searchByName('', 1);
            result.should.be.a('array');
        });
        it('Should return array providing a regexp', async () => {
            const result = await belfioreConnector.searchByName(new RegExp());
            result.should.be.a('array');
        });
    });

    describe('belfioreConnector.findByName()', () => {
        it('Should return undefined ofr string (no exception)', async () => {
            const result = await belfioreConnector.findByName('Roma');
            expect(result).to.be.undefined;
        });
        it('Should return undefined for regexp (no exception)', async () => {
            const result = await belfioreConnector.findByName(/^Roma$/i);
            expect(result).to.be.undefined;
        });
        it('Should throw error for undefined, null or empty string', async () => {
            await belfioreConnector.findByName().catch(err => err.should.be.a('Error'));
            await belfioreConnector.findByName(null).catch(err => err.should.be.a('Error'));
            await belfioreConnector.findByName('').catch(err => err.should.be.a('Error'));
        });
    });

    describe('cities/countries', () => {
        it('Should return instance of BelfioreConnector for cities', async () => {
            belfioreConnector.cities.should.be.instanceOf(BelfioreConnector);
        });
        it('Should return instance of BelfioreConnector for countries', async () => {
            belfioreConnector.countries.should.be.instanceOf(BelfioreConnector);
        });
    });

    describe('belfioreConnector.active', () => {
        it('Should return instance of BelfioreConnector', async () => {
            belfioreConnector.active().should.be.instanceOf(BelfioreConnector);
        });
    });

    describe('belfioreConnector.byProvince', () => {
        it('Should throw an Error providing empty province code', () => {
            try {
                belfioreConnector.byProvince();
            } catch(err) {
                err.should.be.instanceOf(Error);
            }
        });
        it('Should return instance of BelfioreConnector filtering province', async () => {
            const bfcProvince = belfioreConnector.byProvince('AA');
            bfcProvince.should.be.instanceOf(BelfioreConnector);
        });
    });

    describe('belfioreConnector.getByCode', () => {
        it('Should be undefined', async () => {
            const location = await belfioreConnector.getByCode('A001');
            expect(location).to.be.undefined;
        });
        it('Should return undefined by proxy', async () => {
            const location = await belfioreConnector.A001;
            expect(location).to.be.undefined;
        });
        it('Should throw an Error providing empty belfioreCode', () => {
            try {
                belfioreConnector.getByCode();
            } catch(err) {
                err.should.be.instanceOf(Error);
            }
        });
        it('Should throw an Error providing a belfioreCode which is not a string', () => {
            try {
                belfioreConnector.getByCode([]);
            } catch(err) {
                err.should.be.instanceOf(Error);
            }
        });
    });

    describe('belfioreConnector.config', () => {
        it('Should provide an object', () => {
            belfioreConnector.config().should.be.a('object');
        });

        it('Should provide activeDate', () => {
            const activeDate = new Date();
            const bfc = new BelfioreConnector({
                activeDate
            });
            bfc.config().activeDate.should.be.equal(activeDate);
        });
        it('Should provide province', () => {
            const province = 'AA';
            const bfc = new BelfioreConnector({
                province
            });
            bfc.config().province.should.be.equal(province);
        });
        it('Should provide codeMatcher', () => {
            const codeMatcher = /^[A-Z]\d{3}$/i;
            const bfc = new BelfioreConnector({
                codeMatcher
            });
            bfc.config().codeMatcher.should.be.equal(codeMatcher);
        });
    });

    describe('belfioreConnector proxy', () => {
        it('Should return undefined', () => {
            expect(belfioreConnector.test).to.be.undefined;
        });
        it('Should return undefined for cities in countries', () => {
            expect(belfioreConnector.cities.countries).to.be.undefined;
        });
    });
});