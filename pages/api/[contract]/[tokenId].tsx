import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { getMetadata } from "../services";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { contract, tokenId } = req.query;
  try {
    res
      .status(200)
      .json(await getMetadata(contract as string, tokenId as string));
  } catch (e: any) {
    res.status(500).json({
      error: e,
    });
  }
}
