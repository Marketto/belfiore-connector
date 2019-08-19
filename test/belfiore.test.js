const chai = require('chai');
chai.use(require('chai-things'));
const expect = chai.expect;
chai.should();

describe('BelfioreConnector Instance', () => {
    const BelfioreConnector = require('../src/belfiore-connector');
    const belfioreConnector = new BelfioreConnector();

    describe('belfioreConnector.toArray()', () => {
        const belfioreListPromise = belfioreConnector.toArray();
        it('Should return an Array of places', async () => {
            const belfioreList = await belfioreListPromise;
            belfioreList.should.be.a('array');
        });
    });
    describe('belfioreConnector.findByName()', () => {
        it('Should return undefined', async () => {
            const result = await belfioreConnector.findByName('Roma');
            expect(result).to.be.undefined;
        });
    });

    describe('belfioreConnector.cities', () => {
        it('Should return instance of BelfioreConnector', async () => {
            belfioreConnector.cities.should.be.instanceOf(BelfioreConnector);
        });
    });

    describe('belfioreConnector.active', () => {
        it('Should return instance of BelfioreConnector', async () => {
            belfioreConnector.active().should.be.instanceOf(BelfioreConnector);
        });
    });
});