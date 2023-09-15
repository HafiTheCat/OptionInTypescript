/// Represents an existing value of Type T
export type Some<T> = [T];

/// Represents a missing value of Type T
export type None = [];

export class Option<T> {
	value: NonNullable<Some<T> | None>;

	constructor(value?: T) {
		this.value = value === undefined || value === null ? ([] as None) : ([value] as Some<T>);
	}

	/// Returns `true` if the option is a [`Some`] value.
	isSome(): boolean {
		return this.value.length === 1;
	}
	/// Returns `true` if the option is a [`None`] value.
	isNone(): boolean {
		return !this.isSome();
	}
	/// Returns `true` if the option is a [`Some`] and the value inside of it matches a predicate.
	isSomeAnd(predicate: (value: T) => boolean): boolean {
		return this.isSome() ? predicate(this.value[0] as T) : false;
	}
	/// Returns the contained [`Some`] value, consuming the `self` value.
	expect(msg: string): T {
		if (this.isNone()) throw new Error(msg);
		return this.value[0] as T;
	}
	/// Returns the contained [`Some`] value, consuming the `self` value.
	unwrap(): T {
		if (this.isNone()) throw new Error();
		return this.value[0] as T;
	}
	/// Returns the contained [`Some`] value or a provided default.
	unwrapOr(defaultValue: T): T {
		return this.isNone() ? defaultValue : (this.value[0] as T);
	}
	/// Returns the contained [`Some`] value or computes it from a closure.
	unwrapOrElse(f: () => T): T {
		return this.isNone() ? f() : (this.value[0] as T);
	}
	/// Maps an `Option<T>` to `Option<U>` by applying a function to a contained value (if `Some`) or returns `None` (if `None`).
	map<U>(f: (value: T) => U): Option<U> {
		return this.isNone() ? new Option<U>() : new Option<U>(f(this.value[0] as T));
	}
	/// Returns the provided default result (if none),
	mapOr<U>(defaultValue: U, f: (value: T) => U): U {
		return this.isNone() ? defaultValue : f(this.value[0] as T);
	}
	/// Computes a default function result (if none), or
	mapOrElse<U>(defaultValue: () => U, f: (value: T) => U): U {
		return this.isNone() ? defaultValue() : f(this.value[0] as T);
	}
	/// Returns [`None`] if the option is [`None`], otherwise returns `optb`.
	and<U>(optb: Option<U>): Option<U> {
		return this.isNone() ? new Option<U>() : optb;
	}
	/// Returns [`None`] if the option is [`None`], otherwise calls `f` with the
	and_then<U>(f: (value: T) => Option<U>): Option<U> {
		return this.isNone() ? new Option<U>() : f(this.value[0] as T);
	}
	/// Returns [`None`] if the option is [`None`], otherwise calls `predicate`
	filter(predicate: (value: T) => boolean): Option<T> {
		if (this.isSome()) {
			if (predicate(this.value[0] as T)) {
				return new Option<T>(this.value[0]);
			}
		}
		return new Option<T>();
	}
	/// Returns the option if it contains a value, otherwise returns `optb`.
	or(optb: Option<T>): Option<T> {
		return this.isNone() ? optb : new Option<T>(this.value[0]);
	}
	/// Returns the option if it contains a value, otherwise calls `f` and
	orElse(f: () => Option<T>): Option<T> {
		return this.isNone() ? f() : new Option<T>(this.value[0]);
	}
	/// Returns [`Some`] if exactly one of `self`, `optb` is [`Some`], otherwise returns [`None`].
	xor(optb: Option<T>): Option<T> {
		if (this.isSome() && optb.isNone()) return this;
		if (this.isNone() && optb.isSome()) return optb;
		return new Option<T>();
	}
	/// Zips `self` with another `Option`.
	zip<U>(other: Option<U>): Option<[T, U]> {
		if (this.isSome() && other.isSome())
			return new Option<[T, U]>([this.value[0] as T, other.unwrap()]);
		return new Option<[T, U]>();
	}
	/// Zips `self` and another `Option` with function `f`.
	zip_with<U, R>(other: Option<U>, f: (valueA: T, valueB: U) => R): Option<R> {
		if (this.isSome() && other.isSome())
			return new Option<R>(f(this.value[0] as T, other.unwrap()));
		return new Option<R>();
	}
}
