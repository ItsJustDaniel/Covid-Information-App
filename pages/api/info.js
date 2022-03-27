import dbConnect from "../../lib/connection";
import CovidData from "../../models/Covid";

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();
  if (method === "GET") {
    const Doc = await CovidData.find();
    res.status(200).json({ success: true, data: Doc });
  }
}
