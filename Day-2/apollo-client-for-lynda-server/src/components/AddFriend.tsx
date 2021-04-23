import React, { useState } from "react";
import ILyndaFriend from "../interfaces/interfaces";
import { useMutation, gql } from "@apollo/client";
import { ALL_FRIENDS } from "./AllFriends";

const ADD_FRIEND = gql`
mutation createFriend($friend: FriendInput){
  createFriend(input: $friend)
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
type AddFriendProps = {
  initialFriend?: ILyndaFriend
}

interface IKeyableFriend extends ILyndaFriend {
  [key: string]: any
}
const AddFriend = ({ initialFriend }: AddFriendProps) => {
  const EMPTY_FRIEND: ILyndaFriend = { firstName: "", lastName: "", gender: "OTHER", age: -1, email: "" }
  let newFriend = initialFriend ? initialFriend : { ...EMPTY_FRIEND }

  const [friend, setFriend] = useState({ ...newFriend })

  const [addFriend, { data }] = useMutation(
    ADD_FRIEND,
    {
      update(cache, { data }) {
        const addedFriend = data.createFriend;
        const d: any = cache.readQuery({ query: ALL_FRIENDS })
        if (!d) {
          return
        }
        let allFriends = d.allFriends
        cache.writeQuery({
          query: ALL_FRIENDS,
          data: { allFriends: [...allFriends, addedFriend] }
        })
      }
    }
  )

  const handleChange = (event: any) => {
    const id = event.currentTarget.id;
    let friendToChange: IKeyableFriend = { ...friend }
    if (id === "age") {
      friendToChange[id] = Number(event.currentTarget.value);
    } else {
      friendToChange[id] = event.currentTarget.value;
    }
    setFriend({ ...friendToChange })
  }
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    //alert(JSON.stringify(friend))
    addFriend({
      variables: { friend: { ...friend } }
    })
    setFriend({ ...EMPTY_FRIEND })
  }


  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          FirstName<br />
          <input type="text" id="firstName" value={friend.firstName} onChange={handleChange} />
        </label>
        <br />
        <label>
          LastName <br />
          <input type="text" id="lastName" value={friend.lastName} onChange={handleChange} />
        </label>
        <br />
        <label>
          Gender &nbsp;
          <select id="gender" value={friend.gender} onChange={handleChange}>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
            <option value="OTHER">Other</option>
          </select>
        </label>
        <br />
        <label>
          Age <br />
          <input type="number" id="age" value={friend.age} onChange={handleChange} />
        </label>
        <br />
        <label>
          Email <br />
          <input type="email" id="email" value={friend.email} onChange={handleChange} />
        </label>
        <br /><br />
        <input type="submit" value="Save friend" />
      </form>
      <div>
        {/* {JSON.stringify({friend})}
  {data && <p>{JSON.stringify({data})}</p>} */}
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
            <dt className="col-sm-2">Gender</dt>
            <dd className="col-sm-10">{data.createFriend.gender}</dd>
            <dt className="col-sm-2">Email</dt>
            <dd className="col-sm-10">{data.createFriend.email}</dd>
            <dt className="col-sm-2">Age</dt>
            <dd className="col-sm-10">{data.createFriend.age}</dd>
          </dl>

        )}
      </div>
    </div>
  );
}

export default AddFriend;