import {Types} from 'mongoose';

type MessageResponse = {
  message: string;
};

type ErrorResponse = MessageResponse & {
  stack?: string;
};

type PostMessage = MessageResponse & {
  _id: Types.ObjectId;
};

export {MessageResponse, ErrorResponse, PostMessage};
