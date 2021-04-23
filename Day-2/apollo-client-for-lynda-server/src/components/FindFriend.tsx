/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useState } from "react";
import { useLazyQuery, gql } from "@apollo/client"
import ILyndaFriend from "../interfaces/interfaces"

interface IFriendResult {
  getFriend: ILyndaFriend
}

interface IVariableInput {
  id: string
}

const GET_FRIEND = gql`
 query getFriend($id: ID){
  getFriend(id: $id)
  {
    id
    firstName
    lastName
    gender
    email
    age
  }
}
`

export default function FindFriend() {
  const [id, setId] = useState("")
  const [getFriend, { loading, called, data }] = useLazyQuery<IFriendResult, IVariableInput>(
    GET_FRIEND,
    { fetchPolicy: "cache-and-network" }
  );

  const fetchFriend = () => {
    //alert(`Find friend with id: ${id}`)
    getFriend({ variables: { id } })
  }

  return (
    <div>
      ID: <input type="txt" value={id} onChange={e => {
        setId(e.target.value)
      }} />
      &nbsp; <button onClick={fetchFriend}>Find Friend</button>
      <br />
      <br />

      {called && loading && <p>loading...</p>}
      {data && (<dl className="row">
        <dt className="col-sm-12"><h4>Friend found</h4></dt>
        <dt className="col-sm-2">ID</dt>
        <dd className="col-sm-10">{data.getFriend.id}</dd>
        <dt className="col-sm-2">Firstname</dt>
        <dd className="col-sm-10">{data.getFriend.firstName}</dd>
        <dt className="col-sm-2">Lastname</dt>
        <dd className="col-sm-10">{data.getFriend.lastName}</dd>
        <dt className="col-sm-2">Gender</dt>
        <dd className="col-sm-10">{data.getFriend.gender}</dd>
        <dt className="col-sm-2">Email</dt>
        <dd className="col-sm-10">{data.getFriend.email}</dd>
        <dt className="col-sm-2">Age</dt>
        <dd className="col-sm-10">{data.getFriend.age}</dd>
      </dl>

      )}

    </div>)
}
