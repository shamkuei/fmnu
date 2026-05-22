export class BaseException extends Error {
	constructor(
		public readonly message: string,
		public readonly code: number = 500,
		public readonly metaList: unknown[] = [],
	) {
		super(message);
		this.name = this.constructor.name;
	}

	addMeta(data: unknown) {
		this.metaList.push(data);
		return this;
	}

	toResponse() {
		return {
			isError: true,
			code: this.code,
			message: this.message,
			meta: this.metaList,
		};
	}
}

export class BadRequestException extends BaseException {
	constructor(message: string = "Bad Request") {
		super(message, 400);
	}
}

export class UnauthorizedException extends BaseException {
	constructor(message: string = "Unauthorized") {
		super(message, 401);
	}
}

export class NotFoundException extends BaseException {
	constructor(message: string = "Not Found") {
		super(message, 404);
	}
}

export class ForbiddenException extends BaseException {
	constructor(message: string = "Forbidden") {
		super(message, 403);
	}
}

export class ConflictException extends BaseException {
	constructor(message: string = "Conflict") {
		super(message, 409);
	}
}
