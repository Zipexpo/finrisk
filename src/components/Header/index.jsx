import Logo from "../icons/Logo";

export default function Header() {
  return (
    <div className="container sticky bg-primary-foreground top-0 mx-auto flex justify-between align-middle h-14 max-w-screen-lg items-center py-3 px-5 drop-shadow-xl rounded-b-lg border-2">
      <div className="mr-4 flex items-center space-x-2 lg:mr-6">
        <Logo className="h-10 w-10" />
        <h3>Finrisk</h3>
      </div>
      {/* <div className="self-end">
        About us
      </div> */}
    </div>
  );
}
