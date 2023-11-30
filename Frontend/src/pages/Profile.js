import NoPage from "./NoPage";
import { useParams } from "react-router-dom";
import axios from "axios";

function Profile() {
    const { userId } = useParams();

    return (
        <>
            <h1>User ID: {userId}</h1>
        </>
    );
}

export default Profile;