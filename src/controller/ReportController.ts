import express from 'express';
import { ReportModel } from '../model/reports'
import { UserModel } from '../model/user';

interface AuthenticatedRequest extends express.Request {
  user?: {
    id: string;
  };
}

export const list = async (req: express.Request, res: express.Response) => {

  try {
    const result = await ReportModel.find();
    res.status(201).json(result);

  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }

}

export const show = async (req: express.Request, res: express.Response) => {

  const { id } = req.params;

  try {

    const result = await ReportModel.findOne({ _id: id });
    res.status(201).json(result);

  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
}

export const create = async (req: AuthenticatedRequest, res: express.Response) => {

  const { name, description } = req.body;

  try {

    const user: any = await UserModel.findById(req?.user?.id);

    if (!user) {
      throw new Error('User not found');
    }

    const newReport = new ReportModel({
      name,
      description,
      user: user._id,
    });

    const report = await newReport.save();
    res.status(201).json(report);

  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
}

export const edit = async (req: AuthenticatedRequest, res: express.Response) => {

  const { id } = req.params;
  const { name, description } = req.body;

  try {
    const user: any = await UserModel.findById(req?.user?.id);

    if (!user) {
      throw new Error('User not found');
    }
    const result = await ReportModel.findByIdAndUpdate({ _id: id }, { name, description, user: user._id, });
    res.status(201).json(result);

  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
}

export const destroy = async (req: express.Request, res: express.Response) => {

  const { id } = req.params;

  try {

    const result = await ReportModel.findOneAndDelete({ _id: id });
    res.status(201).json(result);

  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
}