/** Represents an existing value of Type T*/
export type Some<T> = [T];

/** Represents a missing value of Type T*/
export type None = [];

export class Option<T> {
	value: NonNullable<Some<T> | None>;

	constructor(value?: T) {
		this.value = value === undefined || value === null ? ([] as None) : ([value] as Some<T>);
	}

	isSome(): boolean {
		return this.value.length === 1;
	}
	isNone(): boolean {
		return !this.isSome();
	}
	isSomeAnd(predicate: (value: T) => boolean): boolean {
		return this.isSome() ? predicate(this.value[0] as T) : false;
	}
	expect(msg: string): T {
		if (this.isNone()) throw new Error(msg);
		return this.value[0] as T;
	}
	unwrap(): T {
		if (this.isNone()) throw new Error();
		return this.value[0] as T;
	}
	unwrapOr(defaultValue: T): T {
		return this.isNone() ? defaultValue : (this.value[0] as T);
	}
	unwrapOrElse(f: () => T): T {
		return this.isNone() ? f() : (this.value[0] as T);
	}
	map<U>(f: (value: T) => U): Option<U> {
		return this.isNone() ? new Option<U>() : new Option<U>(f(this.value[0] as T));
	}
	mapOr<U>(defaultValue: U, f: (value: T) => U): U {
		return this.isNone() ? defaultValue : f(this.value[0] as T);
	}
	mapOrElse<U>(defaultValue: () => U, f: (value: T) => U): U {
		return this.isNone() ? defaultValue() : f(this.value[0] as T);
	}
	and<U>(optb: Option<U>): Option<U> {
		return this.isNone() ? new Option<U>() : optb;
	}
	and_then<U>(f: (value: T) => Option<U>): Option<U> {
		return this.isNone() ? new Option<U>() : f(this.value[0] as T);
	}
	filter(predicate: (value: T) => boolean): Option<T> {
		if (this.isSome()) {
			if (predicate(this.value[0] as T)) {
				return new Option<T>(this.value[0]);
			}
		}
		return new Option<T>();
	}
	or(optb: Option<T>): Option<T> {
		return this.isNone() ? optb : new Option<T>(this.value[0]);
	}
	orElse(f: () => Option<T>): Option<T> {
		return this.isNone() ? f() : new Option<T>(this.value[0]);
	}
	xor(optb: Option<T>): Option<T> {
		if (this.isSome() && optb.isNone()) return this;
		if (this.isNone() && optb.isSome()) return optb;
		return new Option<T>();
	}
	zip<U>(other: Option<U>): Option<[T, U]> {
		if (this.isSome() && other.isSome())
			return new Option<[T, U]>([this.value[0] as T, other.unwrap()]);
		return new Option<[T, U]>();
	}
	zip_with<U, R>(other: Option<U>, f: (valueA: T, valueB: U) => R): Option<R> {
		if (this.isSome() && other.isSome())
			return new Option<R>(f(this.value[0] as T, other.unwrap()));
		return new Option<R>();
	}
}
