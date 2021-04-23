import React, { useState } from "react";
import { IUpdateFriend } from "../interfaces/IFriend"
import { useMutation, gql } from "@apollo/client";
import { ALL_FRIENDS } from "./AllFriends";

const UPDATE_FRIEND = gql`
mutation updateFriend($friend: FriendEditInput){
  updateFriend(input: $friend)
  {
    firstName
    lastName
    email
  }
}
`
type UpdateFriendProps = {
  initialFriend?: IUpdateFriend
}

interface IKeyableFriend extends IUpdateFriend {
  [key: string]: any
}

const UpdateFriend = ({ initialFriend }: UpdateFriendProps) => {
  const EMPTY_FRIEND: IUpdateFriend = { firstName: "", lastName: "",  email: "" }
  let newFriend = initialFriend ? initialFriend : { ...EMPTY_FRIEND }

  const [friend, setFriend] = useState({ ...newFriend })

  const [updateFriend, { data }] = useMutation(
    UPDATE_FRIEND,
    {
      update(cache, { data }) {
        const updatedFriend = data.updateFriend;
        const d: any = cache.readQuery({ query: ALL_FRIENDS })
        if (!d) {
          return
        }
        let getAllFriends = d.getAllFriends
        cache.writeQuery({
          query: ALL_FRIENDS,
          data: { getAllFriends: [...getAllFriends, updatedFriend] }
        })
      }
    }
  )

  const handleChange = (event: any) => {
    const id = event.currentTarget.id;
    let friendToChange: IKeyableFriend = { ...friend }
    friendToChange[id] = event.currentTarget.value;
    setFriend({ ...friendToChange })
  }
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    //alert(JSON.stringify(friend))
    updateFriend({
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
          Email <br />
          <input type="email" id="email" value={friend.email} onChange={handleChange} />
        </label>
        <br /><br />
        <input type="submit" value="Update friend" />
      </form>
      <div>
        <br />
        <br />
        {data && (
          
          <dl className="row">
            <dt className="col-sm-12"><h4>Friend updated</h4></dt>
            <dt className="col-sm-2">ID</dt>
            <dd className="col-sm-10">{data.updateFriend.id}</dd>
            <dt className="col-sm-2">Firstname</dt>
            <dd className="col-sm-10">{data.updateFriend.firstName}</dd>
            <dt className="col-sm-2">Lastname</dt>
            <dd className="col-sm-10">{data.updateFriend.lastName}</dd>
           
            <dt className="col-sm-2">Email</dt>
            <dd className="col-sm-10">{data.updateFriend.email}</dd>
           
          </dl>

        )}
      </div>
    </div>
  );
}

export default UpdateFriend;