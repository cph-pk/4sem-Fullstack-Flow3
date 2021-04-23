/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client"
import ILyndaFriend from "../interfaces/interfaces"
import { ALL_FRIENDS } from "./AllFriends";

// interface IFriendResult {
//   getFriend: ILyndaFriend
// }

// interface IVariableInput {
//   id: string
// }

const DELETE_FRIEND = gql`
 mutation deleteFriend($id: ID!){
  deleteFriend(id: $id)
}
`

export default function DeleteFriend() {
  const [id, setId] = useState("")
  const [deleteFriend, { data }] = useMutation(
    DELETE_FRIEND,
    {
        update(cache, { data }) {
          const removedFriend = data.deleteFriend;
          const d: any = cache.readQuery({ query: ALL_FRIENDS })
          if (!d) {
            return
          }
          let allFriends = d.allFriends
          cache.writeQuery({
            query: ALL_FRIENDS,
            data: { allFriends: [...allFriends, removedFriend] }
          })
        }
      }
  );

  const removeFriend = () => {
    //alert(`Find friend with id: ${id}`)
    deleteFriend({ variables: { id } })
  }

  return (
    <div>
      ID: <input type="txt" value={id} onChange={e => {
        setId(e.target.value)
      }} />
      &nbsp; <button onClick={removeFriend}>Delete Friend</button>
      <br />
      <br />
      {data && <p>{data.deleteFriend}</p>}
      
    </div>)
}
