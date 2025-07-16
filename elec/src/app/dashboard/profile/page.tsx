"use client";
import { useSession } from "next-auth/react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Image from "next/image";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Link from "next/link";


const Profile = () => {
  const { data: session } = useSession();

  return (
    <DefaultLayout>
      <div className="mx-auto max-w-md">
        <Breadcrumb pageName="Profile" />

        <div className="overflow-hidden rounded border bg-white shadow">
          <div className="relative z-20 h-64">
            <Image
              src="/images/cover/cover-01.png"
              alt="Cover"
              className="h-full w-full object-cover"
              width={970}
              height={260}
            />
            <div className="absolute bottom-4 right-4 z-10">
              <label
                htmlFor="cover"
                className="flex cursor-pointer items-center justify-center gap-2 rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
              >
                <input type="file" name="cover" id="cover" className="sr-only" />
                <span>Edit Cover</span>
              </label>
            </div>
          </div>

          <div className="px-4 pb-6 text-center">
            <div className="relative z-30 mx-auto -mt-20 h-40 w-40 rounded-full bg-white p-2">
              <Image
                src={session?.user?.image || "/images/user/user-01.png"}
                width={160}
                height={160}
                alt="Profile"
              />
              <label
                htmlFor="profile"
                className="absolute bottom-0 right-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-500"
              >
                <input type="file" name="profile" id="profile" className="sr-only" />
              </label>
            </div>

            <div className="mt-4">
              <h3 className="mb-1.5 text-2xl font-semibold">{session?.user?.name || "User Name"}</h3>
              <p className="font-medium">{session?.user?.role || "User Role"}</p>

              <div className="mx-auto mb-5 mt-4 grid max-w-md grid-cols-3 border py-2 shadow">
                <div className="flex flex-col items-center border-r px-4">
                  <span className="font-semibold">259</span>
                  <span className="text-sm">Posts</span>
                </div>
                <div className="flex flex-col items-center border-r px-4">
                  <span className="font-semibold">129K</span>
                  <span className="text-sm">Followers</span>
                </div>
                <div className="flex flex-col items-center px-4">
                  <span className="font-semibold">2K</span>
                  <span className="text-sm">Following</span>
                </div>
              </div>

              <div className="max-w-md">
                <h4 className="font-semibold">About Me</h4>
                <p className="mt-4">A software engineer.</p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Profile;
