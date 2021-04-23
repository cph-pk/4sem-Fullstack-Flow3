/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useState } from "react";
import { IFriend } from "../interfaces/IFriend"
import { gql, useMutation, ApolloClient } from "@apollo/client"

const ADD_FRIEND = gql`
mutation 
createFriend($friend : FriendInput){
  createFriend(input:$friend){
    firstName
    lastName
    email
    role
    id
  }
}`

const ALL_FRIENDS = gql`
{
  getAllFriends{
    id
    firstName
    lastName
    email
    role
  }
}
`

type AddFriendProps = {
  initialFriend?: IFriend,
  allowEdit: true
}

interface IKeyableFriend extends IFriend {
  [key: string]: any
}

interface FriendData {
  getAllFriends: IFriend[]
}

const AddFriend = ({ initialFriend, allowEdit }: AddFriendProps) => {
  const EMPTY_FRIEND: IFriend = { firstName: "", lastName: "", password: "", email: "" }
  let newFriend = initialFriend ? initialFriend : { ...EMPTY_FRIEND }

  const [addFriend, { data }] = useMutation(
    ADD_FRIEND,
    {
      update(cache, { data }) {
        const addedFriend = data.createFriend;
        const d: any = cache.readQuery({ query: ALL_FRIENDS })
        let allFriends = d.getAllFriends || []
        cache.writeQuery({ query: ALL_FRIENDS, data: { getAllFriends: [...allFriends, addedFriend] } })
      }
    })

  const [friend, setFriend] = useState({ ...newFriend })
  const [readOnly, setReadOnly] = useState(!allowEdit)

  const handleChange = (event: React.FormEvent<HTMLInputElement>) => {
    const id = event.currentTarget.id;
    var friendToChange: IKeyableFriend = { ...friend };
    friendToChange[id] = event.currentTarget.value;
    setFriend({ ...friendToChange })
  }
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    addFriend({
      variables: {
        friend: { ...friend }
      }
    })
    setFriend({ ...EMPTY_FRIEND })
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          FirstName<br />
          <input type="text" readOnly={readOnly} id="firstName" value={friend.firstName} onChange={handleChange} />
        </label>
        <br />
        <label>
          LastName <br />
          <input readOnly={readOnly} type="text" id="lastName" value={friend.lastName} onChange={handleChange} />
        </label>
        <br />
        <label>
          Email <br />
          <input readOnly={readOnly} type="email" id="email" value={friend.email} onChange={handleChange} />
        </label>
        <br />
        <label>
          Password <br />
          <input readOnly={readOnly} type="password" id="password" value={friend.password} onChange={handleChange} />
        </label>
        <br /><br />
        {!readOnly && <input type="submit" value="Submit" />}
      </form>

      <br />
      <br />
      {data && (

        <dl className="row">
          <dt className="col-sm-12"><h4>New friend added</h4></dt>
          <dt className="col-sm-2">ID</dt>
          <dd className="col-sm-10">{data.createFriend.id}</dd>
          <dt className="col-sm-2">Firstname</dt>
          <dd className="col-sm-10">{data.createFriend.firstName}</dd>
          <dt className="col-sm-2">Lastname</dt>
          <dd className="col-sm-10">{data.createFriend.lastName}</dd>
          <dt className="col-sm-2">Email</dt>
          <dd className="col-sm-10">{data.createFriend.email}</dd>
        </dl>

      )}
    </div>
  );
}

export default AddFriend;