import { GetServerSidePropsContext } from "next";

export interface IGetRoleList {
  page?: number;
  rowsPerPage?: number;
  ctx?: GetServerSidePropsContext;
}