import type { NextApiRequest, NextApiResponse } from "next";
import { HttpError } from "../../../utils/HttpError";
import { connect } from "../../../utils/db";
import { editPost } from "../../../services/posts";

type ResType = {
  status: string;
  data: any;
};

type BodyType = {
  isBlocked: boolean;
  postId: number;
};

connect();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResType>
) {
  try {
    if (!req.method || req.method! !== "POST") {
      res.status(405);
      return;
    }

    const body = req.body as BodyType;
    const { isBlocked, postId } = body;

    if (isBlocked === undefined || !postId) {
      throw new HttpError(400, "invalid body structure");
    }

    await editPost(postId, isBlocked);
    res.status(200).json({ status: "ok", data: { postId, isBlocked } });
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
