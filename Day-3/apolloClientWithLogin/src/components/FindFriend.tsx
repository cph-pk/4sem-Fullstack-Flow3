/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useState } from "react";
import { useLazyQuery, gql } from "@apollo/client"
import { IFriend } from "../interfaces/IFriend";

interface IFriendResult {
  getFriendById: IFriend
}

interface IVariableInput {
  id: string
}

const GET_FRIEND = gql`
  query getFriendById($id: ID){
  getFriendById(input: $id)
  {
    id
    firstName
    lastName
    email
    role
  }
}
`

export default function FindFriend() {
  const [id, setId] = useState("")
  const [getFriendById, { loading, called, error, data }] = useLazyQuery<IFriendResult, IVariableInput>(
    GET_FRIEND,
    { fetchPolicy: "cache-and-network" }
  );

  const fetchFriend = () => {
    //alert(`Find friend with id: ${id}`)
    getFriendById({ variables: { id } })
  }

  if (error) {
    console.log("---->", error)
    console.log("--2->", error.graphQLErrors)
    console.log("--3->", error.graphQLErrors[0])
    console.log("--4->", error.networkError)
    console.log("--5->", error.message)
    console.log("--6->", error.name)
    console.log("--7->", error.extraInfo)

    console.log("-##->", JSON.stringify(error.toString()))
  }
  if (error) return <p>{error.toString()}</p>;

  return (
    <div>
      ID:<input type="txt" value={id} onChange={e => { setId(e.target.value) }} />
      &nbsp; <button onClick={fetchFriend}>Find Friend</button>
      <br />
      <br />
      <h2>Fetch a friend using the provided id</h2>
      
      {/* {data && <p>{JSON.stringify({ data })}</p>} */}
      
      {called && loading && <p>loading...</p>}
      {data && (<dl className="row">
        <dt className="col-sm-12"><h4>Friend found</h4></dt>
        <dt className="col-sm-2">ID</dt>
        <dd className="col-sm-10">{data.getFriendById.id}</dd>
        <dt className="col-sm-2">Firstname</dt>
        <dd className="col-sm-10">{data.getFriendById.firstName}</dd>
        <dt className="col-sm-2">Lastname</dt>
        <dd className="col-sm-10">{data.getFriendById.lastName}</dd>
        <dt className="col-sm-2">Email</dt>
        <dd className="col-sm-10">{data.getFriendById.email}</dd>
      </dl>

      )}
    </div>)
}