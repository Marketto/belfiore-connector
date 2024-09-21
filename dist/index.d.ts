interface IBelfioreCommonPlace {
    belfioreCode: string;
    creationDate: Date;
    dataSource: {
        authors?: string;
        license: string;
        licenseUrl?: string;
        name: string;
        termsAndConditions?: string;
        url?: string;
    };
    expirationDate: Date;
    name: string;
}

interface IBelfioreCity extends IBelfioreCommonPlace {
    iso3166: undefined;
    province: string;
}

interface IBelfioreCountry extends IBelfioreCommonPlace {
    iso3166: string;
    province: undefined;
}

interface IBelfiorePlace extends IBelfioreCommonPlace {
    iso3166: undefined;
    province: undefined;
}

type BelfiorePlace = IBelfiorePlace | IBelfioreCity | IBelfioreCountry;

type MultiFormatDate = string | Date | number[];

interface IBelfioreConnector {
    get provinces(): Promise<string[]>;
    toArray(): Promise<BelfiorePlace[]>;
    searchByName(name: string): Promise<BelfiorePlace[] | null>;
    findByName(name: string): Promise<BelfiorePlace | null>;
    findByCode(belfioreCode: string): Promise<BelfiorePlace | null>;
    get cities(): IBelfioreConnector | undefined;
    get countries(): IBelfioreConnector | undefined;
    active(date: MultiFormatDate): IBelfioreConnector;
    from(date: MultiFormatDate): IBelfioreConnector;
    byProvince(code: string): IBelfioreConnector | undefined;
}

declare abstract class BelfioreAbstractConnector implements IBelfioreConnector {
    protected readonly ITALY_KINGDOM_BIRTHDATE = "1861-01-01";
    protected readonly BELFIORE_CODE_MATCHER: RegExp;
    protected readonly CITY_CODE_MATCHER: RegExp;
    protected readonly COUNTRY_CODE_MATCHER: RegExp;
    abstract get provinces(): Promise<string[]>;
    abstract get cities(): IBelfioreConnector | undefined;
    abstract get countries(): IBelfioreConnector | undefined;
    abstract toArray(): Promise<BelfiorePlace[]>;
    abstract searchByName(name: string): Promise<BelfiorePlace[] | null>;
    abstract findByName(name: string): Promise<BelfiorePlace | null>;
    abstract findByCode(belfioreCode: string): Promise<BelfiorePlace | null>;
    abstract active(date: MultiFormatDate): IBelfioreConnector;
    abstract from(date: MultiFormatDate): IBelfioreConnector;
    abstract byProvince(code: string): IBelfioreConnector | undefined;
}

interface IBelfioreConnectorCommonConfig {
    fromDate?: Date;
    toDate?: Date;
}

interface IBelfioreConnectorBaseConfig extends IBelfioreConnectorCommonConfig {
    province?: undefined;
    codeMatcher?: undefined;
}

interface IBelfioreConnectorMatcherConfig extends IBelfioreConnectorCommonConfig {
    codeMatcher: RegExp;
    province: undefined;
}

interface IBelfioreConnectorProvinceConfig extends IBelfioreConnectorCommonConfig {
    codeMatcher: undefined;
    province: string;
}

export { BelfioreAbstractConnector, type BelfiorePlace, type IBelfioreCity, type IBelfioreCommonPlace, type IBelfioreConnector, type IBelfioreConnectorBaseConfig, type IBelfioreConnectorCommonConfig, type IBelfioreConnectorMatcherConfig, type IBelfioreConnectorProvinceConfig, type IBelfioreCountry, type IBelfiorePlace, type MultiFormatDate, BelfioreAbstractConnector as default };
