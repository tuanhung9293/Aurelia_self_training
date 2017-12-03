import {Authen} from './authen';
export class Tasklist {
  id: number;
  name: string;
  user: string;
  share_count: number;
  todo_count: number;
  done_count: number;
  access: string;
  authorizedUsers: Authen[];
  owner: boolean;
  is_write: boolean;
}
