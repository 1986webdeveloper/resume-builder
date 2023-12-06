import { useSelector } from "react-redux";
// import { login, logout } from "../store/slices/authSlice";
import type { RootState } from "../store/store";

export default function Home() {
  // const dispatch = useDispatch();
  const isLoggedIn = useSelector((state: RootState) => state.auth.value);
  console.log(isLoggedIn);
  return (
    <div>
      <h1>Home Page</h1>
    </div>
  );
}
