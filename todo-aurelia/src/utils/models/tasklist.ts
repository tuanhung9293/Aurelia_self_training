import {Authen} from './authen';
export class Tasklist {
  id: number;
  name: string;
  user: string;
  share: number;
  count: number;
  done: number;
  access: string;
  authorizedUsers: Authen[];
  owner: boolean;
  is_write: boolean;
}
