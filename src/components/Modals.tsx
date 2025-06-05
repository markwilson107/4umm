"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import RegisterForm from "./RegisterForm";
import LoginForm from "./LoginForm";
import { useSession } from "next-auth/react";
import ProfileForm from "./ProfileForm";
import UserProfile from "./UserProfile";

function Modals() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const session = useSession();
  const modalType = searchParams.get("modal");
  const username = searchParams.get("user");
  const [visibleModal, setVisibleModal] = useState<string | null>(null);

  useEffect(() => {
    if (session?.data?.user?.id) {
      if (modalType === "profile") {
        setVisibleModal("profile");
      } else {
        setVisibleModal(modalType);
      }
    } else {
      if (modalType === "profile") {
        setVisibleModal(null);
      } else {
        setVisibleModal(modalType);
      }
    }
  }, [modalType, session]);

  const closeModal = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("modal");
    params.delete("user");
    router.push(`?${params.toString()}`, {
      scroll: false,
    });
  };

  return (
    <div>
      {visibleModal && (
        <div className="fixed inset-0 flex justify-center items-center z-50 p-3">
          <div className="bg-white p-6 rounded-lg w-full max-w-[400px] z-10">
            {visibleModal === "login" && (
              <LoginForm closeCallback={closeModal} />
            )}
            {visibleModal === "register" && (
              <RegisterForm closeCallback={closeModal} />
            )}
            {visibleModal === "profile" && (
              <ProfileForm closeCallback={closeModal} />
            )}
            {visibleModal === "user" && (
              <UserProfile closeCallback={closeModal} username={username} />
            )}
          </div>
          <div
            className="absolute top-0 left-0 right-0 bottom-0 bg-black/35"
            onClick={closeModal}
          ></div>
        </div>
      )}
    </div>
  );
}

export default Modals;
