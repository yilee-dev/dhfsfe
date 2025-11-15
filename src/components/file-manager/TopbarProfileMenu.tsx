import useCustomLogin from "@/hooks/useCustomLogin";
import { Link, useNavigate } from "react-router";

export const TopbarProfileMenu = () => {
  const { isLogin, loginState, doLogout } = useCustomLogin();

  const nav = useNavigate();

  return (
    <div>
      <div className="drawer drawer-end">
        <input
          id="topbar-profile-drawer"
          type="checkbox"
          className="drawer-toggle"
        />
        <div className="drawer-content">
          <label
            htmlFor="topbar-profile-drawer"
            className="btn btn-ghost max-sm:btn-square gap-2 px-1.5"
          >
            {isLogin ? (
              <div className="btn btn-circle text-start max-sm:hidden">
                <span className="iconify lucide--user-star size-4 text-base-content"></span>
              </div>
            ) : (
              <div className="text-start max-sm:hidden">
                <div className="flex gap-4">
                  <Link
                    className="hover:bg-primary p-2 rounded"
                    to={"/sign-up"}
                  >
                    SignUp
                  </Link>
                  <Link
                    className="hover:bg-secondary p-2 rounded"
                    to={"/sign-in"}
                  >
                    SignIn
                  </Link>
                </div>
              </div>
            )}
          </label>
        </div>
        <div className="drawer-side">
          <label
            htmlFor="topbar-profile-drawer"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <div className="h-full w-72 p-2 sm:w-84">
            <div className="bg-base-100 rounded-box relative flex h-full flex-col pt-4 sm:pt-8">
              <label
                htmlFor="topbar-profile-drawer"
                className="btn btn-xs btn-circle btn-ghost absolute start-2 top-2"
                aria-label="Close"
              >
                <span className="iconify lucide--x size-4" />
              </label>

              <div className="flex flex-col items-center">
                <div className="relative">
                  <p className="mt-4 text-lg/none font-medium sm:mt-8">
                    {loginState.nickname}
                  </p>
                </div>
              </div>

              <div className="border-base-300 mt-4 grow overflow-auto border-t border-dashed px-2 sm:mt-6">
                <ul className="menu w-full p-2">
                  <li className="menu-title">Account</li>
                  <li>
                    <Link to="#">
                      <span className="iconify lucide--user size-4.5" />
                      <span>View Profile</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="#">
                      <span className="iconify lucide--settings size-4.5" />
                      <span>Settings</span>
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        doLogout();
                        nav("/", {
                          replace: true,
                        });
                      }}
                      className="text-error hover:bg-error/10"
                    >
                      <span className="iconify lucide--log-out size-4.5" />
                      <span>Sign Out</span>
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
