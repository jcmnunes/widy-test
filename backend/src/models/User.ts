import { model, Schema, Model, Document, Types } from 'mongoose';
import { Response } from 'express';
import mongodbErrorHandler from 'mongoose-mongodb-errors';
import jwt from 'jsonwebtoken';
import { scopeSchema, Scope } from './Scope';
import { taskSchema, Task } from './Task';

const userSchema = new Schema(
  {
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      required: true,
      minlength: 5,
      maxlength: 255,
    },
    firstName: {
      type: String,
      trim: true,
      minlength: 1,
      maxlength: 255,
      required: true,
    },
    lastName: {
      type: String,
      trim: true,
      minlength: 1,
      maxlength: 255,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 1024,
      private: true,
    },
    resetPasswordToken: {
      type: String,
      private: true,
    },
    resetPasswordExpires: {
      type: Date,
      private: true,
    },
    settings: {
      pomodoro: {
        pomodoroLength: {
          type: Number,
          default: 25,
        },
        shortBreak: {
          type: Number,
          default: 5,
        },
        longBreak: {
          type: Number,
          default: 15,
        },
        longBreakAfter: {
          type: Number,
          default: 4,
        },
      },
    },
    scopes: [scopeSchema],
    archivedScopes: [scopeSchema],
    schedule: [taskSchema],
  },
  /* gives us "createdAt" and "updatedAt" fields automatically */
  { timestamps: true },
);

// The MongoDBErrorHandler plugin gives us a better 'unique' error
userSchema.plugin(mongodbErrorHandler);

// eslint-disable-next-line @typescript-eslint/no-inferrable-types
userSchema.methods.generateAuthToken = function(res: Response, days: number = 60): void {
  const { COOKIE_KEY, APP_SECRET, NODE_ENV } = process.env;

  if (COOKIE_KEY && APP_SECRET) {
    const token = jwt.sign({ id: this._id }, APP_SECRET, { expiresIn: `${days}d` });
    res.cookie(COOKIE_KEY, token, {
      secure: NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * days,
    });
  }
};

interface User extends Document {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  resetPasswordToken: string | null;
  resetPasswordExpires: number | null;
  settings: {
    pomodoro: {
      pomodoroLength: number;
      shortBreak: number;
      longBreak: number;
      longBreakAfter: number;
    };
  };
  scopes: Types.DocumentArray<Scope>;
  archivedScopes: Types.DocumentArray<Scope>;
  schedule: Types.DocumentArray<Task>;
  generateAuthToken(res: Response, days?: number): void;
}

export const UserModel: Model<User> = model<User>('User', userSchema);
