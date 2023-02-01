import type { NextApiRequest, NextApiResponse } from "next";
import { HttpError } from "../../../utils/HttpError";
import { connect } from "../../../utils/db";
import { findEmail } from "../../../services/users";

type ResType = {
  status: string;
  data: any;
};

type QueryType = {
  authorId: number | undefined;
};

connect();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResType>
) {
  try {
    if (!req.method || req.method! !== "GET") {
      res.status(405);
      return;
    }

    let { authorId } = req.query as QueryType;
    if (!authorId) {
      throw new HttpError(400, "no authorId");
    }

    const email = await findEmail(authorId);
    res.status(200).json({ status: "ok", data: { email } });
  } catch (err) {
    if (err instanceof HttpError) {
      const httpErr = err as HttpError;
      res
        .status(httpErr.httpCode)
        .json({ status: "error", data: { message: httpErr.message } });
      return;
    } else {
      const error = err as Error;
      res
        .status(500)
        .json({ status: "error", data: { message: error.message } });
      return;
    }
  }
}
