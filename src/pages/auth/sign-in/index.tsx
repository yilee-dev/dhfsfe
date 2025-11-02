import LoginComponent from "@/components/auth/loginComponent";

const SignInPage = () => {
  return (
    <div className="fixed top-0 left-0 z-[1055] flex flex-col h-full w- full">
      <div className="flex felx-wrap w-full h-full justify-center items-center border-2">
        <LoginComponent />
      </div>
    </div>
  );
};

export default SignInPage;
