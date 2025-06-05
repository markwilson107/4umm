export type ErrorResponseIssues = {
    [x: string]: string[] | undefined;
    [x: number]: string[] | undefined;
    [x: symbol]: string[] | undefined;
};

export class ErrorResponse extends Error {
  issues: ErrorResponseIssues;
  success: boolean;

  constructor(message: string, issues?: ErrorResponseIssues) {
    super(message);
    this.name = "ErrorResponse";
    this.success = false;
    this.issues = issues || {};
  }
}
