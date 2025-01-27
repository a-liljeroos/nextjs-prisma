"use client";
import Link from "next/link";
//types
import { TUserRoles, UserRoles } from "@types";
// functions
import { updateUserRole } from "@adminFunctions";
// components
import toast from "react-hot-toast";
import PageContainer from "@components/pageContainer/pageContainer";

interface UsersProps {
  users: {
    id: number;
    role: TUserRoles;
    name: string;
  }[];
}

const Users = ({ users }: UsersProps) => {
  return (
    <PageContainer backButton={true}>
      <div className="p-2 pt-8">
        <h1 className="text-bold">USERS</h1>
        <section className="my-4">
          <div className="overflow-x-auto">
            <UsersTable users={users} />
          </div>
        </section>
      </div>
    </PageContainer>
  );
};

export default Users;

const UsersTable = ({ users }: UsersProps) => {
  return (
    <table className="table-auto text-left w-full ">
      <thead>
        <tr>
          <th className="px-4 py-2">Id</th>
          <th className="px-4 py-2">Name</th>
          <th className="px-4 py-2">Role</th>
        </tr>
      </thead>
      <tbody>
        {users.length > 0 &&
          users.map((user) => (
            <tr key={user.id}>
              <td className="border px-4 py-2">{user.id}</td>
              <td className="border px-4 py-2">
                <Link href={`/admin/users/${user.id}`}>{user.name}</Link>
              </td>
              <td className="border">
                <ChangeRole role={user.role} id={user.id} />
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  );
};

const ChangeRole = ({ role, id }: { role: TUserRoles; id: number }) => {
  return (
    <form>
      <select
        className="bg-transparent w-full"
        defaultValue={role}
        onChange={(e) => {
          const newRole = e.target.value as TUserRoles;
          updateUserRole(id, newRole)
            .then((user) => {
              if (user) {
                toast.success(`Role changed to ${user.role}`);
              } else {
                toast.error("Failed to change role");
              }
            })
            .catch((error) => {
              console.error(error);
              toast.error("Failed to change role");
            });
        }}
      >
        {Object.values(UserRoles).map((role) => (
          <option
            className="bg-black text-backgroundSecondary"
            key={role}
            value={role}
          >
            {role}
          </option>
        ))}
      </select>
    </form>
  );
};
