import { IBelfioreConnector } from "../interfaces/belfiore-connector.interface";
import BelfiorePlace from "../types/belfiore-place.type";
import MultiFormatDate from "../types/multi-format-date.type";

export abstract class BelfioreAbstractConnector implements IBelfioreConnector {
	protected readonly ITALY_KINGDOM_BIRTHDATE = "1861-01-01";
	protected readonly BELFIORE_CODE_MATCHER: RegExp = /^[A-Z]\d{3}$/iu;

	protected readonly CITY_CODE_MATCHER: RegExp = /^[A-Y]\d{3}$/iu;
	protected readonly COUNTRY_CODE_MATCHER: RegExp = /^Z\d{3}$/iu;

	public abstract get provinces(): Promise<string[]>;
	public abstract get cities(): IBelfioreConnector | undefined;
	public abstract get countries(): IBelfioreConnector | undefined;

	public abstract toArray(): Promise<BelfiorePlace[]>;
	public abstract searchByName(name: string): Promise<BelfiorePlace[] | null>;
	public abstract findByName(name: string): Promise<BelfiorePlace | null>;
	public abstract findByCode(
		belfioreCode: string
	): Promise<BelfiorePlace | null>;
	public abstract active(date: MultiFormatDate): IBelfioreConnector;
	public abstract from(date: MultiFormatDate): IBelfioreConnector;
	public abstract byProvince(code: string): IBelfioreConnector | undefined;
}
