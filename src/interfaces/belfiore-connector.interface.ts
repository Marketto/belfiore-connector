import BelfiorePlace from "../types/belfiore-place.type";
import MultiFormatDate from "../types/multi-format-date.type";

export interface IBelfioreConnector {
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
