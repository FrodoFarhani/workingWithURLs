import HttpException from "./HttpException";

class RecordsNotFoundException extends HttpException {
  constructor(resource: string) {
    super(404, `For path: ${resource}, No records were found`);
  }
}

export default RecordsNotFoundException;
