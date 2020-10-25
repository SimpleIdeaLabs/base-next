import { GetServerSidePropsContext } from "next";

export default class CommonService {

  static extractErrors = (validationErrors: any[]) => {
    const response = {};
    if (!validationErrors || (validationErrors && validationErrors.length == 0)) return response;
    validationErrors.map((error: any) => {
      const key = error.property;
      const message = error.constraints[Object.keys(error.constraints)[0]];
      response[key] = message;
    });
    return response;
  };

  static isBrowser = (): boolean => {
    return typeof window !== 'undefined';
  }

  static redirectToLogin = (ctx: GetServerSidePropsContext) => {
    ctx.res.writeHead(307, {
      Location: '/login'
    });
    ctx.res.end();
    return {};
  }

}