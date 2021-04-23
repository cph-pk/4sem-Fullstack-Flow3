export interface IFriend {
  id?: string
  firstName: string
  lastName: string
  email: string
  password: string
  role?: string
}

export interface IUpdateFriend {
  firstName: string
  lastName: string
  email: string
}
