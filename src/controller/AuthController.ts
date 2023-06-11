import express from 'express';
import bcrypt from 'bcrypt';
import { UserModel } from '../model/user';
import { BlackListModel } from '../model/blacklist';

export const register = async (req: express.Request, res: express.Response) => {

    const { first_name, last_name, email } = req.body;

    try {

        const newUser = new UserModel({
            first_name,
            last_name,
            email,
            password: req.body.password,
        });

        const existingUser = await UserModel.findOne({ email });
        if (existingUser)
            return res.status(400).json({
                status: 'failed',
                data: [],
                message: 'It seems you already have an account, please log in instead.',
            });

        const savedUser = await newUser.save();
        const { password, ...user_data }: any = savedUser;

        res.status(200).json({
            status: 'success',
            data: [user_data?._doc || []],
            message:
                'Thank you for registering with us. Your account has been successfully created.',
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            code: 500,
            data: [],
            message: 'Internal Server Error',
        });
    }
    res.end();
}

export const login = async (req: express.Request, res: express.Response) => {

    const { email } = req.body;
  try {
    // Check if user exists
    const user: any = await UserModel.findOne({ email }).select('+password');
    if (!user)
      return res.status(401).json({
        status: 'failed',
        data: [],
        message: 'Account does not exist',
      });

    const isPasswordValid = bcrypt.compare(
      `${req.body.password}`,
      user.password,
    );

    if (!isPasswordValid)
      return res.status(401).json({
        status: 'failed',
        data: [],
        message: 'Invalid email or password. Please try again with the correct credentials.',
      });

    let options: any = {
      maxAge: 20 * 60 * 1000, // 20minutes
      httpOnly: true,
      secure: false,
      sameSite: 'None',
    };
    const token = user.generateAccessJWT();
    res.cookie('SessionID', token, options);
    
    res.status(200).json({
      status: 'success',
      message: 'You have successfully logged in.',
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      code: 500,
      data: [],
      message: 'Internal Server Error',
    });
  }
  res.end();
}

export const logout = async (req: express.Request, res: express.Response) => {
    try {
        const authHeader = req.headers['cookie'];
        if (!authHeader) return res.sendStatus(204);
        const cookie = authHeader.split('=')[1];
        const accessToken = cookie.split(';')[0];

        const checkIfBlacklisted = await BlackListModel.findOne({ token: accessToken });
        
        if (checkIfBlacklisted) return res.sendStatus(204);
        const newBlacklist = new BlackListModel({
          token: accessToken,
        });

        await newBlacklist.save();

        res.setHeader('Clear-Site-Data', '"cookies", "storage"');
        res.status(200).json({ message: 'You are logged out!' });

      } catch (err) {
        res.status(500).json({
          status: 'error',
          message: 'Internal Server Error',
        });
      }
      res.end();
}