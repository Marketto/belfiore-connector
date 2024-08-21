export default interface IBelfioreCommonPlace {
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
